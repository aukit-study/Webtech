

// Import Bootstrap JS
import * as bootstrap from 'bootstrap';
import './custom.js';
import './swiper.js'
import './cart.js'

// Import SCSS
import '../scss/style.scss';

let allProducts = [];
let selectedCategory = "All";
let debounceTimer;

async function loadProducts() {
    const container = document.getElementById('product-container');
    
    // ตรวจสอบว่ามี container นี้อยู่ในหน้าเว็บไหม (กัน Error กรณีรัน script ในหน้าอื่น)
    if (!container) return;

    try {
        const response = await fetch('./assets/data/products.json');

        if (!response.ok) {
            throw new Error('ไม่สามารถโหลดไฟล์ products.json ได้ ตรวจสอบ Path อีกครั้ง');
        }

        // 2. เก็บข้อมูลลงในตัวแปรกลาง
        allProducts = await response.json();
        
        // Make allProducts globally accessible for cart functionality
        window.allProducts = allProducts;
        
        // 3. แสดงผลสินค้าทั้งหมดในครั้งแรก
        renderProducts(allProducts);

        // เรียกใช้ระบบจัดการปุ่มกรองหมวดหมู่หลังจากโหลดข้อมูลเสร็จ
        Filter();
        Search();

    } catch (error) {
        console.error("Fetch Error:", error);
        container.innerHTML = `<div class="col-12 text-center"><p class="text-danger">เกิดข้อผิดพลาด: ${error.message}</p></div>`;
    }
}

// 5. ฟังก์ชันสำหรับวาด HTML สินค้า (แยกออกมาเพื่อให้เรียกใช้ซ้ำได้)
function renderProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = products.map(product => `
        <div class="col-sm-6 col-md-4">
            <div class="card h-100" data-product-id="${product.id}">
                <img src="${product.urlimage}" class="card-img-top" style="height:250px; object-fit:cover;">
                <div class="card-body">
                    <p class="text-muted small">${product.category}</p>
                    <h5 class="card-title">${product.name}</h5>
                    <p class="fw-bold text-primary">$${product.price}</p>
                    <button class="btn btn-primary btn-sm btn-add-to-cart">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

// 6. ฟังก์ชันจัดการการคลิกเลือกหมวดหมู่
function Filter() {
    const filterLinks = document.querySelectorAll('.filter-link');
    const applyBtn = document.getElementById('apply-filter-btn');

    // 1. เมื่อคลิกที่ชื่อหมวดหมู่ (แค่เลือกไว้ ยังไม่กรอง)
    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // ลบ class active จากตัวเก่าและใส่ให้ตัวที่เพิ่งกด
            filterLinks.forEach(l => l.classList.remove('fw-bold', 'text-primary'));
            link.classList.add('fw-bold', 'text-primary');

            // เก็บค่าหมวดหมู่ไว้ในตัวแปร
            selectedCategory = link.getAttribute('data-category');
        });
    });

    // 2. เมื่อคลิกปุ่ม Apply Filters ถึงจะทำการกรองจริง
    applyBtn.addEventListener('click', () => {
        if (selectedCategory === "All") {
            renderProducts(allProducts);
        } else {
            const filtered = allProducts.filter(p => p.category === selectedCategory);
            renderProducts(filtered);
        }
        
        // สั่งให้หน้าจอเลื่อนกลับขึ้นไปดูสินค้า (Optional)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function Search() {
    const searchInput = document.getElementById('product-search');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase(); // แปลงเป็นตัวพิมพ์เล็กเพื่อให้ค้นหาง่ายขึ้น

        // 1. เคลียร์ Timer เดิมทิ้งทุกครั้งที่พิมพ์ตัวอักษรใหม่
        clearTimeout(debounceTimer);
        // 2. ตั้ง Timer ใหม่ให้ทำงานหลังจากหยุดพิมพ์ 500ms
        debounceTimer = setTimeout(() => {
            console.log("กำลังค้นหา:", searchTerm); // ตรวจสอบใน Console ได้

            // 3. เริ่มทำการ Filter ข้อมูลหลังจากหยุดพิมพ์ครบ 0.5 วินาที
            const filteredProducts = allProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );

            // แสดงผลสินค้าที่กรองแล้ว
            renderProducts(filteredProducts);
        }, 500);
    });
}



document.addEventListener('DOMContentLoaded', loadProducts);