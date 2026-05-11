const API = "http://localhost:4242/api";

// GET PRODUCTS
export async function getProducts(){
  const res = await fetch(`${API}/products`);
  return res.json();
}

// ADD PRODUCT
export async function addProduct(product){
  return fetch(`${API}/products`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(product)
  });
}

// GET ORDERS
export async function getOrders(){
  const res = await fetch(`${API}/orders`);
  return res.json();
}