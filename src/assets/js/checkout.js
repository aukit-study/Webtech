document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkout-form');
  const cardInput = document.getElementById('creditCard');
  
  // Display cart items
  displayCartSummary();

  // Format credit card input
  cardInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 16) {
      value = value.slice(0, 16);
    }
    e.target.value = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  });

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const creditCard = document.getElementById('creditCard').value.replace(/\s/g, '');
    const customerName = document.getElementById('customerName').value.trim();
    const customerAddress = document.getElementById('customerAddress').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();

    // Get cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('furnitureCart')) || [];

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          email,
          creditCard,
          customerName,
          customerAddress,
          customerPhone
        })
      });

      const result = await response.json();

      // Clear all error messages
      document.querySelectorAll('.text-danger').forEach(el => el.classList.add('d-none'));
      document.getElementById('error-message').classList.add('d-none');
      document.getElementById('success-message').classList.add('d-none');

      if (response.status === 200) {
        // Success - clear cart and redirect
        document.getElementById('success-message').classList.remove('d-none');
        localStorage.removeItem('furnitureCart');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      } else {
        // Validation failed - show errors WITHOUT clearing cart
        if (result.errors) {
          Object.keys(result.errors).forEach(field => {
            const errorElement = document.getElementById(`${field}-error`);
            if (errorElement) {
              errorElement.textContent = result.errors[field];
              errorElement.classList.remove('d-none');
            }
          });
        }

        // Show main error message if no specific field errors
        if (!result.errors || Object.keys(result.errors).length === 0) {
          const errorDiv = document.getElementById('error-message');
          errorDiv.textContent = result.message || 'Checkout failed';
          errorDiv.classList.remove('d-none');
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      const errorDiv = document.getElementById('error-message');
      errorDiv.textContent = 'Unable to connect to server';
      errorDiv.classList.remove('d-none');
    }
  });

  function displayCartSummary() {
    const cartItems = JSON.parse(localStorage.getItem('furnitureCart')) || [];
    const summaryDiv = document.getElementById('cart-summary');
    const totalDiv = document.getElementById('order-total');

    if (cartItems.length === 0) {
      summaryDiv.innerHTML = '<p class="text-danger">Your cart is empty</p>';
      totalDiv.textContent = '$0.00';
      return;
    }

    let total = 0;
    const html = cartItems.map(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      return `
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <p class="mb-1">${item.name}</p>
            <small class="text-muted">Qty: ${item.quantity}</small>
          </div>
          <span class="fw-semibold">$${subtotal.toFixed(2)}</span>
        </div>
      `;
    }).join('');

    summaryDiv.innerHTML = html;
    totalDiv.textContent = `$${total.toFixed(2)}`;
  }
});

