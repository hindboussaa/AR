import { getProducts, addProduct, getOrders } from "./api.js";

// =======================
// LOAD PRODUCTS
// =======================

async function loadProducts(){

  const products = await getProducts();

  const list = document.getElementById("product-list");

  list.innerHTML = "";

  products.forEach(p=>{

    list.innerHTML += `
      <div class="card">

        <h3>${p.name}</h3>
        <p>£${p.price}</p>
        <p>Stock: ${p.stock}</p>

      </div>
    `;
  });
}

// =======================
// CREATE PRODUCT
// =======================

window.createProduct = async function(){

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;

  await addProduct({ name, price, stock });

  loadProducts();
}

// INIT
loadProducts();