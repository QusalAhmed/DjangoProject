const products = [
    {
        id: 1,
        name: 'Patali Gur',
        price: 400,
        image: 'https://freshrootbd.store/images/products/Round%20Patali%20Gur_c.webp',
        description: 'Fresh and sweet Patali Gur for your daily needs.'
    },
    {
        id: 2,
        name: 'Premium Rice',
        price: 70,
        image: 'https://freshrootbd.store/images/products/Round%20Patali%20Gur_c.webp',
        description: 'High-quality premium rice for perfect meals.'
    },
    {
        id: 3,
        name: 'Organic Honey',
        price: 500,
        image: 'https://pureeshop.xyz/images/products/Red%20Juice.png',
        description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.'
    },
    {
        id: 4,
        name: 'Fresh Milk',
        price: 50,
        image: 'https://freshrootbd.store/images/products/Round%20Patali%20Gur_c.webp',
        description: 'Fresh farm milk, delivered to your door.'
    },
    {
        id: 5,
        name: 'Fresh Milk',
        price: 50,
        image: 'https://freshrootbd.store/images/products/Round%20Patali%20Gur_c.webp',
        description: 'Fresh farm milk, delivered to your door.'
    },
    {
        id: 6,
        name: 'Fresh Milk',
        price: 50,
        image: 'https://www.veggycation.com.au/siteassets/veggycationvegetable/onion.jpg',
        description: 'Fresh farm milk, delivered to your door.'
    }
];

const productWeights = {};

function generateDigits(container, maxWeight) {
    container.innerHTML = '';
    for (let i = 0; i <= maxWeight; i++) {
        const digitElement = document.createElement('div');
        digitElement.classList.add('digit');
        digitElement.textContent = i.toString();
        container.appendChild(digitElement);
    }
}

function updateWeight(productId, change) {
    const maxWeight = 999;
    const digitHeight = 30;
    const weightContainer = document.querySelector(`#quantity-${productId}`);
    productWeights[productId] = Math.max(
        0,
        Math.min(productWeights[productId] + change, maxWeight)
    );
    weightContainer.style.transform = `translateY(-${productWeights[productId] * digitHeight}px)`;
}

function createProductCards() {
    const productList = document.getElementById('product-list');
    products.forEach((product) => {
        productWeights[product.id] = 0;

        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
                    <div class="badge">Organic</div>
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">${product.price} ৳ per Kg</p>
                    <p class="product-description">${product.description}</p>
                    <div class="product-actions">
                        <button class="quantity-btn" onclick="updateWeight(${product.id}, -1)">১ কেজি কমান</button>
                        <div class="quantity-container">
                            <div class="quantity" id="quantity-${product.id}"></div>
                        </div>
                        <button class="quantity-btn" onclick="updateWeight(${product.id}, 1)">১ কেজি যোগ করুন</button>
                    </div>
                `;
        productList.appendChild(card);

        generateDigits(document.querySelector(`#quantity-${product.id}`), 1000);
    });
}

document.addEventListener('DOMContentLoaded', createProductCards);