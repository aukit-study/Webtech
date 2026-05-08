const checkoutService = require('../services/checkoutService');

/**
 * CheckoutController - Handles HTTP requests/responses for checkout
 * Delegates business logic to CheckoutService
 * Delegates data access to repositories (through service)
 */

/**
 * Checkout handler
 * HTTP: POST /api/checkout
 * Controllers responsibility:
 *   - Extract request body
 *   - Call service for validation and business logic
 *   - Format HTTP response with appropriate status codes
 *   - Handle errors and return meaningful error messages
 */
async function checkout(req, res) {
  try {
    const { cartItems, email, creditCard, customerName, customerAddress, customerPhone, userId } = req.body;

    // Prepare checkout data
    const checkoutData = {
      cartItems,
      email,
      creditCard,
      customerName,
      customerAddress,
      customerPhone,
      userId
    };

    // Call service to validate all checkout data
    const validation = checkoutService.validateCheckoutData(checkoutData);
    if (!validation.valid) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Call service to process checkout and save orders
    const result = await checkoutService.processCheckout(checkoutData);

    return res.status(200).json({
      message: 'Order placed successfully',
      orders: result.orders,
      totalAmount: result.totalAmount,
      itemCount: result.itemCount,
      shippingInfo: result.shippingInfo
    });

  } catch (error) {
    console.error('CheckoutController.checkout error:', error);

    // Handle specific error cases
    if (error.message.includes('User not found')) {
      return res.status(404).json({
        message: 'User not found',
        errors: { email: 'No account associated with this email please register this email for purchases' }
      });
    }

    if (error.message.includes('Product with ID')) {
      return res.status(400).json({
        message: 'Invalid product in cart',
        errors: { product: error.message }
      });
    }

    // Generic error response
    return res.status(500).json({
      message: 'Internal server error',
      errors: { server: error.message }
    });
  }
}

module.exports = {
  checkout
};
