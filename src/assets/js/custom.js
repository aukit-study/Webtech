
// Custom JS
document.addEventListener('DOMContentLoaded', () => {
  console.log('Bootstrap + Vite setup is ready!');
  
  // --- Load Products from JSON ---
  async function loadProducts() {
    try {
      const response = await fetch('./data/products.json');
      const products = await response.json();
      renderProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  // Render products to the container
  function renderProducts(products) {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = products.map(product => `
      <div class="swiper-slide">
        <div class="product-card">
          <a href="#"><img src="${product.urlimage}" alt="${product.name}" class="img-fluid"></a>
          <div class="text-center">
            <h3 class="mt-3 h5">
              <a href="#">${product.name}</a>
            </h3>
            <div class="">
              <span class="">$${product.price.toFixed(2)}</span>
            </div>
            <button class="btn btn-primary mt-2 add-to-cart-btn" data-id="${product.name.toLowerCase().replace(/\s+/g, '-')}" data-name="${product.name}" data-price="${product.price}" data-img="${product.urlimage}">Add to Cart</button>
          </div>
        </div>
      </div>
    `).join('');

    // Setup add to cart buttons for dynamically loaded products
    setupDynamicAddToCartButtons();
  }

  // Handle Add to Cart for dynamically loaded products
  function setupDynamicAddToCartButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const product = {
          id: btn.getAttribute('data-id'),
          name: btn.getAttribute('data-name'),
          price: parseFloat(btn.getAttribute('data-price')),
          img: btn.getAttribute('data-img')
        };
        addToCart(product);
      });
    });
  }

  // --- Cart Logic ---
  const CART_KEY = 'furnish_cart';
  let cart = [];

  // Load cart from localStorage
  function loadCart() {
    const data = localStorage.getItem(CART_KEY);
    cart = data ? JSON.parse(data) : [];
  }

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  // Find product in cart
  function findCartItem(id) {
    return cart.find(item => item.id === id);
  }

  // Add product to cart
  function addToCart(product) {
    const existing = findCartItem(product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart();
    renderCart();
    updateCartCounter();
  }

  // Remove product from cart
  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
    updateCartCounter();
  }

  // Update product quantity
  function updateQty(id, qty) {
    const item = findCartItem(id);
    if (item) {
      item.qty = qty > 0 ? qty : 1;
      saveCart();
      renderCart();
      updateCartCounter();
    }
  }

  // Calculate total
  function getTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  // Render cart items in cartcanvas
  function renderCart() {
    const cartList = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!cartList) return;
    if (cart.length === 0) {
      cartList.innerHTML = '<p class="text-center text-muted">Your cart is empty.</p>';
      totalEl.textContent = '$0.00';
      checkoutBtn.disabled = true;
      return;
    }
    cartList.innerHTML = cart.map(item => `
      <div class="d-flex align-items-center mb-3 border-bottom pb-2 gap-3 cart-item">
        <img src="${item.img}" alt="${item.name}" style="width:56px;height:56px;object-fit:cover;" class="rounded">
        <div class="flex-grow-1">
          <div class="fw-semibold">${item.name}</div>
          <div class="small text-muted">$${item.price.toFixed(2)} x ${item.qty}</div>
          <div class="input-group input-group-sm mt-1" style="max-width:120px;">
            <button class="btn btn-outline-secondary btn-sm btn-qty-minus" data-id="${item.id}">-</button>
            <input type="number" min="1" class="form-control form-control-sm cart-qty-input" value="${item.qty}" data-id="${item.id}">
            <button class="btn btn-outline-secondary btn-sm btn-qty-plus" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="btn btn-outline-danger btn-sm btn-remove-cart" data-id="${item.id}">&times;</button>
      </div>
    `).join('');
    totalEl.textContent = `$${getTotal().toFixed(2)}`;
    checkoutBtn.disabled = false;
  }

  // Update cart counter in navbar
  function updateCartCounter() {
    const counters = document.querySelectorAll('.bi-cart ~ span');
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    counters.forEach(el => el.textContent = `(${count})`);
  }

  // Handle Add to Cart buttons
  function setupAddToCartButtons() {
    document.querySelectorAll('.product-card').forEach(card => {
      const btn = card.querySelector('.btn.btn-primary');
      if (!btn) return;
      btn.addEventListener('click', e => {
        e.preventDefault();
        const img = card.querySelector('img').getAttribute('src');
        const name = card.querySelector('h3').innerText.trim();
        const priceText = card.querySelector('span:not(.text-decoration-line-through)').innerText.replace('$','');
        const id = name.toLowerCase().replace(/\s+/g, '-');
        addToCart({ id, name, price: parseFloat(priceText), img });
      });
    });
  }

  // Handle cart item actions
  function setupCartActions() {
    const cartList = document.getElementById('cart-items-list');
    if (!cartList) return;
    cartList.addEventListener('click', e => {
      if (e.target.classList.contains('btn-remove-cart')) {
        const id = e.target.getAttribute('data-id');
        removeFromCart(id);
      } else if (e.target.classList.contains('btn-qty-plus')) {
        const id = e.target.getAttribute('data-id');
        const item = findCartItem(id);
        if (item) updateQty(id, item.qty + 1);
      } else if (e.target.classList.contains('btn-qty-minus')) {
        const id = e.target.getAttribute('data-id');
        const item = findCartItem(id);
        if (item && item.qty > 1) updateQty(id, item.qty - 1);
      }
    });
    cartList.addEventListener('change', e => {
      if (e.target.classList.contains('cart-qty-input')) {
        const id = e.target.getAttribute('data-id');
        const qty = parseInt(e.target.value, 10);
        if (!isNaN(qty) && qty > 0) updateQty(id, qty);
      }
    });
  }

  // Open cartcanvas when cart icon clicked
  function setupCartCanvasTrigger() {
    document.querySelectorAll('[data-bs-toggle="cartcanvas"]').forEach(el => {
      el.addEventListener('click', e => {
        const cartCanvas = document.getElementById('cartcanvasExample');
        if (cartCanvas && window.bootstrap) {
          const offcanvas = window.bootstrap.Offcanvas.getOrCreateInstance(cartCanvas);
          offcanvas.show();
        }
      });
    });
  }

  // Initial setup
  loadProducts();
  loadCart();
  renderCart();
  updateCartCounter();
  setupAddToCartButtons();
  setupCartActions();
  setupCartCanvasTrigger();
});
