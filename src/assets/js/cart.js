 // Cart functionality
class ShoppingCart {
    constructor() {
        this.cart = this.loadCartFromStorage();
        this.init();
    }

    // Initialize cart functionality
    init() {
        this.attachAddToCartListeners();
        this.updateCartUI();
    }

    // Load cart from localStorage
    loadCartFromStorage() {
        const savedCart = localStorage.getItem('furnitureCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveToLocalStorage() {
        localStorage.setItem('furnitureCart', JSON.stringify(this.cart));
    }

    // Add product to cart
    addToCart(productID) {
        // Use .find() to check if the product exists in cart
        const existingItem = this.cart.find(item => item.id === productID);

        if (existingItem) {
            // If it exists, increment the quantity
            existingItem.quantity += 1;
        } else {
            // If not, find the product from allProducts using the productID and push it to the cart
            const product = window.allProducts.find(p => p.id === productID);
            if (product) {
                this.cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.urlimage,
                    quantity: 1
                });
            } else {
                console.error('Product not found:', productID);
                return;
            }
        }

        // After updating the array, call saveToLocalStorage() and updateCartUI()
        this.saveToLocalStorage();
        this.updateCartUI();

        // Show success message
        const product = window.allProducts.find(p => p.id === productID);
        if (product) {
            this.showNotification(`${product.name} has been added to your cart!`, 'success');
        }
    }

    // Remove product from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.updateCartUI();
    }

    // Update product quantity in cart
    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCartToStorage();
            this.updateCartUI();
        }
    }

    // Get cart items
    getCartItems() {
        return this.cart;
    }

    // Get total number of items in cart
    getCartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Get total price of cart
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Clear entire cart
    clearCart() {
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartUI();
    }

    // Update cart display (cart icon, cart modal, etc.)
    updateCartUI() {
        this.updateCartIcon();
        this.updateCartModal();
    }

    // Update cart icon with item count
    updateCartIcon() {
        // อ้างอิงไปยัง ID #cart-count ที่อยู่ใน HTML[cite: 9]
        const cartCountElement = document.getElementById('cart-count');

        if (cartCountElement) {
            const itemCount = this.getCartItemCount(); // คำนวณจำนวนสินค้าทั้งหมดจากตะกร้า
            cartCountElement.textContent = itemCount;

            // จัดการการแสดงผล (ถ้าไม่มีสินค้าให้ซ่อน หรือแสดงเป็น 0)
            if (itemCount > 0) {
                cartCountElement.style.display = 'inline-block';
            } else {
                // คุณสามารถเลือกได้ว่าจะให้แสดงเลข 0 หรือซ่อนไปเลย
                cartCountElement.textContent = '0'; 
                // cartCountElement.style.display = 'none'; // หากต้องการซ่อนเมื่อไม่มีสินค้า
            }
        }
    }

    // Update cart modal content
    updateCartModal() {
        const cartItemsContainer = document.getElementById('cart-items-list');
        const cartTotalElement = document.getElementById('cart-total');

        if (cartItemsContainer) {
            if (this.cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="text-center text-muted">Your cart is empty.</p>';
            } else {
                cartItemsContainer.innerHTML = this.cart.map(item => `
                    <div class="cart-item d-flex align-items-center mb-3 p-2 border rounded">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image me-3" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                        <div class="flex-grow-1">
                            <h6 class="mb-1" style="font-size: 14px;">${item.name}</h6>
                            <p class="mb-1 text-primary fw-bold" style="font-size: 13px;">$${item.price}</p>
                            <div class="d-flex align-items-center">
                                <button class="btn btn-sm btn-outline-secondary me-2" onclick="cart.decreaseQuantity('${item.id}')">-</button>
                                <span class="quantity-display">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary ms-2" onclick="cart.increaseQuantity('${item.id}')">+</button>
                                <button class="btn btn-sm btn-outline-danger ms-3" onclick="cart.removeFromCart('${item.id}')">Remove</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        if (cartTotalElement) {
            cartTotalElement.textContent = `$${this.getCartTotal().toFixed(2)}`;
        }

        // Enable/disable checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
        }
    }

    // Increase quantity of specific item
    increaseQuantity(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity + 1);
        }
    }

    // Decrease quantity of specific item
    decreaseQuantity(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            this.updateQuantity(productId, item.quantity - 1);
        }
    }

    // Attach event listeners to "Add to Cart" buttons
    attachAddToCartListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-add-to-cart') || e.target.closest('.btn-add-to-cart')) {
                e.preventDefault();
                const button = e.target.classList.contains('btn-add-to-cart') ? e.target : e.target.closest('.btn-add-to-cart');

                const productCard = button.closest('.card');
                const productId = productCard.dataset.productId;

                this.addToCart(productId);
            }
        });
    }

    // Show notification message
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 1000);
    }
}

// Create global cart instance
const cart = new ShoppingCart();

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartUI();
});

// Export for use in other modules
export default cart;