// ============================================
// ARQUIVO: js/app.js
// ETAPA A1 — ESTABILIDADE
// ============================================

// --------------------------------------------
// ESTADO GLOBAL
// --------------------------------------------
let credits = 3;
let unlockedRecipes = [];
let isPremium = false;
let currentRecipe = null;

let searchTerm = '';
let shoppingList = [];
let weekPlan = {};

// --------------------------------------------
// STORAGE (Claude / Browser)
// --------------------------------------------
const isClaudeEnvironment = typeof window.storage !== 'undefined';

const storage = {
  async get(key) {
    if (isClaudeEnvironment) {
      return await window.storage.get(key);
    }
    const value = localStorage.getItem(key);
    return value ? { value } : null;
  },
  async set(key, value) {
    if (isClaudeEnvironment) {
      return await window.storage.set(key, value);
    }
    localStorage.setItem(key, value);
  }
};

// --------------------------------------------
// ELEMENTOS DOM (SOMENTE OS EXISTENTES)
// --------------------------------------------
const creditsText = document.getElementById('credits-text');
const creditsBadge = document.getElementById('credits-badge');
const premiumBtn = document.getElementById('premium-btn');

const recipeGrid = document.getElementById('recipe-grid');
const recipeDetail = document.getElementById('recipe-detail');

const premiumModal = document.getElementById('premium-modal');
const modalMessage = document.getElementById('modal-message');
const premiumCodeInput = document.getElementById('premium-code-input');
const modalCancel = document.getElementById('modal-cancel');
const modalActivate = document.getElementById('modal-activate');

const searchInput = document.getElementById('search-input');

// Ferramentas
const calculatorBtn = document.getElementById('calculator-btn');
const shoppingBtn = document.getElementById('shopping-btn');
const plannerBtn = document.getElementById('planner-btn');
const shoppingCounter = document.getElementById('shopping-counter');

const calculatorModal = document.getElementById('calculator-modal');
const shoppingModal = document.getElementById('shopping-modal');
const plannerModal = document.getElementById('planner-modal');

// --------------------------------------------
// INIT USUÁRIO
// --------------------------------------------
async function loadUserData() {
  try {
    const premium = await storage.get('fit_premium');
    if (premium?.value === 'true') {
      isPremium = true;
    } else {
      const creditsResult = await storage.get('fit_credits');
      const unlockedResult = await storage.get('fit_unlocked');
      if (creditsResult) credits = parseInt(creditsResult.value);
      if (unlockedResult) unlockedRecipes = JSON.parse(unlockedResult.value);
    }

    const shoppingResult = await storage.get('fit_shopping');
    if (shoppingResult) shoppingList = JSON.parse(shoppingResult.value);

    const weekPlanResult = await storage.get('fit_weekplan');
    if (weekPlanResult) weekPlan = JSON.parse(weekPlanResult.value);

  } catch {
    // primeira visita
  }

  updateUI();
  updateShoppingCounter();
  renderRecipes();
}

// --------------------------------------------
// UI
// --------------------------------------------
function updateUI() {
  if (isPremium) {
    creditsBadge.classList.add('premium');
    creditsBadge.innerHTML = `<span>PREMIUM</span>`;
    premiumBtn.style.display = 'none';
  } else {
    creditsBadge.classList.remove('premium');
    creditsText.textContent = `${credits} créditos`;
    premiumBtn.style.display = 'block';
  }
}

function updateShoppingCounter() {
  if (!shoppingCounter) return;
  if (shoppingList.length > 0) {
    shoppingCounter.textContent = shoppingList.length;
    shoppingCounter.classList.remove('hidden');
  } else {
    shoppingCounter.classList.add('hidden');
  }
}

// --------------------------------------------
// RECEITAS (ÚNICA FONTE)
// --------------------------------------------
function renderRecipes() {
  if (!recipeGrid) return;

  let list = RECIPES;

  if (searchTerm) {
    list = RECIPES.filter(r =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category === searchTerm
    );
  }

  recipeGrid.innerHTML = list.map(recipe => {
    const unlocked = isPremium || unlockedRecipes.includes(recipe.id);
    const locked = !unlocked && credits === 0;

    return `
      <div class="recipe-card" onclick="viewRecipe(${recipe.id})">
        <div class="recipe-image-container">
          <img src="${recipe.image}" alt="${recipe.name}"
               onerror="this.src='https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80'">
          <div class="recipe-category">${recipe.category}</div>
          ${locked ? `<div class="recipe-overlay">🔒</div>` : ''}
        </div>
        <div class="recipe-content">
          <h3 class="recipe-title">${recipe.name}</h3>
          <button class="recipe-button ${unlocked ? 'unlocked' : 'locked'}">
            ${unlocked ? 'Ver Receita' : 'Desbloquear (1 crédito)'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function viewRecipe(id) {
  const recipe = RECIPES.find(r => r.id === id);
  const unlocked = isPremium || unlockedRecipes.includes(id);

  if (!unlocked) {
    if (credits > 0) {
      credits--;
      unlockedRecipes.push(id);
      storage.set('fit_credits', credits.toString());
      storage.set('fit_unlocked', JSON.stringify(unlockedRecipes));
      updateUI();
    } else {
      modalMessage.textContent = 'Seus créditos acabaram.';
      premiumModal.classList.remove('hidden');
      document.body.classList.add('modal-open');
      return;
    }
  }

  showRecipeDetail(recipe);
}

function showRecipeDetail(recipe) {
  recipeGrid.classList.add('hidden');
  recipeDetail.classList.remove('hidden');

  recipeDetail.innerHTML = `
    <button onclick="closeRecipeDetail()">← Voltar</button>
    <h2>${recipe.name}</h2>
    <img src="${recipe.image}">
    <p>${recipe.ingredients.join(', ')}</p>
  `;

  document.getElementById('heroSlider')?.classList.add('hidden');
  document.querySelector('.categories-new')?.classList.add('hidden');
}

function closeRecipeDetail() {
  recipeDetail.classList.add('hidden');
  recipeGrid.classList.remove('hidden');
  document.getElementById('heroSlider')?.classList.remove('hidden');
  document.querySelector('.categories-new')?.classList.remove('hidden');
}

// --------------------------------------------
// PREMIUM (ÚNICO FLUXO)
// --------------------------------------------
async function activatePremium() {
  const code = premiumCodeInput.value.trim();
  if (!code) return alert('Digite um código');

  try {
    const res = await fetch('/api/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    const data = await res.json();

    if (!data.ok) return alert('Código inválido');

    isPremium = true;
    await storage.set('fit_premium', 'true');
    updateUI();
    renderRecipes();

    premiumModal.classList.add('hidden');
    document.body.classList.remove('modal-open');

  } catch {
    alert('Erro ao validar código');
  }
}

// --------------------------------------------
// EVENTOS
// --------------------------------------------
premiumBtn?.addEventListener('click', () => {
  modalMessage.textContent = 'Acesso Premium ilimitado';
  premiumModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
});

modalCancel?.addEventListener('click', () => {
  premiumModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
});

modalActivate?.addEventListener('click', activatePremium);

searchInput?.addEventListener('input', e => {
  searchTerm = e.target.value;
  renderRecipes();
});

// --------------------------------------------
// SLIDER NOVO + CATEGORIAS (ÚNICOS)
// --------------------------------------------
(function initHeroAndCategories() {
  if (!document.getElementById('sliderTrack')) return;

  const featured = RECIPES.filter(r => r.featured).slice(0, 4);
  const track = document.getElementById('sliderTrack');
  const dots = document.getElementById('sliderDots');

  let index = 0;

  track.innerHTML = featured.map(r => `
    <div class="slide-new">
      <img src="${r.image}">
      <div class="slide-overlay-new">
        <h2 class="slide-title-new">${r.name}</h2>
      </div>
    </div>
  `).join('');

  dots.innerHTML = featured.map((_, i) =>
    `<button class="slider-dot-new ${i === 0 ? 'active' : ''}"
             onclick="goToSlideNew(${i})"></button>`
  ).join('');

  window.goToSlideNew = i => {
    index = i;
    track.style.transform = `translateX(-${i * 100}%)`;
    document.querySelectorAll('.slider-dot-new')
      .forEach((d, x) => d.classList.toggle('active', x === i));
  };

  window.changeSlideNew = dir => {
    index = (index + dir + featured.length) % featured.length;
    goToSlideNew(index);
  };

  setInterval(() => changeSlideNew(1), 8000);
})();

// --------------------------------------------
// INIT
// --------------------------------------------
loadUserData();
