
const API_URL = 'https://fakestoreapi.com/products';
const productsContainer = document.getElementById('products');
const cartItemsContainer = document.getElementById('cartItems');
let products = []; 
let cart = [];

fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        products = data.slice(5, 9);
        renderProducts(products);
    })
    .catch(err => console.log(err));

function renderProducts(productList) {
    productsContainer.innerHTML = '';  

    if (productList.length === 0) {
        productsContainer.innerHTML = '<p>No products found</p>';  
        return;
    }

    productList.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <p>${product.title}</p>
            <p>₹${product.price}</p>
            <button onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Add to Cart</button>
        `;
        productsContainer.appendChild(productDiv);
    });
}

function addToCart(id, title, price) {
    let item = cart.find(product => product.id === id);
    if (item) {
        item.quantity++;  
    } else {
        cart.push({ id, title, price, quantity: 1 }); 
    }
    renderCart();
}

function renderCart() {
    cartItemsContainer.innerHTML = '';
    let totalMRP = 0;

    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <p>${item.title}</p>
            <p>₹${item.price * item.quantity}</p>
            <button onclick="decreaseQuantity(${item.id})">-</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQuantity(${item.id})">+</button>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
        totalMRP += item.price * item.quantity;
    });

    const discount = totalMRP > 500 ? 50 : 0;  
    const shipping = 20;
    const platformFee = 10;
    const totalAmount = totalMRP - discount + shipping + platformFee;

    document.getElementById('totalMRP').textContent = totalMRP;
    document.getElementById('discount').textContent = discount;
    document.getElementById('totalAmount').textContent = totalAmount;
}

function increaseQuantity(id) {
    const item = cart.find(product => product.id === id);
    if (item) {
        item.quantity++;
        renderCart();  
    }
}

function decreaseQuantity(id) {
    const item = cart.find(product => product.id === id);
    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            removeFromCart(id);  
        }
        renderCart();  
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);  
    renderCart(); 
}

document.getElementById('placeOrder').addEventListener('click', () => {
    alert('Order placed successfully!');
    cart = [];  
    renderCart(); 
});

function searchProducts() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchQuery));
    renderProducts(filteredProducts);
}
