// ========== LISTE DES PRODUITS (avec images) ==========
const products = [
    {
        id: 1,
        name: "🍕 Pizza Margherita",
        desc: "Sauce tomate, mozzarella, basilic",
        price: 8500,
        image: "images/pizza.jfif"
    },
    {
        id: 2,
        name: "🍔 Burger Deluxe",
        desc: "Steak 180g, cheddar, salade",
        price: 9500,
        image: "images/Burger.jfif"
    },
    {
        id: 3,
        name: "🍣 Sushi Mix",
        desc: "12 pièces saumon, thon, crevettes",
        price: 12500,
        image: "images/Sushi.jfif"
    },
    {
        id: 4,
        name: "🥪 Sandwich Club",
        desc: "Poulet, bacon, laitue, tomate",
        price: 6500,
        image: "images/Sandwish.jfif"
    },
    {
        id: 5,
        name: "🍝 Pasta Carbonara",
        desc: "Spaghettis, parmesan, lardons",
        price: 8500,
        image: "images/pasta.jfif"
    },
    {
        id: 6,
        name: "🥑 Bowl Végétarien",
        desc: "Quinoa, avocat, légumes grillés",
        price: 8000,
        image: "images/Bowl.jfif"
    }
];

// ========== VARIABLES ==========
let cart = [];
let cartPanel = document.getElementById('cartPanel');
let overlay = document.getElementById('overlay');

// ========== FORMAT PRIX ==========
function formatPrice(price) {
    return price.toLocaleString('fr-FR') + ' FCFA';
}

// ========== AFFICHER LES PRODUITS ==========
function displayProducts() {
    const container = document.getElementById('products');
    container.innerHTML = '';
    
    for (let p of products) {
        container.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>${p.desc}</p>
                    <div class="price">${formatPrice(p.price)}</div>
                    <button onclick="addToCart(${p.id})">🛒 Ajouter</button>
                </div>
            </div>
        `;
    }
}

// ========== AJOUTER AU PANIER ==========
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    showMessage(`${product.name} ajouté !`);
}

// ========== METTRE À JOUR LE PANIER ==========
function updateCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    const cartCountSpan = document.getElementById('cartCount');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="empty-cart">🛒 Panier vide</div>';
        cartTotalSpan.innerText = '0 FCFA';
        cartCountSpan.innerText = '0';
        return;
    }
    
    let total = 0;
    let itemCount = 0;
    cartItemsDiv.innerHTML = '';
    
    for (let item of cart) {
        total += item.price * item.quantity;
        itemCount += item.quantity;
        
        cartItemsDiv.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    ${formatPrice(item.price)}
                </div>
                <div>
                    <button onclick="changeQty(${item.id}, ${item.quantity - 1})">-</button>
                    ${item.quantity}
                    <button onclick="changeQty(${item.id}, ${item.quantity + 1})">+</button>
                    <button onclick="removeItem(${item.id})">🗑️</button>
                </div>
            </div>
        `;
    }
    
    cartTotalSpan.innerText = formatPrice(total);
    cartCountSpan.innerText = itemCount;
}

// ========== CHANGER QUANTITÉ ==========
function changeQty(id, newQty) {
    if (newQty <= 0) {
        removeItem(id);
    } else {
        const item = cart.find(i => i.id === id);
        if (item) item.quantity = newQty;
        updateCart();
    }
}

// ========== SUPPRIMER UN ARTICLE ==========
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    showMessage('Article retiré');
}

// ========== VIDER LE PANIER ==========
function clearCart() {
    if (confirm('Vider votre panier ?')) {
        cart = [];
        updateCart();
        showMessage('Panier vidé');
    }
}

// ========== VALIDER COMMANDE ==========
function checkout() {
    if (cart.length === 0) {
        showMessage('Panier vide !', 'error');
        return;
    }
    
    let total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    let message = "📋 VOTRE COMMANDE :\n\n";
    for (let item of cart) {
        message += `${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}\n`;
    }
    message += `\n💰 Total : ${formatPrice(total)}\n🍽️ Merci !`;
    
    alert(message);
    cart = [];
    updateCart();
    closeCart();
}

// ========== MESSAGE TEMPORAIRE ==========
function showMessage(msg, type = 'success') {
    let toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.cssText = `
        position: fixed; bottom: 20px; left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
        color: white; padding: 10px 20px;
        border-radius: 50px; z-index: 2000;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// ========== OUVRIR/FERMER PANIER ==========
function openCart() {
    cartPanel.classList.add('open');
    overlay.classList.add('show');
}

function closeCart() {
    cartPanel.classList.remove('open');
    overlay.classList.remove('show');
}

// ========== CHARGEMENT ==========
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCart();
    
    document.getElementById('cartBtn').onclick = openCart;
    document.getElementById('closeCartBtn').onclick = closeCart;
    overlay.onclick = closeCart;
    document.getElementById('checkoutBtn').onclick = checkout;
    document.getElementById('clearCartBtn').onclick = clearCart;
});

// Rendre les fonctions accessibles
window.addToCart = addToCart;
window.changeQty = changeQty;
window.removeItem = removeItem;