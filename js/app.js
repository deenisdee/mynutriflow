// ============================================
// ARQUIVO: js/app.js
// VERSÃO (Etapa A): Modais padronizados + FAQ padrão + scroll invisível + premium estável
// ============================================

// --------------------------------------------
// Estado da aplicação
// --------------------------------------------
let credits = 3;
let unlockedRecipes = [];
let isPremium = false;
let currentRecipe = null;

let currentSlideIndex = 0;
let sliderAutoplay = null;
let featuredRecipes = [];
let searchTerm = '';
let shoppingList = [];
let weekPlan = {};

// Detectar ambiente
const isClaudeEnvironment = typeof window.storage !== 'undefined';

// Storage adaptativo
const storage = {
  async get(key) {
    if (isClaudeEnvironment) return await window.storage.get(key);
    const value = localStorage.getItem(key);
    return value ? { key, value } : null;
  },
  async set(key, value) {
    if (isClaudeEnvironment) return await window.storage.set(key, value);
    localStorage.setItem(key, value);
    return { key, value };
  }
};

// --------------------------------------------
// Elementos DOM
// --------------------------------------------
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
const shoppingCounter = document.getElementById('shopping-counter');

const calculatorBtn = document.getElementById('calculator-btn');
const shoppingBtn = document.getElementById('shopping-btn');
const plannerBtn = document.getElementById('planner-btn');

const calculatorModal = document.getElementById('calculator-modal');
const shoppingModal = document.getElementById('shopping-modal');
const plannerModal = document.getElementById('planner-modal');

const sliderTrack = document.getElementById('sliderTrack');
const sliderDots = document.getElementById('sliderDots');
const categoriesGrid = document.getElementById('categoriesGrid');

const faqBtn = document.getElementById('faq-btn');

// --------------------------------------------
// Helpers: Modais
// --------------------------------------------
function openModal(el) {
  if (!el) return;
  el.classList.remove('hidden');
  el.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeModal(el) {
  if (!el) return;
  el.classList.add('hidden');
  el.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

window.closePremiumModal = function () {
  if (premiumCodeInput) premiumCodeInput.value = '';
  closeModal(premiumModal);
};

// Fechar clicando no overlay (todos)
function bindOverlayClose() {
  document.querySelectorAll('.modal').forEach(modal => {
    const overlay = modal.querySelector('.modal-overlay');
    if (!overlay) return;

    overlay.onclick = () => {
      if (modal.id === 'calculator-modal') window.closeCalculator();
      else if (modal.id === 'shopping-modal') window.closeShoppingList();
      else if (modal.id === 'planner-modal') window.closeWeekPlanner();
      else if (modal.id === 'premium-modal') window.closePremiumModal();
      else if (modal.id === 'faq-modal') window.closeFAQ();
      else closeModal(modal);
    };
  });
}

// ESC fecha modal aberto
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;

  const opened = Array.from(document.querySelectorAll('.modal')).find(m => !m.classList.contains('hidden'));
  if (!opened) {
    const meal = document.getElementById('meal-selector');
    if (meal) window.closeMealSelector();
    return;
  }

  if (opened.id === 'calculator-modal') window.closeCalculator();
  else if (opened.id === 'shopping-modal') window.closeShoppingList();
  else if (opened.id === 'planner-modal') window.closeWeekPlanner();
  else if (opened.id === 'premium-modal') window.closePremiumModal();
  else if (opened.id === 'faq-modal') window.closeFAQ();
  else closeModal(opened);
});

// ============================================
// INICIALIZAÇÃO
// ============================================
async function loadUserData() {
  try {
    const premiumResult = await storage.get('fit_premium');

    if (premiumResult && premiumResult.value === 'true') {
      isPremium = true;
    } else {
      const creditsResult = await storage.get('fit_credits');
      const unlockedResult = await storage.get('fit_unlocked');

      if (creditsResult) credits = parseInt(creditsResult.value || '3', 10);
      if (unlockedResult) unlockedRecipes = JSON.parse(unlockedResult.value || '[]');
    }

    const shoppingResult = await storage.get('fit_shopping');
    const weekPlanResult = await storage.get('fit_weekplan');

    if (shoppingResult?.value) shoppingList = JSON.parse(shoppingResult.value);
    if (weekPlanResult?.value) weekPlan = JSON.parse(weekPlanResult.value);
  } catch (e) {
    // primeira visita
  }

  updateUI();
  updateShoppingCounter();
  initSliderAndCategories();
  renderRecipes();
  bindOverlayClose();
}

async function saveUserData() {
  try {
    await storage.set('fit_credits', credits.toString());
    await storage.set('fit_unlocked', JSON.stringify(unlockedRecipes));
    await storage.set('fit_premium', isPremium.toString());
  } catch (e) {}
}

async function saveShoppingList() {
  try {
    await storage.set('fit_shopping', JSON.stringify(shoppingList));
    updateShoppingCounter();
  } catch (e) {}
}

async function saveWeekPlan() {
  try {
    await storage.set('fit_weekplan', JSON.stringify(weekPlan));
  } catch (e) {}
}

function updateUI() {
  if (!creditsBadge) return;

  if (isPremium) {
    creditsBadge.classList.add('premium');
    creditsBadge.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      <span>PREMIUM</span>
    `;
    if (premiumBtn) premiumBtn.style.display = 'none';
  } else {
    creditsBadge.classList.remove('premium');
    creditsBadge.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      <span id="credits-text">${credits} créditos</span>
    `;
    if (premiumBtn) premiumBtn.style.display = 'block';
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

// ============================================
// SLIDER + CATEGORIAS
// ============================================
function initSliderAndCategories() {
  if (typeof RECIPES === 'undefined') return;

  // Slider
  if (sliderTrack && sliderDots) {
    featuredRecipes = RECIPES.filter(r => r.featured).slice(0, 4);

    sliderTrack.innerHTML = featuredRecipes.map(recipe => `
      <div class="slide-new">
        <img src="${recipe.image}" alt="${recipe.name}"
          onerror="this.src='https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80'">
        <div class="slide-overlay-new">
          <h2 class="slide-title-new">${recipe.name}</h2>
          <p class="slide-description-new">${(recipe.ingredients && recipe.ingredients[0]) ? recipe.ingredients[0] : 'Receita deliciosa e saudável'}</p>
        </div>
      </div>
    `).join('');

    sliderDots.innerHTML = featuredRecipes.map((_, idx) =>
      `<button class="slider-dot-new ${idx === 0 ? 'active' : ''}" onclick="goToSlideNew(${idx})" aria-label="Ir para slide ${idx + 1}"></button>`
    ).join('');

    startAutoplay();
    updateSlider();
  }

  // Categorias
  if (categoriesGrid) {
    const categories = [
      { name: 'Todas', value: '' },
      { name: 'Café da Manhã', value: 'Café da Manhã' },
      { name: 'Almoço', value: 'Almoço' },
      { name: 'Jantar', value: 'Jantar' },
      { name: 'Lanches', value: 'Lanches' },
      { name: 'Sobremesas', value: 'Sobremesas' },
      { name: 'Veganas', value: 'Veganas' }
    ];

    categoriesGrid.innerHTML = categories.map((cat, index) => `
      <div class="category-card-new ${index === 0 ? 'active' : ''}"
           onclick="filterByCategory('${cat.value}', this)">
        ${cat.name}
      </div>
    `).join('');
  }

  initCategoriesDrag();
}

window.changeSlideNew = function(direction) {
  if (!featuredRecipes || featuredRecipes.length === 0) return;
  currentSlideIndex = (currentSlideIndex + direction + featuredRecipes.length) % featuredRecipes.length;
  updateSlider();
};

window.goToSlideNew = function(index) {
  currentSlideIndex = index;
  updateSlider();
};

function updateSlider() {
  if (!sliderTrack) return;
  sliderTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
  document.querySelectorAll('.slider-dot-new').forEach((dot, i) => dot.classList.toggle('active', i === currentSlideIndex));
}

function startAutoplay() {
  if (!featuredRecipes || featuredRecipes.length === 0) return;
  clearInterval(sliderAutoplay);
  sliderAutoplay = setInterval(() => window.changeSlideNew(1), 8000);
}

function initCategoriesDrag() {
  const grid = document.querySelector('.categories-grid-new');
  if (!grid) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  grid.ondragstart = () => false;

  grid.addEventListener('mousedown', (e) => {
    isDown = true;
    grid.style.cursor = 'grabbing';
    startX = e.pageX - grid.offsetLeft;
    scrollLeft = grid.scrollLeft;
  });

  grid.addEventListener('mouseleave', () => { isDown = false; grid.style.cursor = 'grab'; });
  grid.addEventListener('mouseup', () => { isDown = false; grid.style.cursor = 'grab'; });

  grid.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - grid.offsetLeft;
    const walk = (x - startX);
    grid.scrollLeft = scrollLeft - walk;
  });

  let touchStartX = 0;
  let touchScrollLeft = 0;

  grid.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = grid.scrollLeft;
  });

  grid.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX;
    const walk = (touchStartX - x) * 1.5;
    grid.scrollLeft = touchScrollLeft + walk;
  });

  grid.style.cursor = 'grab';
}

window.filterByCategory = function(category, element) {
  document.querySelectorAll('.category-card-new').forEach(card => card.classList.remove('active'));
  if (element) element.classList.add('active');

  // filtro por categoria (sem misturar com busca)
  searchTerm = category || '';
  renderRecipes(true);
};

// ============================================
// RECEITAS
// ============================================
function renderRecipes(isCategory = false) {
  if (!recipeGrid || typeof RECIPES === 'undefined') return;

  let filtered = RECIPES;

  // Se é categoria, filtra por igualdade de category.
  // Se é busca (input), filtra por name.
  if (searchTerm) {
    if (isCategory || ['Café da Manhã','Almoço','Jantar','Lanches','Sobremesas','Veganas'].includes(searchTerm)) {
      filtered = RECIPES.filter(r => r.category === searchTerm);
    } else {
      const q = searchTerm.toLowerCase();
      filtered = RECIPES.filter(r => r.name.toLowerCase().includes(q));
    }
  }

  recipeGrid.innerHTML = filtered.map(recipe => {
    const isUnlocked = isPremium || unlockedRecipes.includes(recipe.id);
    const showLock = !isUnlocked && credits === 0;

    return `
      <div class="recipe-card" onclick="viewRecipe(${recipe.id})">
        <div class="recipe-image-container">
          <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image"
               onerror="this.src='https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80'">
          <div class="recipe-category">${recipe.category}</div>

          ${showLock ? `
            <div class="recipe-overlay">
              <svg class="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
          ` : ''}
        </div>

        <div class="recipe-content">
          <h3 class="recipe-title">${recipe.name}</h3>

          <div class="recipe-meta">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>${recipe.time}min</span>

            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            <span>${recipe.servings}</span>

            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span>${recipe.difficulty}</span>
          </div>

          <div class="recipe-stats">
            <div class="stat">
              <div class="stat-value calories">${recipe.calories}</div>
              <div class="stat-label">calorias</div>
            </div>
            <div class="stat">
              <div class="stat-value protein">${recipe.protein}g</div>
              <div class="stat-label">proteína</div>
            </div>
          </div>

          <button class="recipe-button ${isUnlocked ? 'unlocked' : 'locked'}" type="button">
            ${isUnlocked ? `
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
              Ver Receita
            ` : `
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Desbloquear (1 crédito)
            `}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.viewRecipe = function(recipeId) {
  const recipe = RECIPES.find(r => r.id === recipeId);
  if (!recipe) return;

  const unlocked = isPremium || unlockedRecipes.includes(recipeId);

  if (!unlocked) {
    if (credits > 0) {
      credits--;
      unlockedRecipes.push(recipeId);
      saveUserData();
      updateUI();
      renderRecipes();
    } else {
      if (modalMessage) modalMessage.textContent = 'Seus créditos acabaram! Ative o Premium para acesso ilimitado.';
      const warn = document.getElementById('credits-warning');
      if (warn) warn.classList.remove('hidden');
      openModal(premiumModal);
      return;
    }
  }

  currentRecipe = recipe;
  showRecipeDetail(recipe);
};

function showRecipeDetail(recipe) {
  if (!recipeGrid || !recipeDetail) return;

  // esconder slider/categorias
  const slider = document.getElementById('heroSlider');
  const categories = document.querySelector('.categories-new');
  if (slider) slider.classList.add('hidden');
  if (categories) categories.style.display = 'none';

  recipeGrid.classList.add('hidden');
  recipeDetail.classList.remove('hidden');

  recipeDetail.innerHTML = `
    <button class="back-button" onclick="closeRecipeDetail()">← Voltar</button>
    <img src="${recipe.image}" alt="${recipe.name}" class="detail-image"
         onerror="this.src='https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80'">
    <div class="detail-content">
      <div class="detail-header">
        <h2 class="detail-title">${recipe.name}</h2>
        <button onclick="addToShoppingList(${recipe.id})" class="btn-add-list" type="button">
          <svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Adicionar à Lista
        </button>
      </div>

      <div class="detail-stats">
        <div class="detail-stat">
          <div class="detail-stat-value">${recipe.calories}</div>
          <div class="detail-stat-label">calorias</div>
        </div>
        <div class="detail-stat">
          <div class="detail-stat-value">${recipe.protein}g</div>
          <div class="detail-stat-label">proteína</div>
        </div>
        <div class="detail-stat">
          <div class="detail-stat-value">${recipe.time}min</div>
          <div class="detail-stat-label">tempo</div>
        </div>
        <div class="detail-stat">
          <div class="detail-stat-value">${recipe.servings}</div>
          <div class="detail-stat-label">porções</div>
        </div>
      </div>

      <div class="detail-section">
        <h3 class="section-title">Adicionar ao Planejamento Semanal</h3>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
          ${['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'].map(day => `
            <button onclick="selectDayForPlanning('${day}', ${recipe.id})" class="btn-secondary" style="padding:0.6rem 1rem;" type="button">
              ${day}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="detail-section">
        <h3 class="section-title">Ingredientes</h3>
        <ul class="ingredients-list">
          ${(recipe.ingredients || []).map(ing => `
            <li class="ingredient-item">
              <span class="check-icon">✓</span>
              <span>${ing}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="detail-section">
        <h3 class="section-title">Modo de Preparo</h3>
        <ol class="instructions-list">
          ${(recipe.instructions || []).map((step, idx) => `
            <li class="instruction-item">
              <div class="instruction-number">${idx + 1}</div>
              <div class="instruction-text">${step}</div>
            </li>
          `).join('')}
        </ol>
      </div>
    </div>
  `;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.closeRecipeDetail = function() {
  if (!recipeDetail || !recipeGrid) return;

  recipeDetail.classList.add('hidden');
  recipeGrid.classList.remove('hidden');
  currentRecipe = null;

  const slider = document.getElementById('heroSlider');
  const categories = document.querySelector('.categories-new');
  if (slider) slider.classList.remove('hidden');
  if (categories) categories.style.display = 'block';

  renderRecipes();
};

// ============================================
// LISTA DE COMPRAS
// ============================================
window.addToShoppingList = function(recipeId) {
  const recipe = RECIPES.find(r => r.id === recipeId);
  if (!recipe) return;

  (recipe.ingredients || []).forEach(ing => {
    const existing = shoppingList.find(item => item.text.toLowerCase() === ing.toLowerCase());

    if (existing) {
      if (!existing.recipes) existing.recipes = [existing.recipe];
      if (!existing.recipes.includes(recipe.name)) existing.recipes.push(recipe.name);
    } else {
      shoppingList.push({
        id: Date.now() + Math.random(),
        text: ing,
        checked: false,
        recipe: recipe.name,
        recipes: [recipe.name]
      });
    }
  });

  saveShoppingList();
  alert(`Ingredientes de "${recipe.name}" adicionados à lista!`);
};

function renderShoppingList() {
  const content = document.getElementById('shopping-list-content');
  if (!content) return;

  if (shoppingList.length === 0) {
    content.innerHTML = `
      <div class="shopping-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <p style="font-size: 1.125rem; margin-bottom: 0.5rem;">Sua lista está vazia</p>
        <p style="font-size: 0.875rem;">Adicione ingredientes das receitas.</p>
      </div>
    `;
    return;
  }

  content.innerHTML = `
    <div style="max-height: 60vh; overflow-y: auto; padding-right: 6px; scrollbar-width:none;">
      ${shoppingList.map(item => {
        const recipesList = item.recipes ? item.recipes.join(', ') : item.recipe;
        return `
          <div class="shopping-item">
            <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleShoppingItem('${item.id}')">
            <div class="shopping-item-content">
              <div class="shopping-item-text ${item.checked ? 'checked' : ''}">${item.text}</div>
              <div class="shopping-item-recipe">${recipesList}</div>
            </div>
            <button class="btn-delete" onclick="removeShoppingItem('${item.id}')" aria-label="Remover item" type="button">
              <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        `;
      }).join('')}
    </div>

    <button class="btn-clear-list" onclick="clearShoppingList()" type="button">
      Limpar Toda a Lista
    </button>
  `;
}

window.toggleShoppingItem = function(id) {
  shoppingList = shoppingList.map(item =>
    item.id.toString() === id.toString() ? { ...item, checked: !item.checked } : item
  );
  saveShoppingList();
  renderShoppingList();
};

window.removeShoppingItem = function(id) {
  shoppingList = shoppingList.filter(item => item.id.toString() !== id.toString());
  saveShoppingList();
  renderShoppingList();
};

window.clearShoppingList = function() {
  if (confirm('Tem certeza que deseja limpar toda a lista?')) {
    shoppingList = [];
    saveShoppingList();
    renderShoppingList();
  }
};

// ============================================
// PLANEJADOR SEMANAL + seletor (modal padrão)
// ============================================
let selectedDayForPlanner = null;
let selectedRecipeForPlanner = null;

window.selectDayForPlanning = function(day, recipeId) {
  const recipe = RECIPES.find(r => r.id === recipeId);
  if (!recipe) return;

  // remove modal antigo
  const existing = document.getElementById('meal-selector');
  if (existing) existing.remove();

  selectedDayForPlanner = day;
  selectedRecipeForPlanner = recipe;

  const modalHTML = `
    <div class="modal" id="meal-selector" role="dialog" aria-modal="true">
      <div class="modal-overlay" onclick="closeMealSelector()"></div>

      <div class="modal-content-medium" style="max-width:520px;">
        <button class="modal-close" onclick="closeMealSelector()" aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h3 class="modal-title" style="text-align:center;">Escolha a Refeição</h3>
        <p style="text-align:center;color:#6b7280;margin:-0.5rem 0 1.25rem 0;font-weight:800;">
          ${day} • ${recipe.name}
        </p>

        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          ${[
            { label:'Café da Manhã', icon:'<path d="M4 7h12v10H4z"/><path d="M16 9h2a2 2 0 0 1 0 4h-2"/><path d="M8 3v4"/><path d="M12 3v4"/>' },
            { label:'Lanche da Manhã', icon:'<path d="M4 11h16"/><path d="M6 7h12l-1 4H7z"/><path d="M7 11l-1 6h12l-1-6"/>' },
            { label:'Almoço', icon:'<path d="M4 12h16"/><path d="M6 6h12v6H6z"/><path d="M9 18h6"/>' },
            { label:'Lanche da Tarde', icon:'<path d="M4 11h16"/><path d="M6 7h12l-1 4H7z"/><path d="M7 11l-1 6h12l-1-6"/>' },
            { label:'Jantar', icon:'<path d="M7 4v8"/><path d="M11 4v8"/><path d="M7 8h4"/><path d="M17 4v16"/><path d="M17 4a4 4 0 0 0-4 4v1a3 3 0 0 0 3 3h1"/>' },
          ].map(m => `
            <button class="meal-option-btn" onclick="addToWeekPlanWithMeal('${m.label}')" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                ${m.icon}
              </svg>
              <span>${m.label}</span>
            </button>
          `).join('')}
        </div>

        <button class="btn-secondary" onclick="closeMealSelector()" style="margin-top:1rem;width:100%;border-radius:1rem;" type="button">
          Cancelar
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  document.body.classList.add('modal-open');
};

window.closeMealSelector = function() {
  const modal = document.getElementById('meal-selector');
  if (modal) modal.remove();
  selectedDayForPlanner = null;
  selectedRecipeForPlanner = null;
  document.body.classList.remove('modal-open');
};

window.addToWeekPlanWithMeal = function(meal) {
  if (!selectedDayForPlanner || !selectedRecipeForPlanner) return;
  addToWeekPlan(selectedRecipeForPlanner, selectedDayForPlanner, meal);
  window.closeMealSelector();
};

function addToWeekPlan(recipe, day, meal) {
  const key = `${day}-${meal}`;
  weekPlan[key] = recipe;
  saveWeekPlan();
  alert(`"${recipe.name}" adicionado: ${day} • ${meal}`);
}

function renderWeekPlanner() {
  const content = document.getElementById('week-planner-content');
  if (!content) return;

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const meals = ['Café da Manhã', 'Lanche da Manhã', 'Almoço', 'Lanche da Tarde', 'Jantar'];

  const dailyCalories = {};
  days.forEach(day => {
    let total = 0;
    meals.forEach(meal => {
      const key = `${day}-${meal}`;
      if (weekPlan[key]) total += weekPlan[key].calories;
    });
    dailyCalories[day] = total;
  });

  content.innerHTML = `
    <div class="week-planner-wrapper">
      <table class="week-table">
        <thead>
          <tr>
            <th>Refeição</th>
            ${days.map(day => `<th>${day}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${meals.map(meal => `
            <tr>
              <td style="background:#f9fafb;font-weight:900;">${meal}</td>
              ${days.map(day => {
                const key = `${day}-${meal}`;
                const planned = weekPlan[key];
                return `
                  <td>
                    ${planned ? `
                      <div class="planned-meal">
                        <div class="planned-meal-name">${planned.name}</div>
                        <div class="planned-meal-cal">${planned.calories} cal</div>
                        <button class="btn-remove-meal" onclick="removeFromWeekPlan('${day}', '${meal}')" type="button">Remover</button>
                      </div>
                    ` : `<div class="empty-slot">-</div>`}
                  </td>
                `;
              }).join('')}
            </tr>
          `).join('')}
          <tr>
            <td style="background:#fffbeb;font-weight:900;">Total do Dia</td>
            ${days.map(day => `
              <td style="background:#fffbeb;font-weight:900;color:#ea580c;font-size:1.125rem;">
                ${dailyCalories[day]} cal
              </td>
            `).join('')}
          </tr>
        </tbody>
      </table>
    </div>

    ${isPremium ? `
      <button class="btn-save-plan" onclick="saveWeekPlanConfirm()" type="button">Salvar Planejamento</button>
    ` : `
      <button class="btn-save-plan" disabled title="Disponível apenas para usuários Premium" type="button">Salvar Planejamento (Premium)</button>
    `}
  `;
}

window.saveWeekPlanConfirm = function() {
  alert('Planejamento semanal salvo com sucesso.');
};

window.removeFromWeekPlan = function(day, meal) {
  const key = `${day}-${meal}`;
  delete weekPlan[key];
  saveWeekPlan();
  renderWeekPlanner();
};

// ============================================
// CALCULADORA
// ============================================
window.calculateCalories = function() {
  const weight = parseFloat(document.getElementById('calc-weight')?.value);
  const height = parseFloat(document.getElementById('calc-height')?.value);
  const age = parseFloat(document.getElementById('calc-age')?.value);
  const gender = document.getElementById('calc-gender')?.value;
  const activity = document.getElementById('calc-activity')?.value;

  if (!weight || !height || !age) {
    alert('Preencha todos os campos!');
    return;
  }

  let bmr;
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  const activityMultipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
  const tdee = bmr * (activityMultipliers[activity] || 1.2);
  const deficit = tdee - 500;
  const surplus = tdee + 300;

  const results = document.getElementById('calc-results');
  if (!results) return;

  results.classList.remove('hidden');
  results.innerHTML = `
    <div class="result-box" style="background:#dbeafe;">
      <h4>Suas Necessidades Calóricas</h4>
      <div class="result-grid">
        <div class="result-item">
          <div class="result-value" style="color:#16a34a;">${Math.round(tdee)}</div>
          <div class="result-label">Manutenção</div>
        </div>
        <div class="result-item">
          <div class="result-value" style="color:#ea580c;">${Math.round(deficit)}</div>
          <div class="result-label">Perder Peso</div>
        </div>
        <div class="result-item">
          <div class="result-value" style="color:#3b82f6;">${Math.round(surplus)}</div>
          <div class="result-label">Ganhar Massa</div>
        </div>
      </div>
    </div>

    <div class="result-box" style="background:#f0fdf4;">
      <h4>Macronutrientes Recomendados</h4>
      <div class="result-grid">
        <div class="result-item">
          <div class="result-value" style="color:#3b82f6;">${Math.round(weight * 2)}g</div>
          <div class="result-label">Proteína</div>
        </div>
        <div class="result-item">
          <div class="result-value" style="color:#f59e0b;">${Math.round(tdee * 0.4 / 4)}g</div>
          <div class="result-label">Carboidratos</div>
        </div>
        <div class="result-item">
          <div class="result-value" style="color:#ea580c;">${Math.round(tdee * 0.25 / 9)}g</div>
          <div class="result-label">Gorduras</div>
        </div>
      </div>
    </div>
  `;
};

// ============================================
// CONTROLE DE MODAIS (Premium gating)
// ============================================
window.openCalculator = function() {
  if (!isPremium) {
    if (modalMessage) modalMessage.textContent = 'A Calculadora de Calorias é exclusiva para usuários Premium.';
    openModal(premiumModal);
    return;
  }
  openModal(calculatorModal);
};
window.closeCalculator = function() { closeModal(calculatorModal); };

window.openShoppingList = function() {
  if (!isPremium) {
    if (modalMessage) modalMessage.textContent = 'A Lista de Compras é exclusiva para usuários Premium.';
    openModal(premiumModal);
    return;
  }
  renderShoppingList();
  openModal(shoppingModal);
};
window.closeShoppingList = function() { closeModal(shoppingModal); };

window.openWeekPlanner = function() {
  if (!isPremium) {
    if (modalMessage) modalMessage.textContent = 'O Planejador Semanal é exclusivo para usuários Premium.';
    openModal(premiumModal);
    return;
  }
  renderWeekPlanner();
  openModal(plannerModal);
};
window.closeWeekPlanner = function() { closeModal(plannerModal); };

// ============================================
// PREMIUM
// ============================================
async function activatePremium() {
  const code = (premiumCodeInput?.value || '').trim().toUpperCase();
  if (!code) { alert('Digite um código.'); return; }

  try {
    const res = await fetch('/api/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    const data = await res.json();
    if (!data.ok) { alert(data.error || 'Código inválido.'); return; }

    isPremium = true;
    await storage.set('fit_premium', 'true');

    // limpa aviso
    const warn = document.getElementById('credits-warning');
    if (warn) warn.classList.add('hidden');

    updateUI();
    renderRecipes();
    window.closePremiumModal();

    alert('Premium ativado com sucesso!');
  } catch (err) {
    alert('Erro ao validar o código. Tente novamente.');
  }
}

// ============================================
// EVENT LISTENERS
// ============================================
if (premiumBtn) {
  premiumBtn.addEventListener('click', () => {
    if (modalMessage) modalMessage.textContent = 'Tenha acesso ilimitado a todas as receitas!';
    const warn = document.getElementById('credits-warning');
    if (warn) {
      if (credits === 0) warn.classList.remove('hidden');
      else warn.classList.add('hidden');
    }
    openModal(premiumModal);
  });
}

if (modalCancel) modalCancel.addEventListener('click', () => window.closePremiumModal());
if (modalActivate) modalActivate.addEventListener('click', activatePremium);

if (premiumCodeInput) {
  premiumCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') activatePremium();
  });
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    // busca por nome
    searchTerm = e.target.value || '';
    renderRecipes(false);

    // remove active das categorias quando digita
    document.querySelectorAll('.category-card-new').forEach(card => card.classList.remove('active'));
  });
}

if (calculatorBtn) calculatorBtn.addEventListener('click', window.openCalculator);
if (shoppingBtn) shoppingBtn.addEventListener('click', window.openShoppingList);
if (plannerBtn) plannerBtn.addEventListener('click', window.openWeekPlanner);

// ============================================
// FAQ — SEM EMOJI / ÍCONES SVG / setinha verde via CSS
// ============================================
const faqData = [
  {
    title: 'Créditos',
    icon: 'eye',
    items: [
      { q: 'Como funcionam os 3 créditos?', a: 'Use 1 crédito para liberar 1 receita permanentemente.' },
      { q: 'Perco acesso às receitas?', a: 'Não. Receitas desbloqueadas continuam disponíveis para sempre.' },
      { q: 'Posso ganhar mais créditos?', a: 'Os 3 são únicos. Para ilimitado, ative o Premium.' }
    ]
  },
  {
    title: 'Premium',
    icon: 'star',
    items: [
      { q: 'O que ganho com Premium?', a: 'Receitas ilimitadas, ferramentas, novidades mensais e conteúdos extras.' },
      { q: 'Como ativar?', a: 'Clique em “Ativar Premium”, receba seu código e valide no modal.' },
      { q: 'Posso cancelar?', a: 'Sim. Sem fidelidade (considere a política/garantia do seu negócio).' }
    ]
  },
  {
    title: 'Ferramentas',
    icon: 'tool',
    items: [
      { q: 'Calculadora de Calorias', a: 'Preencha os dados e veja estimativas de manutenção e objetivos.' },
      { q: 'Lista de Compras', a: 'Na receita, clique “Adicionar à Lista” e marque itens ao comprar.' },
      { q: 'Planejador Semanal', a: 'Escolha o dia e a refeição, depois salve o planejamento.' }
    ]
  },
  {
    title: 'Receitas',
    icon: 'chef',
    items: [
      { q: 'Como desbloquear?', a: 'Clique na receita e use 1 crédito (se não for Premium).' },
      { q: 'Posso buscar receitas?', a: 'Sim. Use a barra de busca ou as categorias.' },
      { q: 'As receitas têm info nutricional?', a: 'Sim. Calorias, proteína, tempo e porções.' }
    ]
  }
];

function iconSVG(name) {
  if (name === 'eye') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  if (name === 'star') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg>`;
  if (name === 'tool') return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.6 5.6l-6.1 6.1 2.8 2.8 6.1-6.1a4 4 0 0 0 5.6-5.6l-2 2-2.8-2.8 2-2z"/></svg>`;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 3h10v4H7z"/><path d="M6 7h12l-1 14H7L6 7z"/><path d="M9 11v6"/><path d="M15 11v6"/></svg>`;
}

function renderFAQ() {
  const content = document.getElementById('faq-content');
  if (!content) return;

  content.innerHTML = faqData.map((section) => `
    <details>
      <summary>${section.title}</summary>
      <div class="faq-body">
        ${section.items.map(item => `
          <div class="faq-q">
            ${iconSVG(section.icon)}
            <div>
              <strong>${item.q}</strong>
              <p>${item.a}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </details>
  `).join('') + `
    <div class="faq-footer">
      <h4>Ainda tem dúvidas?</h4>
      <div class="modal-footer-pills">
        <a class="pill pill-whats" href="https://wa.me/5511999999999?text=Ajuda%20MyNutriFlow" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"/>
            <path d="M8.5 9.5c.3 3 3 5.7 6 6l1.2-1.2c.2-.2.5-.3.8-.2l2 .6c.4.1.6.5.5.9-.3 1.1-1.3 2-2.6 2-5.2 0-9.4-4.2-9.4-9.4 0-1.3.9-2.3 2-2.6.4-.1.8.1.9.5l.6 2c.1.3 0 .6-.2.8L8.5 9.5z"/>
          </svg>
          WhatsApp
        </a>
        <a class="pill pill-ig" href="https://instagram.com/mynutriflow" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1"/>
          </svg>
          Instagram
        </a>
      </div>
    </div>
  `;
}

window.openFAQ = function() {
  renderFAQ();
  openModal(document.getElementById('faq-modal'));
};
window.closeFAQ = function() { closeModal(document.getElementById('faq-modal')); };

if (faqBtn) faqBtn.addEventListener('click', window.openFAQ);

// ============================================
// INICIALIZAR
// ============================================
loadUserData();
