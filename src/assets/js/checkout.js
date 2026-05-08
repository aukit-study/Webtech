document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkout-form');
  const cardInput = document.getElementById('creditCard');
  
  // Display cart items
  displayCartSummary();

  // Card Type Detection
  function detectCardType(number) {
    const re = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/
    };

    if (re.visa.test(number)) return 'visa';
    if (re.mastercard.test(number)) return 'mastercard';
    if (re.amex.test(number)) return 'amex';
    if (re.discover.test(number)) return 'discover';
    return 'unknown';
  }

  // Format credit card input
  cardInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    
    // Update Icon
    const cardType = detectCardType(value);
    const iconElement = document.getElementById('card-icon');
    if (iconElement) {
      iconElement.className = 'position-absolute top-50 end-0 translate-middle-y me-3 fs-4 transition-all ';
      switch(cardType) {
        case 'visa': iconElement.className += 'fa-brands fa-cc-visa text-primary'; break;
        case 'mastercard': iconElement.className += 'fa-brands fa-cc-mastercard text-warning'; break;
        case 'amex': iconElement.className += 'fa-brands fa-cc-amex text-info'; break;
        case 'discover': iconElement.className += 'fa-brands fa-cc-discover text-secondary'; break;
        default: iconElement.className += 'fa-regular fa-credit-card text-muted fs-5'; break;
      }
    }

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

      if (response.status === 200) {
        // Success - clear cart and redirect
        window.showNotification('Checkout successful!', 'success');
        localStorage.removeItem('furnitureCart');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
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
          window.showNotification(result.message || 'Checkout failed', 'info');
        } else {
          window.showNotification('Please check the highlighted fields', 'info');
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      window.showNotification('Unable to connect to server', 'info');
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

