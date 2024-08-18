document.addEventListener('DOMContentLoaded', () => {
    let products = []; // Khai báo biến products toàn cục

    // Fetch sản phẩm từ db.json
    fetch('http://localhost:3000/sanpham')
        .then(response => {
            if (!response.ok) {
                throw new Error('Phản hồi mạng không thành công');
            }
            return response.json();
        })
        .then(data => {
            // Đảm bảo dữ liệu trả về là mảng
            if (Array.isArray(data)) {
                products = data; // Lưu dữ liệu vào biến products
                displayProducts(products); // Hiển thị sản phẩm
            } else {
                console.error('Dữ liệu lấy về không phải là mảng:', data);
            }
        })
        .catch(error => {
            console.error('Lỗi khi lấy sản phẩm:', error);
        });

    function displayProducts(products) {
        const productList = document.getElementById('productList');
        if (!productList) return; // Đảm bảo productList tồn tại
        productList.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-3';
            card.innerHTML = `
                <div class="card text-center">
                    <img src="${product.image}" class="card-img-top mb-3" alt="${product.name}" height="250">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">$${product.price.toFixed(2)}</p>
                        <div class="d-flex justify-content-center">
                            <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
            productList.appendChild(card);
        });
    }

    // Các sự kiện và xử lý khác
    document.getElementById('filterForm')?.addEventListener('change', (e) => {
        e.preventDefault();
        const category = document.getElementById('category').value;
        const priceSort = document.getElementById('priceSort').value;

        let filteredProducts = [...products]; // Đảm bảo bắt đầu với danh sách đầy đủ

        // Lọc sản phẩm dựa trên category và price sort
        if (category !== 'All') { 
            filteredProducts = filteredProducts.filter(product => product.category === category);
        }

        if (priceSort === 'lowToHigh') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (priceSort === 'highToLow') {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        displayProducts(filteredProducts);
    });

    document.getElementById('productList')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const id = e.target.dataset.id;
            const product = products.find(p => p.id == id);
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const existingItem = cartItems.find(item => item.id == id);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push({ ...product, quantity: 1 });
            }

            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCart();
        }
    });

    document.getElementById('cartItems')?.addEventListener('click', (e) => {
        if (e.target.dataset.action) {
            const id = e.target.dataset.id;
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const item = cartItems.find(i => i.id == id);

            if (e.target.dataset.action === 'increase') {
                item.quantity++;
            } else if (e.target.dataset.action === 'decrease') {
                item.quantity--;
                if (item.quantity <= 0) {
                    cartItems.splice(cartItems.indexOf(item), 1);
                }
            } else if (e.target.dataset.action === 'remove') {
                cartItems.splice(cartItems.indexOf(item), 1);
            }

            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCart();
        }
    });

    document.getElementById('checkoutButton')?.addEventListener('click', () => {
        localStorage.setItem('checkoutItems', JSON.stringify(JSON.parse(localStorage.getItem('cartItems')) || []));
        localStorage.removeItem('cartItems');
        updateCart();
        window.location.href = 'checkout.html';
    });

    function updateCart() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const cartVAT = document.getElementById('cartVAT');
        const cartTotalWithVAT = document.getElementById('cartTotalWithVAT');

        if (!cartItemsContainer) return; // Đảm bảo cartItemsContainer tồn tại

        cartItemsContainer.innerHTML = '';
        let total = 0;
        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'd-flex justify-content-between align-items-center mb-2';
            itemDiv.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" class="img-thumbnail me-2" style="width: 50px; height: 50px;">
                    <span>${item.name}</span>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-secondary me-2" data-id="${item.id}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn btn-sm btn-secondary ms-2" data-id="${item.id}" data-action="increase">+</button>
                    <button class="btn btn-sm btn-danger ms-2" data-id="${item.id}" data-action="remove">Remove</button>
                </div>
                <div class="text-end">
                    $${itemTotal.toFixed(2)}
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        const vat = total * 0.10;
        const totalWithVAT = total + vat;

        cartTotal.textContent = `$${total.toFixed(2)}`;
        cartVAT.textContent = `$${vat.toFixed(2)}`;
        cartTotalWithVAT.textContent = `$${totalWithVAT.toFixed(2)}`;
    }

    updateCart(); // Gọi updateCart để hiển thị giỏ hàng khi trang được tải
});
