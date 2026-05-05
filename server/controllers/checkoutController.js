const checkoutService = require('../services/checkoutService');

async function checkout(req, res) {
  try {
    const { cartItems, email, creditCard } = req.body;
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

    // If validation fails, return 400 with errors (don't clear cart)
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors 
      });
    }

    // 4. Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // 5. Try to save the order
    try {
      const order = await checkoutService.saveOrder({
        email,
        creditCard: creditCard.toString().slice(-4).padStart(16, '*'), // Mask card
        items: cartItems,
        total,
        timestamp: new Date().toISOString()
      });

      return res.status(200).json({
        message: 'Order placed successfully',
        order
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
