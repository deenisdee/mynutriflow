let credits = 3;
let unlockedRecipes = [];
let isPremium = false;
let searchTerm = '';

const creditsText = document.getElementById('credits-text');
const premiumBtn = document.getElementById('premium-btn');
const recipeGrid = document.getElementById('recipe-grid');
const premiumModal = document.getElementById('premium-modal');
const premiumCodeInput = document.getElementById('premium-code-input');
const modalCancel = document.getElementById('modal-cancel');
const modalActivate = document.getElementById('modal-activate');
const searchInput = document.getElementById('search-input');

function updateUI() {
    if (isPremium) {
        creditsText.textContent = 'PREMIUM';
        premiumBtn.style.display = 'none';
    } else {
        creditsText.textContent = `${credits} créditos`;
        premiumBtn.style.display = 'block';
    }
}

function renderRecipes() {
    let list = RECIPES;

    if (searchTerm) {
        list = RECIPES.filter(r =>
            r.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    recipeGrid.innerHTML = list.map(r => {
        const unlocked = isPremium || unlockedRecipes.includes(r.id);
        return `
            <div class="recipe-card" onclick="openRecipe(${r.id})">
                <img src="${r.image}">
                <h3>${r.name}</h3>
                <button>${unlocked ? 'Ver Receita' : 'Desbloquear'}</button>
            </div>
        `;
    }).join('');
}

function openRecipe(id) {
    if (!isPremium && !unlockedRecipes.includes(id)) {
        if (credits > 0) {
            credits--;
            unlockedRecipes.push(id);
        } else {
            premiumModal.classList.remove('hidden');
            return;
        }
    }
    updateUI();
    renderRecipes();
}

function activatePremium() {
    const code = premiumCodeInput.value.trim();
    if (!code) return alert('Digite o código');
    isPremium = true;
    localStorage.setItem('fit_premium', 'true');
    premiumModal.classList.add('hidden');
    updateUI();
    renderRecipes();
}

searchInput.addEventListener('input', e => {
    searchTerm = e.target.value;
    renderRecipes();
});

premiumBtn.addEventListener('click', () => {
    premiumModal.classList.remove('hidden');
});

modalCancel.addEventListener('click', () => {
    premiumModal.classList.add('hidden');
});

modalActivate.addEventListener('click', activatePremium);

/* INIT */
if (localStorage.getItem('fit_premium') === 'true') {
    isPremium = true;
}

updateUI();
renderRecipes();
