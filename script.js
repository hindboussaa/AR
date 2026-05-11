
// PRODUCTS
const products = [
  { id:1, name:"Yara Pink 50ml", price:15.99, img:"images/yara1.png" },
  { id:2, name:"Choco Musk Pistachio", price:6.99, img:"images/CHOCO MISK.png" },
  { id:3, name:"Dirham Oud 100ml", price:19.99, img:"images/dirham.png" },
  { id:4, name:"Qaed Al Fursan Unlimited", price:21.99, img:"images/forsan.png" },
  { id:5, name:"Mousuf Ramadi", price:19.99, img:"images/mosofgreen.png" },
  { id:6, name:"Mayar by Lattafa", price:26.99, img:"images/mayar.png" }
];

// CART
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// RENDER PRODUCTS
const productsContainer = document.getElementById("products");

products.forEach(product => {
  const div = document.createElement("div");

  div.className = "product";

  div.innerHTML = `
    <img src="${product.img}" alt="${product.name}">
    <div class="product-content">
      <h3>${product.name}</h3>
      <p>£${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${product.id})">
        Add To Cart
      </button>
    </div>
  `;

  productsContainer.appendChild(div);
});

// ADD TO CART
function addToCart(id){
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if(existing){
    existing.qty++;
  } else {
    cart.push({...product, qty:1});
  }

  saveCart();
  updateCart();
}

// REMOVE
function removeItem(id){
  cart = cart.filter(p => p.id !== id);
  saveCart();
  updateCart();
}

// QTY
function increaseQty(id){
  const item = cart.find(p => p.id === id);
  if(item) item.qty++;
  saveCart();
  updateCart();
}

function decreaseQty(id){
  const item = cart.find(p => p.id === id);
  if(!item) return;

  item.qty--;

  if(item.qty <= 0){
    cart = cart.filter(p => p.id !== id);
  }

  saveCart();
  updateCart();
}

// CART UI
function updateCart(){

  const cartItems = document.getElementById("cart-items-panel");
  const cartTotal = document.getElementById("cart-total-panel");
  const cartCount = document.getElementById("cart-count");

  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach(item => {

    total += item.price * item.qty;
    count += item.qty;

    const li = document.createElement("li");

    li.innerHTML = `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <p>£${item.price.toFixed(2)}</p>

          <button onclick="decreaseQty(${item.id})">-</button>
          <span>${item.qty}</span>
          <button onclick="increaseQty(${item.id})">+</button>

          <button onclick="removeItem(${item.id})">Remove</button>
        </div>
      </div>
    `;

    cartItems.appendChild(li);
  });

  cartTotal.innerText = total.toFixed(2);
  cartCount.innerText = count;
}

// SAVE
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

// CHECKOUT (Stripe link)
function checkout(){

  if(cart.length === 0){
    alert("Your basket is empty");
    return;
  }

  window.location.href =
  "https://buy.stripe.com/YOUR-LINK";
}

// INIT
window.addEventListener("load", updateCart);