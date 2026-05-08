


import './cart.js';

let allProducts = [];
let selectedCategory = "All";
let debounceTimer;

async function loadProducts(category = "All") {
    const container = document.getElementById('product-container');
    if (!container) return;

    try {
        // 1. Trigger: User selection leads to a Request
        // 2. Request: The browser sends a specific "envelope" to the Server
        const url = category === "All"
            ? '/api/products'
            : `/api/products?category=${encodeURIComponent(category)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Server returned an error status');
        }
        // 3. Response: Receiving the "Package" (JSON)
        const result = await response.json();
        allProducts = result.data;
        
        window.allProducts = allProducts;
        renderProducts(allProducts);

    } catch (error) {
        console.error("Fetch Error:", error);
        container.innerHTML = `<p class="text-danger">Failed to load: ${error.message}</p>`;
    }
}

// 5. ฟังก์ชันสำหรับวาด HTML สินค้า (แยกออกมาเพื่อให้เรียกใช้ซ้ำได้)
function renderProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = products.map(product => `
        <div class="col-sm-6 col-md-4">
            <div class="card h-100" data-product-id="${product.id}">
                <img src="${product.urlimage || product.image}" class="card-img-top" style="height:250px; object-fit:cover;">
                <div class="card-body">
                    <p class="text-muted small">${product.category || 'Product'}</p>
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

    if (!applyBtn) return; // Exit if apply button doesn't exist

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

function initializeSwiperCarousels() {
	const swiperContainers = document.querySelectorAll('.swiper-container');

	swiperContainers.forEach((swiperContainer) => {
		const speed = swiperContainer.getAttribute('data-speed') || 400;
		const spaceBetween = swiperContainer.getAttribute('data-space-between') || 20;
		const paginationEnabled = swiperContainer.getAttribute('data-pagination') === 'true';
		const navigationEnabled = swiperContainer.getAttribute('data-navigation') === 'true';
		const autoplayEnabled = swiperContainer.getAttribute('data-autoplay') === 'true';
		const autoplayDelay = swiperContainer.getAttribute('data-autoplay-delay') || 3000;
		const paginationType = swiperContainer.getAttribute('data-pagination-type') || 'bullets';
		const centerSlides = swiperContainer.getAttribute('data-center-slides') === 'true';
		const effect = swiperContainer.getAttribute('data-effect') || 'slide';
		const thumbsEnabled = swiperContainer.getAttribute('data-thumbs') === 'true';

		let breakpoints = {};
		const breakpointsData = swiperContainer.getAttribute('data-breakpoints');
		if (breakpointsData) {
			try {
				breakpoints = JSON.parse(breakpointsData);
			} catch (error) {
				console.error('Error parsing breakpoints data:', error);
			}
		}

		const swiperOptions = {
			speed: parseInt(speed),
			spaceBetween: parseInt(spaceBetween),
			breakpoints: breakpoints,
			slidesPerView: 'auto',
			effect: effect,
		};

		if (effect === 'fade') {
			swiperOptions.fadeEffect = { crossFade: true };
		}

		if (centerSlides) {
			swiperOptions.centeredSlides = true;
		}

		// ✅ Pagination
		if (paginationEnabled) {
			const paginationEl = swiperContainer.querySelector('.swiper-pagination');
			if (paginationEl) {
				swiperOptions.pagination = {
					el: paginationEl,
					clickable: true,
					type: paginationType,
				};
			}
		}

		// ✅ Navigation
		if (navigationEnabled) {
			const nextButton = swiperContainer.querySelector('.swiper-button-next');
			const prevButton = swiperContainer.querySelector('.swiper-button-prev');
			swiperOptions.navigation = {
				nextEl: nextButton,
				prevEl: prevButton,
			};
		}

		// ✅ Autoplay
		if (autoplayEnabled) {
			swiperOptions.autoplay = { delay: parseInt(autoplayDelay) };
		}

		// ✅ Thumbs (optional)
		let thumbsSwiper;
		if (thumbsEnabled) {
			const thumbsContainer = swiperContainer.nextElementSibling;
			if (thumbsContainer && thumbsContainer.classList.contains('swiper-thumbs')) {
				thumbsSwiper = new Swiper(thumbsContainer, {
					spaceBetween: 10,
					slidesPerView: 4,
					freeMode: true,
					watchSlidesProgress: true,
				});
				swiperOptions.thumbs = { swiper: thumbsSwiper };
			}
		}

		// ✅ Initialize Swiper
		new Swiper(swiperContainer, swiperOptions);
	});
}

// ✅ Optional: Reinitialize when modal is shown
const modalElement = document.getElementById('quickViewModal');
if (modalElement) {
	modalElement.addEventListener('shown.bs.modal', function () {
		initializeSwiperCarousels();
	});
}


document.addEventListener('DOMContentLoaded', () => {
    Filter(); // เรียกใช้งานระบบกรอง
    Search(); // เรียกใช้งานระบบค้นหา
    initializeSwiperCarousels();
    loadProducts();
});