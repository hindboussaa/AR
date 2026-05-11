<<<<<<< HEAD
// =======================
// PRODUCTS DATA
// =======================

const products = [

  {
    id: 1,
    name: "Yara Pink 50ml",
    price: 15.99,
    img: "images/yara1.png"
  },

  {
    id: 2,
    name: "Choco Musk Pistachio",
    price: 6.99,
    img: "images/CHOCO MISK.png"
  },

  {
    id: 3,
    name: "Dirham Oud 100ml",
    price: 19.99,
    img: "images/dirham.png"
  },

  {
    id: 4,
    name: "Qaed Al Fursan Unlimited",
    price: 21.99,
    img: "images/forsan.png"
  },

  {
    id: 5,
    name: "Mousuf Ramadi",
    price: 19.99,
    img: "images/mosofgreen.png"
  },

  {
    id: 6,
    name: "Mayar by Lattafa",
    price: 26.99,
    img: "images/mayar.png"
  }

];


// =======================
// CART STATE
// =======================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let discount = 0;


// =======================
// RENDER PRODUCTS
// =======================

const productsContainer =
document.getElementById("products");
=======
// PRODUCTS

const products = [

  { id:1, name:"Yara Pink 50ml", price:15.99, img:"images/yara1.png" },
  { id:2, name:"Choco Musk Pistachio", price:6.99, img:"images/CHOCO MISK.png" },
  { id:3, name:"Dirham Oud 100ml", price:19.99, img:"images/dirham.png" },
  { id:4, name:"Qaed Al Fursan Unlimited", price:21.99, img:"images/forsan.png" },
  { id:5, name:"Mousuf Ramadi", price:19.99, img:"images/mosofgreen.png" },
  { id:6, name:"Mayar by Lattafa", price:26.99, img:"images/mayar.png" }

];

// RENDER PRODUCTS

const productsContainer = document.getElementById("products");
>>>>>>> 34b87636cbf485b249b4e55dadcbaa1dc14aa06e

products.forEach(product => {

  const div = document.createElement("div");

  div.className = "product";

  div.innerHTML = `
<<<<<<< HEAD

    <img
      src="${product.img}"
      alt="${product.name}"
    >

    <div class="product-content">

      <h3>${product.name}</h3>

      <p>£${product.price.toFixed(2)}</p>

      <button onclick="addToCart(${product.id})">

        <i class="fas fa-bag-shopping"></i>

        Add To Cart

      </button>

    </div>

  `;

  productsContainer.appendChild(div);

});


// =======================
// ADD TO CART
// =======================

function addToCart(id){

  const product =
  products.find(p => p.id === id);

  const existing =
  cart.find(item => item.id === id);

  if(existing){

    existing.qty += 1;

  }

  else {

    cart.push({
      ...product,
      qty: 1
    });

  }

  saveCart();

  updateCart();

}


// =======================
// REMOVE ITEM
// =======================

function removeItem(id){

  cart = cart.filter(
    item => item.id !== id
  );

  saveCart();

  updateCart();

}


// =======================
// INCREASE QTY
// =======================

function increaseQty(id){

  const item =
  cart.find(p => p.id === id);

  if(item){

    item.qty += 1;

  }

  saveCart();

  updateCart();

}


// =======================
// DECREASE QTY
// =======================

function decreaseQty(id){

  const item =
  cart.find(p => p.id === id);
=======
    <img src="${product.img}" alt="${product.name}">
    <div class="product-content">
      <h3>${product.name}</h3>
      <p>£${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${product.id})">
        <i class="fas fa-bag-shopping"></i>
        Add To Cart
      </button>
    </div>
  `;

  productsContainer.appendChild(div);
});

// CART

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ADD TO CART

function addToCart(id){

  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if(existing){
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty:1 });
  }

  updateCart();
  saveCart();
}

// REMOVE ITEM

function removeItem(id){

  cart = cart.filter(item => item.id !== id);

  updateCart();
  saveCart();
}

// INCREASE QTY

function increaseQty(id){

  const item = cart.find(p => p.id === id);

  if(item){
    item.qty += 1;
  }

  updateCart();
  saveCart();
}

// DECREASE QTY

function decreaseQty(id){

  const item = cart.find(p => p.id === id);
>>>>>>> 34b87636cbf485b249b4e55dadcbaa1dc14aa06e

  if(!item) return;

  item.qty -= 1;

  if(item.qty <= 0){
<<<<<<< HEAD

    cart = cart.filter(
      p => p.id !== id
    );

  }

  saveCart();

  updateCart();

}


// =======================
// UPDATE CART UI
// =======================

function updateCart(){

  const cartItems =
  document.getElementById("cart-items-panel");

  const cartTotal =
  document.getElementById("cart-total-panel");

  const cartCount =
  document.getElementById("cart-count");

  const mobileCount =
  document.getElementById("mobile-cart-count");
=======
    cart = cart.filter(p => p.id !== id);
  }

  updateCart();
  saveCart();
}

// UPDATE CART

function updateCart(){

  const cartItems = document.getElementById("cart-items-panel");
  const cartTotal = document.getElementById("cart-total-panel");
  const cartCount = document.getElementById("cart-count");
>>>>>>> 34b87636cbf485b249b4e55dadcbaa1dc14aa06e

  cartItems.innerHTML = "";

  let total = 0;
<<<<<<< HEAD

=======
>>>>>>> 34b87636cbf485b249b4e55dadcbaa1dc14aa06e
  let count = 0;

  cart.forEach(item => {

    total += item.price * item.qty;
<<<<<<< HEAD

    count += item.qty;

    const li =
    document.createElement("li");

    li.innerHTML = `

      <div class="cart-item">

        <img
          src="${item.img}"
          alt="${item.name}"
        >
=======
    count += item.qty;

    const li = document.createElement("li");

    li.innerHTML = `
      <div class="cart-item">

        <img src="${item.img}" alt="${item.name}">
>>>>>>> 34b87636cbf485b249b4e55dadcbaa1dc14aa06e

        <div class="cart-item-info">

          <h4>${item.name}</h4>

<<<<<<< HEAD
          <p>
            £${item.price.toFixed(2)}
          </p>
=======
          <p>£${item.price.toFixed(2)}</p>
>>>>>>> 34b87636cbf485b249b4e55dadcbaa1dc14aa06e

          <div class="cart-actions">

            <div class="qty-controls">

<<<<<<< HEAD
              <button onclick="decreaseQty(${item.id})">
                -
              </button>

              <span>${item.qty}</span>

              <button onclick="increaseQty(${item.id})">
                +
              </button>

            </div>

            <button
              class="remove-btn"
              onclick="removeItem(${item.id})"
            >
=======
              <button onclick="decreaseQty(${item.id})">-</button>

              <span>${item.qty}</span>

              <button onclick="increaseQty(${item.id})">+</button>

            </div>

            <button class="remove-btn" onclick="removeItem(${item.id})">
>>>>>>> 34b87636cbf485b249b4e55dadcbaa1dc14aa06e
              Remove
            </button>

          </div>

        </div>

      </div>
<<<<<<< HEAD

    `;

    cartItems.appendChild(li);

  });

  // =======================
  // APPLY DISCOUNT
  // =======================

  let finalTotal = total;

  if(discount > 0){

    finalTotal =
    total - (total * discount / 100);

  }

  // UPDATE TOTALS

  cartTotal.innerText =
  finalTotal.toFixed(2);

  cartCount.innerText = count;

  if(mobileCount){

    mobileCount.innerText = count;

  }

  // UPDATE AI

  updateAI();

}


// =======================
// SAVE CART
// =======================

function saveCart(){

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

}


// =======================
// TOGGLE CART
// =======================

function toggleCart(){

  document
  .getElementById("cart-panel")
  .classList
  .toggle("open");

  document
  .getElementById("cart-overlay")
  .classList
  .toggle("active");

}


// =======================
// REAL STRIPE CHECKOUT
// =======================

async function checkout(){

  // EMPTY CART

  if(cart.length === 0){

    alert("Your basket is empty");

    return;

  }

  try {

    // SEND CART TO BACKEND

    const response = await fetch(

      "http://localhost:3000/api/stripe/checkout",

      {

        method: "POST",

        headers: {
          "Content-Type":"application/json"
        },

        body: JSON.stringify({
          cart: cart
        })

      }

    );

    // GET SESSION URL

    const data =
    await response.json();

    // REDIRECT TO STRIPE

    window.location.href =
    data.url;

  }

  catch(error){

    console.log(error);

    alert("Checkout failed");

  }

}


// =======================
// SCROLL TO PRODUCTS
// =======================

function scrollToProducts(){

  document
  .getElementById("products")
  .scrollIntoView({
    behavior:"smooth"
  });

}


// =======================
// COUPON SYSTEM
// =======================

function applyCoupon(){

  const code =
  document
  .getElementById("coupon-input")
  .value
  .toUpperCase();

  const coupons = {

    SAVE10: 10,
    SAVE20: 20,
    LUXURY15: 15

  };

  if(coupons[code]){

    discount = coupons[code];

    document
    .getElementById("coupon-message")
    .innerText =
    `✔ ${discount}% discount applied`;

  }

  else {

    discount = 0;

    document
    .getElementById("coupon-message")
    .innerText =
    "❌ Invalid coupon";

  }

  updateCart();

}


// =======================
// AI RECOMMENDATIONS
// =======================

function updateAI(){

  const ai =
  document.getElementById("ai-recommend");

  if(!ai) return;

  if(cart.length === 0){

    ai.innerHTML = "";

    return;

  }

  const hasOud =
  cart.some(item =>
    item.name
    .toLowerCase()
    .includes("oud")
  );

  const hasSweet =
  cart.some(item =>
    item.name
    .toLowerCase()
    .includes("musk")
  );

  if(hasOud){

    ai.innerHTML =
    "🧠 Recommended: Tom Ford Oud Wood, Arabian Nights Extreme";

  }

  else if(hasSweet){

    ai.innerHTML =
    "🧠 Recommended: Lattafa Yara Candy, Vanilla Musk";

  }

  else {

    ai.innerHTML =
    "🧠 Recommended: Best Selling Luxury Perfumes";

  }

}


// =======================
// INIT
// =======================

window.addEventListener("load", () => {

  updateCart();

=======
    `;

    cartItems.appendChild(li);
  });

  cartTotal.innerText = total.toFixed(2);
  cartCount.innerText = count;
}

// SAVE CART

function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

// TOGGLE CART

function toggleCart(){

  document.getElementById("cart-panel").classList.toggle("open");
  document.getElementById("cart-overlay").classList.toggle("active");
}

// CHECKOUT

function checkout(){

  if(cart.length === 0){
    alert("Your basket is empty");
    return;
  }

  window.location.href =
  "https://buy.stripe.com/test_bJe5kvcqt2eC4b4065gfu01";
}

// SCROLL

function scrollToProducts(){
  document.getElementById("products").scrollIntoView({ behavior:"smooth" });
}

// INIT

window.addEventListener("load", () => {
  updateCart();
>>>>>>> 34b87636cbf485b249b4e55dadcbaa1dc14aa06e
});