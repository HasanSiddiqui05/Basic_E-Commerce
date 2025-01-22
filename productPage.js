var quant = document.getElementById("quan");
let count = 0;
let cart = JSON.parse(sessionStorage.getItem("cartItems") || "[]");

async function dataFetch(id) {
    try {
        const response = await fetch("https://fakestoreapi.com/products/");
        const result = await response.json();

        const product = result.find(product => product.id === Number(id));
        if (product) {
            document.getElementById("image").src = product.image;
            document.getElementById("product-title").textContent = product.title;
            document.getElementById("product-description").textContent = product.description;
            document.getElementById("product-price").textContent = `Price: ${product.price}$`; 
            document.getElementById("product-category").textContent = `${product.category.toUpperCase()}`; 
            
            renderStarsWithCount(product.rating.rate, product.rating.count);
        } else {
            console.error("Product not found");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

let id = sessionStorage.getItem("pID");
console.log(id);
dataFetch(id);

function inc() {
    count++; 
    quant.innerHTML = count; 
}

function dec() {
    if (count > 0) { 
        count--;
        quant.innerHTML = count; 
    }
}

function renderStarsWithCount(rating, count) {
    const container = document.getElementById('rating-container');
    container.innerHTML = '';

    const fullStars = Math.floor(rating); 
    const hasHalfStar = rating % 1 >= 0.5; 
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); 

    for (let i = 0; i < fullStars; i++) {
        const star = document.createElement('span');
        star.classList.add('star', 'filled');
        star.innerHTML = '★'; 
        container.appendChild(star);
    }

    if (hasHalfStar) {
        const star = document.createElement('span');
        star.classList.add('star', 'half-filled');
        star.innerHTML = '★';
        container.appendChild(star);
    }

    for (let i = 0; i < emptyStars; i++) {
        const star = document.createElement('span');
        star.classList.add('star');
        star.innerHTML = '★'; 
        container.appendChild(star);
    }

    const ratingCount = document.createElement('span');
    ratingCount.classList.add('rating-count');
    ratingCount.innerText = `(${count} ratings)`;
    container.appendChild(ratingCount);
}

function addToCart() {
    const productId = id; 
    const quantity = count; 

    if (quantity > 0) {
        const existingProduct = cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ id: productId, quantity: quantity });
        }

        count = 0;
        quant.innerHTML = count;

        console.log("Cart:", cart); 
        alert(`Added ${quantity} item(s) of this Product to the cart.`);

        sessionStorage.setItem("cartItems", JSON.stringify(cart))
    } else {
        alert("Please select a quantity greater than 0.");
    }
}

function redirectToHome(){
    window.location.href = "homePage.html";
}

