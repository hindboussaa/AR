// ================================
// PRODUCTS
// ================================
const products = [
  { id:1, name:"Yara Pink 50ml", price:15.99, img:"images/yara1.png" },
  { id:2, name:"Choco Musk Pistachio", price:6.99, img:"images/CHOCO MISK.png" },
  { id:3, name:"Dirham Oud 100ml", price:19.99, img:"images/dirham.png" },
  { id:4, name:"Qaed Al Fursan Unlimited", price:21.99, img:"images/forsan.png" },
  { id:5, name:"Mousuf Ramadi", price:19.99, img:"images/mosofgreen.png" },
  { id:6, name:"Yara Pink 50ml", price:15.99, img:"images/pink.png" },
  { id:7, name:"Choco Musk Pistachio", price:6.99, img:"images/silver.png" },
  { id:8, name:"Dirham Oud 100ml", price:19.99, img:"images/dirham.png" },
  { id:9, name:"Qaed Al Fursan Unlimited", price:21.99, img:"images/ily.png" },
  { id:10, name:"Mousuf Ramadi", price:19.99, img:"images/amira.png" },
  { id:11, name:"Mayar by Lattafa", price:26.99, img:"images/mayar.png" }
];

// ================================
// CART
// ================================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================================
// ELEMENTS
// ================================
const productsContainer = document.querySelector(".products-grid");
const cartCount = document.querySelector(".cart-icon span");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartIcon = document.querySelector(".cart-icon");

const shippingText = document.querySelector(".shipping-text");
const progressFill = document.querySelector(".progress-fill");

// ================================
// SAVE CART
// ================================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================================
// RENDER PRODUCTS (FIXED)
// ================================
function renderProducts() {
  if (!productsContainer) return;

  productsContainer.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>£${p.price.toFixed(2)}</p>
      <button onclick="addToCart(${p.id}, this)">Add to Cart</button>
    </div>
  `).join("");
}

// ================================
// ADD TO CART (SAFE)
// ================================
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(i => i.id === id);

  if (existing) existing.quantity++;
  else cart.push({ ...product, quantity: 1 });

  saveCart();
  updateCart();
  openCart();
}

// ================================
// UPDATE CART (SAFE)
// ================================
function updateCart() {

  let total = 0;
  let count = 0;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <h3>Your basket is empty</h3>
      </div>
    `;
    cartTotal.innerText = "£0.00";
    cartCount.innerText = "0";
    updateShipping(0);
    return;
  }

  cart.forEach(item => {
    total += item.price * item.quantity;
    count += item.quantity;

    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}">
        <div>
          <h4>${item.name}</h4>
          <p>£${item.price}</p>

          <div>
            <button onclick="decreaseQty(${item.id})">-</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQty(${item.id})">+</button>
          </div>
        </div>
        <button onclick="removeItem(${item.id})">X</button>
      </div>
    `;
  });

  cartTotal.innerText = `£${total.toFixed(2)}`;
  cartCount.innerText = count;

  updateShipping(total);
}

// ================================
// CART ACTIONS
// ================================
function increaseQty(id){
  const item = cart.find(i => i.id === id);
  if (item) item.quantity++;
  saveCart();
  updateCart();
}

function decreaseQty(id){
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity--;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart();
  updateCart();
}

function removeItem(id){
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCart();
}

// ================================
// SHIPPING
// ================================
function updateShipping(total){
  const target = 50;
  let progress = Math.min((total / target) * 100, 100);

  progressFill.style.width = progress + "%";

  shippingText.innerHTML =
    total >= target
      ? "FREE shipping unlocked 🎉"
      : `Add £${(target - total).toFixed(2)} more for free shipping`;
}

// ================================
// CART UI
// ================================
function openCart(){
  cartSidebar.classList.add("active");
  cartOverlay.classList.add("active");
}

function closeBasket(){
  cartSidebar.classList.remove("active");
  cartOverlay.classList.remove("active");
}

cartIcon.addEventListener("click", openCart);
closeCart.addEventListener("click", closeBasket);
cartOverlay.addEventListener("click", closeBasket);

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeBasket();
});

// ================================
async function checkout() {

  if (cart.length === 0) {
    alert("Your basket is empty");
    return;
  }

  try {

    const response = await fetch("/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cart)
    });

    const data = await response.json();

    if (data.url) {
      localStorage.removeItem("cart");
      window.location.href = data.url;
    } else {
      alert(data.error || "Checkout failed");
    }

  } catch (error) {
    console.log(error);
    alert("Server error");
  }
}
// ================================
// INIT
// ================================
renderProducts();
updateCart();