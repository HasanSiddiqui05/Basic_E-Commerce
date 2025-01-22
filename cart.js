
let cartItems = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
console.log("Cart Items:", cartItems); 

async function dataFetch() {
    try {
        const response = await fetch("https://fakestoreapi.com/products/");
        const products = await response.json();
        console.log("Fetched Products:", products); 

        const productsContainer = document.querySelector('.cart-cards');
        productsContainer.innerHTML = ''; 

        cartItems.forEach((cartItem, index) => {
            const product = products.find(prod => Number(prod.id) === Number(cartItem.id));
            if (product) {
                console.log("Matched Product:", product); 
        
                const truncatedDescription = product.description.length > 100
                    ? product.description.substring(0, 100) + "..."
                    : product.description;
        
                const productElement = document.createElement('div');
                productElement.classList.add('cart-item');
        
                productElement.innerHTML = `
                    <div class="delete-btn" onclick="removeFromCart(${product.id})">
                        <img alt="delete-btn" src="Images/red-delete-10437.png">
                    </div>
                    <div class="item-details">
                        <img src="${product.image}" alt="${product.title}">
                        <div class="item-data">
                            <h5>${product.title}</h5>
                            <p>${truncatedDescription}</p>
                            <div class="item-price">
                                <label id="price-${product.id}">Price: $${(product.price * cartItem.quantity).toFixed(2)}</label>
                                <div class="quantityBtn">
                                    <button class="inc" onclick="inc(${product.id}, ${product.price})">+</button>
                                    <span id="quan-${product.id}">${cartItem.quantity}</span>
                                    <button class="dec" onclick="dec(${product.id}, ${product.price})">-</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        
                productsContainer.appendChild(productElement);
        
                if (index !== cartItems.length - 1) {
                    const lineElement = document.createElement('div');
                    lineElement.classList.add('line');
                    productsContainer.appendChild(lineElement);
                }
            } else {
                console.error("No match found for cart item ID:", cartItem.id);
            }
        });
        

        finalBill();

    } catch (error) {
        console.error("Error fetching data:", error);
    }

}

function calculateTotal(pid, price) {
    const quant = Number(document.getElementById(`quan-${pid}`).innerHTML);
    const total = price * quant;
    const priceLabel = document.getElementById(`price-${pid}`);
    priceLabel.innerHTML = `Price: $${total.toFixed(2)}`;
}

function updateCartItemQuantity(pid, newQuantity) {
    const cartItem = cartItems.find(item => Number(item.id) === Number(pid));
    if (cartItem) {
        cartItem.quantity = newQuantity;
        console.log(`Updated cart item for ID ${pid}:`, cartItem);
    } else {
        console.error("Item not found in cartItems:", pid);
    }

    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log("Updated Cart Items in Session:", JSON.parse(sessionStorage.getItem("cartItems")));
}

function inc(pid, price) {
    const quant = document.getElementById(`quan-${pid}`);
    let count = Number(quant.innerHTML);
    count++;
    quant.innerHTML = count;

    updateCartItemQuantity(pid, count);
    calculateTotal(pid, price);
    finalBill();
}

function dec(pid, price) {
    const quant = document.getElementById(`quan-${pid}`);
    let count = Number(quant.innerHTML);

    if (count > 0) {
        count--;
        quant.innerHTML = count;

        updateCartItemQuantity(pid, count);
        calculateTotal(pid, price);
        finalBill();
    }
}

function removeFromCart(productId) {
    console.log("Deleting Product with ID:", productId);

    cartItems = cartItems.filter(item => Number(item.id) !== Number(productId));

    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log("Updated Cart Items After Deletion:", cartItems);

    dataFetch();
}

function finalBill() {
    let delivery = document.getElementById("delivery");
    let discount = document.getElementById("discount");
    let totalBill = document.getElementById("total-bill");
    let subTotal = document.getElementById("subtotal");
    let totalPrice = 0; 

    for (let i = 0; i < cartItems.length; i++) {
        const productId = cartItems[i].id;
        const priceElement = document.getElementById(`price-${productId}`);
        
        if (priceElement) {
            const priceText = priceElement.textContent.replace("Price: $", "").trim();
            totalPrice += parseFloat(priceText); 
        } else {
            console.error(`Price element not found for product ID: ${productId}`);
        }
    }

    subTotal.innerHTML = `$${totalPrice.toFixed(2)}`;


    const deliveryPrice = parseFloat(delivery.textContent.replace("$", "").trim()) || 0;
    const discountPrice = parseFloat(discount.textContent.replace("$", "").trim()) || 0;

    const finalTotal = totalPrice + deliveryPrice - discountPrice;

    totalBill.innerHTML = `$${finalTotal.toFixed(2)}`;

    console.log("Total Price:", totalPrice);
    console.log("Final Bill:", finalTotal);
}

function redirectToHome(){
    window.location.href = "index.html";
}

dataFetch();
