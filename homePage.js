
let id = 0;

async function dataFetch() {
    try {
        const response = await fetch("https://fakestoreapi.com/products/");
        const products = await response.json();

        const productsContainer = document.querySelector('.products');
        productsContainer.innerHTML = ''; 

        products.forEach((product) => {
            const uniqueRatingContainerId = `rating-container-${product.id}`; // Unique ID for stars container

            const productElement = document.createElement('div');
            productElement.classList.add('product');

            const truncatedtitle = product.title.length > 50
            ? product.title.substring(0, 50) + "..."
            : product.title;

            productElement.innerHTML = `
            <a href="productPage.html" onclick="setID(${product.id})">
            <div class="product-img">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-details">
                <h6>${truncatedtitle}</h6>
                <label>$${product.price}</label>
                <div class="product-rating" id="${uniqueRatingContainerId}"></div>
            </div>
            </a>
        `;
        

            productsContainer.appendChild(productElement);
            renderStarsWithCount(product.rating.rate, product.rating.count, uniqueRatingContainerId);
       
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function setID(id){
    sessionStorage.setItem("pID", id);
}

function renderStarsWithCount(rating, count, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found.`);
        return;
    }

    container.innerHTML = ''; // Clear any existing stars

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        const star = document.createElement('span');
        star.classList.add('star', 'filled');
        star.innerHTML = '★';
        container.appendChild(star);
    }

    // Add half star if applicable
    if (hasHalfStar) {
        const star = document.createElement('span');
        star.classList.add('star', 'half-filled');
        star.innerHTML = '★';
        container.appendChild(star);
    }

    // Add empty stars
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

// Fetch and display data when the page loads
dataFetch();