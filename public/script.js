// ================================
// CART
// ================================
let products = [];
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
// LOAD PRODUCTS FROM BACKEND
// ================================
fetch("/products")
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts();
  });

// ================================
// SAVE CART
// ================================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================================
// RENDER PRODUCTS
// ================================
function renderProducts() {
  if (!productsContainer) return;

  productsContainer.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>£${p.price.toFixed(2)}</p>
      <button onclick="addToCart('${p._id}')">Add to Cart</button>
    </div>
  `).join("");
}

// ================================
// ADD TO CART
// ================================
function addToCart(id) {
  const product = products.find(p => p._id === id);
  if (!product) return;

  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: product._id,
      name: product.name,
      price: product.price,
      img: product.img,
      quantity: 1
    });
  }

  saveCart();
  updateCart();
  openCart();
}

// ================================
// UPDATE CART
// ================================
function updateCart() {
  let total = 0;
  let count = 0;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="empty-cart"><h3>Your basket is empty</h3></div>`;
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
        <img src="${item.img}" alt="${item.name}">

        <div class="cart-item-info">

          <div class="cart-top">
            <h4>${item.name}</h4>

            <button onclick="removeItem('${item.id}')">
              🗑
            </button>
          </div>

          <p>£${item.price.toFixed(2)}</p>

          <div>
            <button onclick="decreaseQty('${item.id}')">-</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQty('${item.id}')">+</button>
          </div>

        </div>
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
function increaseQty(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.quantity++;

  saveCart();
  updateCart();
}

function decreaseQty(id) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity--;

  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart();
  updateCart();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCart();
}

// ================================
// SHIPPING
// ================================
function updateShipping(total) {
  const target = 50;
  const progress = Math.min((total / target) * 100, 100);

  progressFill.style.width = progress + "%";

  shippingText.innerHTML =
    total >= target
      ? "FREE shipping unlocked 🎉"
      : `Add £${(target - total).toFixed(2)} more for free shipping`;
}

// ================================
// CART UI
// ================================
function openCart() {
  cartSidebar.classList.add("active");
  cartOverlay.classList.add("active");
}

function closeBasket() {
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
// CHECKOUT
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
      window.location.href = data.url;
    } else {
      alert(data.error || "Checkout failed");
    }
  } catch (err) {
    console.log(err);
    alert("Server error");
  }
}

// ================================
// INIT
// ================================
updateCart();