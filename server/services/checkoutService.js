const OrderRepository = require('../repositories/OrderRepository');
const ProductRepository = require('../repositories/ProductRepository');
const UserRepository = require('../repositories/UserRepository');

/**
 * CheckoutService - Handles checkout business logic
 * Uses repositories for data access
 * Includes validation and order processing
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate credit card format (16 digits)
 * @param {string} creditCard - Credit card to validate
 * @returns {boolean} True if valid
 */
function isValidCreditCard(creditCard) {
  const cardRegex = /^\d{16}$/;
  return cardRegex.test(creditCard.toString().replace(/\s/g, ''));
}

/**
 * Validate customer name
 * @param {string} name - Name to validate
 * @returns {boolean} True if valid
 */
function isValidName(name) {
  return name && name.trim().length >= 2;
}

/**
 * Validate customer address
 * @param {string} address - Address to validate
 * @returns {boolean} True if valid
 */
function isValidAddress(address) {
  return address && address.trim().length >= 10;
}

/**
 * Validate phone number
 * @param {string} phone - Phone to validate
 * @returns {boolean} True if valid
 */
function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[0-9\-\s\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate cart items
 * @param {Array} cartItems - Items to validate
 * @returns {Object} Validation result { valid: boolean, error?: string }
 */
function validateCartItems(cartItems) {
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return { valid: false, error: 'Cart is empty' };
  }
  return { valid: true };
}

/**
 * Validate all checkout data
 * Business logic: comprehensive validation
 * @param {Object} checkoutData - Data to validate
 * @returns {Object} Validation result { valid: boolean, errors?: Object }
 */
function validateCheckoutData(checkoutData) {
  const { cartItems, email, creditCard, customerName, customerAddress, customerPhone } = checkoutData;
  const errors = {};

  // Validate cart
  const cartValidation = validateCartItems(cartItems);
  if (!cartValidation.valid) {
    errors.cartItems = cartValidation.error;
  }

  // Validate email
  if (!email || !isValidEmail(email)) {
    errors.email = 'Invalid email format';
  }

  // Validate credit card
  if (!creditCard || !isValidCreditCard(creditCard)) {
    errors.creditCard = 'Credit card must be 16 digits';
  }

  // Validate shipping info
  if (!isValidName(customerName)) {
    errors.customerName = 'Name must be at least 2 characters';
  }
  if (!isValidAddress(customerAddress)) {
    errors.customerAddress = 'Address must be at least 10 characters';
  }
  if (!customerPhone || !isValidPhone(customerPhone)) {
    errors.customerPhone = 'Invalid phone number format';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined
  };
}

/**
 * Get user ID from email (for guest checkout support)
 * Business logic: find user or throw error
 * @param {string} email - User email
 * @returns {Promise<number>} User ID
 */
async function getUserIdFromEmail(email) {
  try {
    const user = await UserRepository.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user.id;
  } catch (error) {
    throw new Error(`CheckoutService - getUserIdFromEmail failed: ${error.message}`);
  }
}

/**
 * Map product ID (support both numeric and string IDs)
 * @param {string|number} productId - Product ID to map
 * @returns {number} Numeric product ID
 */
function mapProductId(productId) {
  if (typeof productId === 'number') return productId;

  if (typeof productId === 'string' && productId.startsWith('prod_')) {
    const numId = parseInt(productId.replace('prod_', ''));
    if (!isNaN(numId)) return numId;
  }

  return productId;
}

/**
 * Verify product exists
 * @param {number} productId - Product ID to verify
 * @returns {Promise<Object>} Product object
 */
async function verifyProductExists(productId) {
  try {
    const product = await ProductRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    return product;
  } catch (error) {
    throw new Error(`CheckoutService - verifyProductExists failed: ${error.message}`);
  }
}

/**
 * Process checkout and save orders
 * Main business logic orchestrator
 * @param {Object} checkoutData - Checkout data
 * @returns {Promise<Object>} Checkout result with orders
 */
async function processCheckout(checkoutData) {
  try {
    const { cartItems, email, userId: providedUserId, customerName, customerAddress, customerPhone } = checkoutData;

    // Get user ID
    let userId = providedUserId;
    if (!userId) {
      userId = await getUserIdFromEmail(email);
    }

    // Process each cart item and save as individual orders
    const savedOrders = [];

    for (const item of cartItems) {
      // Map product ID
      const numericProductId = mapProductId(item.id);

      // Verify product exists
      const product = await verifyProductExists(numericProductId);

      // Business logic: calculate total price
      const totalPrice = product.price * item.quantity;

      // Save order via repository
      const order = await OrderRepository.create({
        user_id: userId,
        product_id: numericProductId,
        quantity: item.quantity,
        total_price: totalPrice,
        customer_name: customerName.trim(),
        customer_address: customerAddress.trim(),
        customer_phone: customerPhone.replace(/\s/g, '')
      });

      savedOrders.push(order);
    }

    // Business logic: calculate order total
    const orderTotal = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    return {
      success: true,
      orders: savedOrders,
      totalAmount: orderTotal,
      itemCount: cartItems.length,
      shippingInfo: {
        name: customerName.trim(),
        address: customerAddress.trim(),
        phone: customerPhone.replace(/\s/g, '')
      }
    };
  } catch (error) {
    throw new Error(`CheckoutService - processCheckout failed: ${error.message}`);
  }
}

module.exports = {
  validateCheckoutData,
  processCheckout,
  getUserIdFromEmail
};
