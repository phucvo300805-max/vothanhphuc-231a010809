// DỮ LIỆU SẢN PHẨM (BÁNH & NƯỚC UỐNG)
const products = [
    {
        id: 1,
        name: "Bánh Kem Mật Ong Bee Sweet",
        category: "Bánh Kem",
        price: 320000,
        rating: 5,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80",
        description: "Bánh kem tươi hương mật ong rừng tự nhiên, mềm mịn ngon khó cưỡng."
    },
    {
        id: 2,
        name: "Cà Phê Muối Bee Special",
        category: "Nước Uống",
        price: 45000,
        rating: 5,
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80",
        description: "Cà phê đậm đà kết hợp lớp kem muối béo ngậy thơm ngon."
    },
    {
        id: 3,
        name: "Bánh Mousse Dâu Tây",
        category: "Bánh Mousse",
        price: 280000,
        rating: 4,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=500&q=80",
        description: "Lớp mousse dâu tươi chua ngọt thanh mát hòa quyện cùng cốt bánh gato."
    },
    {
        id: 4,
        name: "Trà Trái Cây Nhiệt Đới",
        category: "Nước Uống",
        price: 50000,
        rating: 5,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80",
        description: "Trà hoa quả giải nhiệt thanh mát với cam, sả và dâu tây tươi."
    },
    {
        id: 5,
        name: "Bánh Croissant Bơ Tươi",
        category: "Bánh Mì Ngọt",
        price: 35000,
        rating: 5,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80",
        description: "Bánh sừng bò chuẩn Pháp nhiều lớp giòn rụm, ngập tràn hương bơ."
    },
    {
        id: 6,
        name: "Trà Sữa Matcha Macchiato",
        category: "Nước Uống",
        price: 55000,
        rating: 4,
        image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=500&q=80",
        description: "Matcha Nhật Bản nguyên chất phủ lớp kem váng sữa béo nhẹ."
    },
    {
        id: 7,
        name: "Bánh Mousse Socola Đen",
        category: "Bánh Mousse",
        price: 290000,
        rating: 5,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80",
        description: "Socola nguyên chất 70% đậm vị, đắng nhẹ hậu vị ngọt trào dâng."
    },
    {
        id: 8,
        name: "Bánh Kem Matcha Choco",
        category: "Bánh Kem",
        price: 350000,
        rating: 4,
        image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=500&q=80",
        description: "Sự kết hợp hoàn hảo giữa trà xanh Nhật Bản và vụn socola giòn ngon."
    }
];

// DỮ LIỆU ĐÁNH GIÁ BAN ĐẦU
let reviews = [
    { name: "Minh Anh", rating: 5, comment: "Cà phê muối cực kỳ đậm đà và béo ngậy! Bánh kem mật ong ăn thanh ngọt không bị gắt.", time: "Vừa xong" },
    { name: "Hoàng Nam", rating: 5, comment: "Bánh Croissant thơm lừng mùi bơ, ship tới nơi vẫn còn giòn 🥐 Will buy again!", time: "2 giờ trước" }
];

// TRẠNG THÁI ỨNG DỤNG (STATE)
let cart = [];
let currentCategory = "ALL";
let searchQuery = "";
let selectedRating = 5;

// QUẢN LÝ THAO TÁC DOM
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const searchSpinner = document.getElementById('search-spinner');
const categoryFilters = document.getElementById('category-filters');
const emptyState = document.getElementById('empty-state');
const filterStatus = document.getElementById('filter-status');
const resultCount = document.getElementById('result-count');
const resetFilterBtn = document.getElementById('reset-filter-btn');

// Cart DOMs
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartPanel = document.getElementById('cart-panel');
const cartItemsContainer = document.getElementById('cart-items');
const cartBadge = document.getElementById('cart-badge');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Review DOMs
const reviewForm = document.getElementById('review-form');
const reviewsContainer = document.getElementById('reviews-container');
const starRating = document.getElementById('star-rating');

// FORMAT ĐỒNG VIỆT NAM (VND)
function formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// 1. KỸ THUẬT DEBOUNCE TỐI ƯU TÌM KIẾM
function debounce(func, delay = 400) {
    let timer;
    return function (...args) {
        searchSpinner.classList.remove('hidden');
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
            searchSpinner.classList.add('hidden');
        }, delay);
    };
}

// 2. LỌC SẢN PHẨM ĐỒNG THỜI (CATEGORY + SEARCH)
function filterProducts() {
    const filtered = products.filter(product => {
        const matchesCategory = currentCategory === 'ALL' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
        return matchesCategory && matchesSearch;
    });

    renderProducts(filtered);
    updateFilterStatus(filtered.length);
}

function updateFilterStatus(count) {
    resultCount.textContent = `${count} sản phẩm`;
    
    let statusText = "Hiển thị toàn bộ thực đơn";
    if (currentCategory !== 'ALL' && searchQuery) {
        statusText = `Lọc: "${currentCategory}" & Tìm: "${searchQuery}"`;
    } else if (currentCategory !== 'ALL') {
        statusText = `Danh mục: "${currentCategory}"`;
    } else if (searchQuery) {
        statusText = `Từ khóa: "${searchQuery}"`;
    }

    filterStatus.textContent = statusText;

    if (count === 0) {
        productGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
    } else {
        productGrid.classList.remove('hidden');
        emptyState.classList.add('hidden');
    }
}

// 3. RENDER DANH SÁCH SẢN PHẨM
function renderProducts(items) {
    productGrid.innerHTML = items.map(product => `
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-100/80 flex flex-col justify-between group">
            <div>
                <div class="relative overflow-hidden aspect-video">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        ${product.category}
                    </span>
                </div>
                <div class="p-5">
                    <div class="flex items-center gap-1 text-amber-400 text-xs mb-2">
                        ${'<i class="fa-solid fa-star"></i>'.repeat(product.rating)}
                    </div>
                    <h3 class="font-bold text-amber-950 text-base mb-1 group-hover:text-amber-600 transition-colors line-clamp-1">${product.name}</h3>
                    <p class="text-xs text-amber-700/80 line-clamp-2 leading-relaxed mb-4">${product.description}</p>
                </div>
            </div>
            <div class="p-5 pt-0 flex items-center justify-between mt-auto">
                <span class="font-bold text-amber-600 text-lg">${formatMoney(product.price)}</span>
                <button onclick="addToCart(${product.id})" class="bg-amber-100 hover:bg-amber-500 text-amber-900 hover:text-amber-950 w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-90">
                    <i class="fa-solid fa-plus text-base"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// 4. QUẢN LÝ GIỎ HÀNG (THÊM, SỬA SỐ LƯỢNG, XÓA)
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showToast(`Đã thêm "${product.name}" vào giỏ!`);
}

function updateCartQuantity(productId, delta) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += delta;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartBadge.textContent = totalItems;
    cartTotal.textContent = formatMoney(totalPrice);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-12 text-amber-700/60">
                <i class="fa-solid fa-basket-shopping text-5xl mb-3 text-amber-200"></i>
                <p class="text-sm font-medium">Giỏ hàng của bạn đang trống</p>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="flex items-center gap-4 py-3">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl border border-amber-100">
            <div class="flex-grow min-w-0">
                <h4 class="font-bold text-sm text-amber-950 truncate">${item.name}</h4>
                <p class="text-xs font-semibold text-amber-600">${formatMoney(item.price)}</p>
                <div class="flex items-center gap-2 mt-2">
                    <button onclick="updateCartQuantity(${item.id}, -1)" class="w-6 h-6 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center text-xs font-bold transition-colors">-</button>
                    <span class="text-xs font-bold text-amber-900 w-5 text-center">${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.id}, 1)" class="w-6 h-6 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center text-xs font-bold transition-colors">+</button>
                </div>
            </div>
            <button onclick="updateCartQuantity(${item.id}, -${item.quantity})" class="text-amber-400 hover:text-red-500 p-2 transition-colors">
                <i class="fa-solid fa-trash-can text-sm"></i>
            </button>
        </div>
    `).join('');
}

// TOGGLE DRAWER GIỎ HÀNG
function toggleCart(open) {
    if (open) {
        cartDrawer.classList.remove('pointer-events-none');
        cartBackdrop.classList.remove('opacity-0');
        cartPanel.classList.remove('translate-x-full');
    } else {
        cartBackdrop.classList.add('opacity-0');
        cartPanel.classList.add('translate-x-full');
        setTimeout(() => {
            cartDrawer.classList.add('pointer-events-none');
        }, 300);
    }
}

// 5. QUẢN LÝ ĐÁNH GIÁ (REVIEWS)
function renderReviews() {
    reviewsContainer.innerHTML = reviews.map(rev => `
        <div class="bg-amber-50/30 p-4 rounded-xl border border-amber-100/60 space-y-2">
            <div class="flex items-center justify-between">
                <span class="font-bold text-sm text-amber-950 flex items-center gap-2">
                    <div class="w-7 h-7 bg-amber-200 text-amber-900 rounded-full flex items-center justify-center text-xs font-bold">
                        ${rev.name.charAt(0)}
                    </div>
                    ${rev.name}
                </span>
                <span class="text-[10px] text-amber-600 font-semibold bg-amber-100/50 px-2 py-0.5 rounded-full">${rev.time}</span>
            </div>
            <div class="flex items-center gap-1 text-amber-400 text-xs">
                ${'<i class="fa-solid fa-star"></i>'.repeat(rev.rating)}
            </div>
            <p class="text-xs text-amber-900/80 leading-relaxed">${rev.comment}</p>
        </div>
    `).join('');
}

// TOAST NOTIFICATION (THÔNG BÁO THÔNG MINH)
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `bg-amber-950 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-medium flex items-center gap-3 transition-all duration-300 translate-y-5 opacity-0 border border-amber-800`;
    toast.innerHTML = `
        <span class="text-amber-400">🐝</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-y-5', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-5');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// LẮNG NGHE SỰ KIỆN KHỞI TẠO (EVENT LISTENERS)
document.addEventListener('DOMContentLoaded', () => {
    // Render ban đầu
    renderProducts(products);
    renderReviews();

    // Debounced Search Event
    const handleSearch = debounce((e) => {
        searchQuery = e.target.value;
        filterProducts();
    }, 400);
    
    searchInput.addEventListener('input', handleSearch);

    // Category Filter Buttons Event
    categoryFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.getAttribute('data-category');
            filterProducts();
        }
    });

    // Reset Button Event
    resetFilterBtn.addEventListener('click', () => {
        searchQuery = '';
        currentCategory = 'ALL';
        searchInput.value = '';
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-category') === 'ALL');
        });
        filterProducts();
    });

    // Cart Events
    cartBtn.addEventListener('click', () => toggleCart(true));
    closeCartBtn.addEventListener('click', () => toggleCart(false));
    cartBackdrop.addEventListener('click', () => toggleCart(false));

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast("Giỏ hàng của bạn đang trống!");
            return;
        }
        showToast("Đặt hàng thành công! Bee Bakery sẽ giao sớm đến bạn 💛");
        cart = [];
        updateCartUI();
        toggleCart(false);
    });

    // Star Rating Event
    starRating.addEventListener('click', (e) => {
        if (e.target.classList.contains('fa-star')) {
            selectedRating = parseInt(e.target.getAttribute('data-value'));
            const stars = starRating.querySelectorAll('i');
            stars.forEach((star, index) => {
                if (index < selectedRating) {
                    star.classList.add('text-amber-400');
                    star.classList.remove('text-amber-200');
                } else {
                    star.classList.remove('text-amber-400');
                    star.classList.add('text-amber-200');
                }
            });
        }
    });

    // Review Form Submit Event
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reviewer-name').value.trim();
        const comment = document.getElementById('reviewer-comment').value.trim();

        if (!name || !comment) return;

        reviews.unshift({
            name,
            rating: selectedRating,
            comment,
            time: "Vừa xong"
        });

        renderReviews();
        reviewForm.reset();
        selectedRating = 5;
        showToast("Cảm ơn bạn đã gửi đánh giá cho quán!");
    });
});