const checkoutService = require('../services/checkoutService');
const { getOne } = require('../db');

// Helper function to map string product IDs to numeric IDs
async function mapProductId(productId) {
  // If it's already a number, return it
  if (typeof productId === 'number') return productId;

  // If it's a string like "prod_001", we need to find the corresponding numeric ID
  // For now, we'll try to extract the number from the string
  if (typeof productId === 'string' && productId.startsWith('prod_')) {
    const numId = parseInt(productId.replace('prod_', ''));
    if (!isNaN(numId)) return numId;
  }

  // If we can't map it, try to find by name or other criteria
  // For now, return the original ID and let the database handle it
  return productId;
}

async function checkout(req, res) {
  try {
    const { cartItems, email, creditCard, customerName, customerAddress, customerPhone, userId } = req.body;
    const errors = {};

    // 1. Validate cart items
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      errors.cartItems = 'Cart is empty';
    }

    // 2. Validate email using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Invalid email format';
    }

    // 3. Validate 16-digit credit card
    const cardRegex = /^\d{16}$/;
    if (!creditCard || !cardRegex.test(creditCard.toString().replace(/\s/g, ''))) {
      errors.creditCard = 'Credit card must be 16 digits';
    }

    // 4. Validate shipping information
    if (!customerName || customerName.trim().length < 2) {
      errors.customerName = 'Name must be at least 2 characters';
    }
    if (!customerAddress || customerAddress.trim().length < 10) {
      errors.customerAddress = 'Address must be at least 10 characters';
    }
    const phoneRegex = /^[\+]?[0-9\-\s\(\)]{10,}$/;
    if (!customerPhone || !phoneRegex.test(customerPhone.replace(/\s/g, ''))) {
      errors.customerPhone = 'Invalid phone number format';
    }

    // If validation fails, return 400 with errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    // 4. Get user_id from email if not provided
    let user_id = userId;
    if (!user_id) {
      const user = await getOne('SELECT id FROM users WHERE email = ?', [email]);
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
          errors: { email: 'No account associated with this email' }
        });
      }
      user_id = user.id;
    }

    // 5. Process each cart item and save as individual orders
    try {
      const savedOrders = [];

      for (const item of cartItems) {
        // Map the product ID to numeric ID
        const numericProductId = await mapProductId(item.id);

        // Verify the product exists in database
        const product = await getOne('SELECT * FROM products WHERE id = ?', [numericProductId]);
        if (!product) {
          return res.status(400).json({
            message: `Product with ID ${item.id} not found`,
            errors: { product: `Invalid product ID: ${item.id}` }
          });
        }

        const order = await checkoutService.saveOrder({
          user_id,
          product_id: numericProductId,
          quantity: item.quantity,
          total_price: product.price * item.quantity,
          customer_name: customerName.trim(),
          customer_address: customerAddress.trim(),
          customer_phone: customerPhone.replace(/\s/g, '')
        });
        savedOrders.push(order);
      }

      const orderTotal = cartItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      return res.status(200).json({
        message: 'Order placed successfully',
        orders: savedOrders,
        totalAmount: orderTotal,
        itemCount: cartItems.length,
        shippingInfo: {
          name: customerName.trim(),
          address: customerAddress.trim(),
          phone: customerPhone.replace(/\s/g, '')
        }
      });
    } catch (saveError) {
      return res.status(400).json({
        message: 'Failed to save order',
        error: saveError.message,
        errors: { order: 'Unable to process order' }
      });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      errors: { server: error.message }
    });
  }
}

module.exports = {
  checkout
};
