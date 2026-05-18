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
// RENDER PRODUCTS
// ================================

function renderProducts() {

  if (!productsContainer) return;

  productsContainer.innerHTML = "";

  products.forEach(product => {

    productsContainer.innerHTML += `

      <div class="product-card">

        <img src="${product.img}" alt="${product.name}">

        <div class="product-info">

          <h3>${product.name}</h3>

          <p>Luxury Arabic Fragrance</p>

          <div class="product-bottom">

            <span>£${product.price.toFixed(2)}</span>

            <button onclick="addToCart(${product.id}, this)">
              Add To Cart
            </button>

          </div>

        </div>

      </div>

    `;
  });
}

// ================================
// ADD TO CART
// ================================

function addToCart(id, button) {

  const product = products.find(p => p.id === id);

  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {

    existing.quantity++;

  } else {

    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCart();
  updateCart();

  // OPEN SIDEBAR
  openCart();

  // SHAKE ICON
  cartIcon.classList.add("bag-shake");

  setTimeout(() => {
    cartIcon.classList.remove("bag-shake");
  }, 500);

  // FLY EFFECT
  if(button){

    const card = button.closest(".product-card");
    const img = card.querySelector("img");

    flyToCart(img);
  }

}

// ================================
// UPDATE CART
// ================================

function updateCart() {

  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  if(cart.length === 0){

    cartItems.innerHTML = `
      <div class="empty-cart">
        <h3>Your basket is empty</h3>
        <p>Add some luxury fragrances.</p>
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

        <img src="${item.img}" alt="${item.name}">

        <div class="cart-item-info">

          <h4>${item.name}</h4>

          <p class="cart-price">
            £${item.price.toFixed(2)}
          </p>

          <div class="cart-qty">

            <button onclick="decreaseQty(${item.id})">
              -
            </button>

            <span>${item.quantity}</span>

            <button onclick="increaseQty(${item.id})">
              +
            </button>

          </div>

        </div>

        <button class="remove-btn"
          onclick="removeItem(${item.id})">
          ✕
        </button>

      </div>

    `;
  });

  cartTotal.innerText = `£${total.toFixed(2)}`;
  cartCount.innerText = count;

  updateShipping(total);
}

// ================================
// QUANTITY
// ================================

function increaseQty(id){

  const item = cart.find(p => p.id === id);

  item.quantity++;

  saveCart();
  updateCart();
}

function decreaseQty(id){

  const item = cart.find(p => p.id === id);

  if(item.quantity > 1){

    item.quantity--;

  } else {

    cart = cart.filter(p => p.id !== id);
  }

  saveCart();
  updateCart();
}

// ================================
// REMOVE ITEM
// ================================

function removeItem(id){

  cart = cart.filter(item => item.id !== id);

  saveCart();
  updateCart();
}

// ================================
// SHIPPING BAR
// ================================

function updateShipping(total){

  const target = 50;

  let progress = (total / target) * 100;

  if(progress > 100){
    progress = 100;
  }

  progressFill.style.width = `${progress}%`;

  if(total >= target){

    shippingText.innerHTML =
      `You unlocked FREE shipping 🎉`;

  } else {

    const remaining = (target - total).toFixed(2);

    shippingText.innerHTML =
      `You're <span>£${remaining}</span> away from free shipping!`;
  }
}

// ================================
// OPEN CART
// ================================

function openCart(){

  cartSidebar.classList.add("active");
  cartOverlay.classList.add("active");
}

// ================================
// CLOSE CART
// ================================

function closeBasket(){

  cartSidebar.classList.remove("active");
  cartOverlay.classList.remove("active");
}

cartIcon.addEventListener("click", openCart);

closeCart.addEventListener("click", closeBasket);

cartOverlay.addEventListener("click", closeBasket);

// ESC CLOSE

document.addEventListener("keydown", (e) => {

  if(e.key === "Escape"){
    closeBasket();
  }
});

// ================================
// FLY EFFECT
// ================================

function flyToCart(imgElement){

  const cart = document.querySelector(".cart-icon");

  const imgClone = imgElement.cloneNode(true);

  const rect = imgElement.getBoundingClientRect();
  const cartRect = cart.getBoundingClientRect();

  imgClone.classList.add("flying-img");

  imgClone.style.left = rect.left + "px";
  imgClone.style.top = rect.top + "px";
  imgClone.style.width = rect.width + "px";
  imgClone.style.height = rect.height + "px";

  document.body.appendChild(imgClone);

  requestAnimationFrame(() => {

    imgClone.style.left =
      (cartRect.left + 20) + "px";

    imgClone.style.top =
      (cartRect.top + 20) + "px";

    imgClone.style.width = "20px";
    imgClone.style.height = "20px";

    imgClone.style.opacity = "0";
  });

  setTimeout(() => {

    imgClone.remove();

    cart.classList.add("cart-pulse");

    setTimeout(() => {
      cart.classList.remove("cart-pulse");
    }, 400);

  }, 800);
}

// ================================
// CHECKOUT
// ================================

async function checkout(){

  if(cart.length === 0){

    alert("Your basket is empty");

    return;
  }

  try{

    const response = await fetch(
      "https://ar-production-006f.up.railway.app/create-checkout-session",
      {
        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify(cart)
      }
    );

    const data = await response.json();

    if(data.url){

      localStorage.removeItem("cart");

      window.location.href = data.url;

    } else {

      alert("Checkout failed");
    }

  } catch(error){

    console.log(error);

    alert("Server error");
  }
}

// ================================
// INIT
// ================================

renderProducts();
updateCart();