

// Import Bootstrap JS
import * as bootstrap from 'bootstrap';
import './custom.js';
import './swiper.js'

// Import SCSS
import '../scss/style.scss';

async function loadProducts() {
    const container = document.getElementById('product-container');
    
    // ตรวจสอบว่ามี container นี้อยู่ในหน้าเว็บไหม (กัน Error กรณีรัน script ในหน้าอื่น)
    if (!container) return;

    try {
        const response = await fetch('./assets/data/products.json');
        
        if (!response.ok) {
            throw new Error('ไม่สามารถโหลดไฟล์ products.json ได้ ตรวจสอบ Path อีกครั้ง');
        }

        const products = await response.json();

        container.innerHTML = products.map(product => `
            <div class="col-sm-6 col-md-4">
                <div class="card product-card h-100">
                    <a href="#">
                        <img src="${product.urlimage}" class="card-img-top" alt="${product.name}" style="height: 250px; object-fit: cover;">
                    </a>
                    <div class="card-body d-flex flex-column">
                        <p class="text-muted mb-1 text-uppercase small">${product.category}</p>
                        <h3 class="h5 mb-2"> 
                            <a href="#" class="text-decoration-none text-dark">${product.name}</a>
                        </h3>
                        <div class="mb-3">
                            <span class="fw-bold text-primary">$${product.price.toLocaleString()}</span>
                        </div>
                        <p class="small text-muted flex-grow-1">${product.description}</p>
                        <button class="btn btn-outline-primary btn-sm mt-auto">Add to Cart</button>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Fetch Error:", error);
        container.innerHTML = `<div class="col-12 text-center"><p class="text-danger">เกิดข้อผิดพลาด: ${error.message}</p></div>`;
    }
}

document.addEventListener('DOMContentLoaded', loadProducts);