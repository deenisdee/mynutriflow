// ============================================
// ARQUIVO: js/app.js (CONSOLIDADO B)
// - FAQ sem emoji (ícones minimalistas em SVG)
// - FAQ no padrão verde (chevron)
// - Premium modal com close + warning correto
// - Mantém funcionalidades atuais
// ============================================

let credits = 3;
let unlockedRecipes = [];
let isPremium = false;
let currentRecipe = null;
let currentSlideIndex = 0;
let featuredRecipes = [];
let searchTerm = '';
let shoppingList = [];
let weekPlan = {};

const isClaudeEnvironment = typeof window.storage !== 'undefined';

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

// DOM
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
const faqModal = document.getElementById('faq-modal');

// Modal helpers
function openModal(el) {
  if (!el) return;
  el.classList.remove('hidden');
  document.body.classList.add('modal-open');
}
function closeModal(el) {
  if (!el) return;
  el.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

window.closePremiumModal = function () {
  if (premiumCodeInput) premiumCodeInput.value = '';
  const warning = document.getElementById('credits-warning');
  if (warning) warning.classList.add('hidden');
  closeModal(premiumModal);
};

// INIT
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
    if (shoppingResult && shoppingResult.value) shoppingList = JSON.parse(shoppingResult.value);
    if (weekPlanResult && weekPlanResult.value) weekPlan = JSON.parse(weekPlanResult.value);
  } catch (e) {}

  updateUI();
  updateShoppingCounter();
  initSliderAndCategories();
  renderRecipes();
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

// SLIDER + CATEGORIAS
let sliderAutoplay = null;

function initSliderAndCategories() {
  if (typeof RECIPES === 'undefined') return;

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
      `<button class="slider-dot-new ${idx === 0 ? 'active' : ''}" onclick="goToSlideNew(${idx})"></button>`
    ).join('');

    startAutoplay();
    updateSlider();
  }

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
  document.querySelectorAll('.slider-dot-new').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlideIndex);
  });
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

  grid.addEventListener('mouseleave', () => {
    isDown = false;
    grid.style.cursor = 'grab';
  });

  grid.addEventListener('mouseup', () => {
    isDown = false;
    grid.style.cursor = 'grab';
  });

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
  searchTerm = category || '';
  renderRecipes();
};

// RECEITAS
function renderRecipes() {
  if (!recipeGrid || typeof RECIPES === 'undefined') return;

  let filtered = RECIPES;

  if (searchTerm) {
    filtered = RECIPES.filter(recipe => {
      return recipe.category === searchTerm ||
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
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
              <svg class="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
          ` : ''}
        </div>

        <div class="recipe-content">
          <h3 class="recipe-title">${recipe.name}</h3>

          <div class="recipe-meta">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>${recipe.time}min</span>

            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            <span>${recipe.servings}</span>

            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

          <button class="recipe-button ${isUnlocked ? 'unlocked' : 'locked'}">
            ${isUnlocked ? `
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
              </svg>
              Ver Receita
            ` : `
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

  const isUnlocked = isPremium || unlockedRecipes.includes(recipeId);

  if (!isUnlocked) {
    if (credits > 0) {
      credits--;
      unlockedRecipes.push(recipeId);
      saveUserData();
      updateUI();
      renderRecipes();
    } else {
      if (modalMessage) modalMessage.textContent = 'Seus créditos acabaram. Ative o Premium para acesso ilimitado.';
      const warning = document.getElementById('credits-warning');
      if (warning) warning.classList.remove('hidden');
      openModal(premiumModal);
      return;
    }
  }

  currentRecipe = recipe;
  showRecipeDetail(recipe);
};

function showRecipeDetail(recipe) {
  if (!recipeGrid || !recipeDetail) return;

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
        <button onclick="addToShoppingList(${recipe.id})" class="btn-add-list">
          <svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
            <button onclick="selectDayForPlanning('${day}', ${recipe.id})" class="btn-secondary" style="padding:0.6rem 1rem;">
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

// LISTA DE COMPRAS
window.addToShoppingList = function(recipeId) {
  const recipe = RECIPES.find(r => r.id === recipeId);
  if (!recipe) return;

  (recipe.ingredients || []).forEach(ing => {
    const existingItem = shoppingList.find(item =>
      item.text.toLowerCase() === ing.toLowerCase()
    );

    if (existingItem) {
      if (!existingItem.recipes) existingItem.recipes = [existingItem.recipe];
      if (!existingItem.recipes.includes(recipe.name)) existingItem.recipes.push(recipe.name);
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
  alert(`Ingredientes de "${recipe.name}" adicionados à lista.`);
};

function renderShoppingList() {
  const content = document.getElementById('shopping-list-content');
  if (!content) return;

  if (shoppingList.length === 0) {
    content.innerHTML = `
      <div class="shopping-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <p style="font-size: 1.125rem; margin-bottom: 0.5rem;">Sua lista está vazia</p>
        <p style="font-size: 0.875rem;">Adicione ingredientes das receitas</p>
      </div>
    `;
    return;
  }

  content.innerHTML = `
    <div style="max-height: 60vh; overflow-y: auto;">
      ${shoppingList.map(item => {
        const recipesList = item.recipes ? item.recipes.join(', ') : item.recipe;
        return `
          <div class="shopping-item">
            <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleShoppingItem('${item.id}')">
            <div class="shopping-item-content">
              <div class="shopping-item-text ${item.checked ? 'checked' : ''}">${item.text}</div>
              <div class="shopping-item-recipe">${recipesList}</div>
            </div>
            <button class="btn-delete" onclick="removeShoppingItem('${item.id}')" aria-label="Remover item">
              <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        `;
      }).join('')}
    </div>

    <button class="btn-clear-list" onclick="clearShoppingList()">
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

// PLANEJADOR SEMANAL
let selectedDayForPlanner = null;
let selectedRecipeForPlanner = null;

window.selectDayForPlanning = function(day, recipeId) {
  const recipe = RECIPES.find(r => r.id === recipeId);
  if (!recipe) return;

  const existing = document.getElementById('meal-selector');
  if (existing) existing.remove();

  selectedDayForPlanner = day;
  selectedRecipeForPlanner = recipe;

  const modalHTML = `
    <div class="modal" id="meal-selector" role="dialog" aria-modal="true">
      <div class="modal-content-medium modal-surface" style="max-width:520px;">
        <button class="modal-close" onclick="closeMealSelector()" aria-label="Fechar modal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h3 class="modal-title" style="text-align:center;">Escolha a Refeição</h3>
        <p style="text-align:center;color:#6b7280;margin:-0.5rem 0 1.25rem 0;">
          ${day} - ${recipe.name}
        </p>

        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          ${['Café da Manhã','Lanche da Manhã','Almoço','Lanche da Tarde','Jantar'].map(m => `
            <button class="btn-secondary" onclick="addToWeekPlanWithMeal('${m}')" style="display:flex;align-items:center;gap:0.75rem;padding:1rem;border-radius:10px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:22px;height:22px;">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <span style="font-weight:600;">${m}</span>
            </button>
          `).join('')}
        </div>

        <button class="btn-secondary" onclick="closeMealSelector()" style="margin-top:1rem;width:100%;border-radius:10px;">
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
  alert(`Receita adicionada ao ${day} - ${meal}.`);
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
              <td style="background:#f9fafb;font-weight:600;">${meal}</td>
              ${days.map(day => {
                const key = `${day}-${meal}`;
                const planned = weekPlan[key];
                return `
                  <td>
                    ${planned ? `
                      <div class="planned-meal">
                        <div class="planned-meal-name">${planned.name}</div>
                        <div class="planned-meal-cal">${planned.calories} cal</div>
                        <button class="btn-remove-meal" onclick="removeFromWeekPlan('${day}', '${meal}')">Remover</button>
                      </div>
                    ` : `<div class="empty-slot">-</div>`}
                  </td>
                `;
              }).join('')}
            </tr>
          `).join('')}
          <tr>
            <td style="background:#fffbeb;font-weight:600;">Total do Dia</td>
            ${days.map(day => `
              <td style="background:#fffbeb;font-weight:600;color:#ea580c;">
                ${dailyCalories[day]} cal
              </td>
            `).join('')}
          </tr>
        </tbody>
      </table>
    </div>

    ${isPremium ? `
      <button class="btn-save-plan" onclick="saveWeekPlanConfirm()">Salvar Planejamento</button>
    ` : `
      <button class="btn-save-plan" disabled title="Disponível apenas para usuários Premium">Salvar Planejamento (Premium)</button>
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

// CALCULADORA
window.calculateCalories = function() {
  const weight = parseFloat(document.getElementById('calc-weight')?.value);
  const height = parseFloat(document.getElementById('calc-height')?.value);
  const age = parseFloat(document.getElementById('calc-age')?.value);
  const gender = document.getElementById('calc-gender')?.value;
  const activity = document.getElementById('calc-activity')?.value;

  if (!weight || !height || !age) {
    alert('Preencha todos os campos.');
    return;
  }

  let bmr;
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };

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

// MODAIS (controle)
window.openCalculator = function() {
  if (!isPremium) {
    if (modalMessage) modalMessage.textContent = 'A Calculadora é exclusiva para usuários Premium.';
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

// PREMIUM
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
    updateUI();
    renderRecipes();

    window.closePremiumModal();
    alert('Premium ativado com sucesso.');
  } catch (err) {
    alert('Erro ao validar o código.');
  }
}

// EVENTOS
if (premiumBtn) {
  premiumBtn.addEventListener('click', () => {
    if (modalMessage) modalMessage.textContent = 'Tenha acesso ilimitado a todas as receitas.';
    const warning = document.getElementById('credits-warning');
    if (warning) {
      if (credits === 0) warning.classList.remove('hidden');
      else warning.classList.add('hidden');
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
    searchTerm = e.target.value || '';
    renderRecipes();
  });
}

if (calculatorBtn) calculatorBtn.addEventListener('click', window.openCalculator);
if (shoppingBtn) shoppingBtn.addEventListener('click', window.openShoppingList);
if (plannerBtn) plannerBtn.addEventListener('click', window.openWeekPlanner);

// FAQ (SEM emoji)
const faqData = [
  {
    title: 'Créditos',
    items: [
      { q: 'Como funcionam os 3 créditos?', a: 'Use 1 crédito para liberar 1 receita permanentemente.' },
      { q: 'Perco acesso às receitas?', a: 'Não. Receita desbloqueada fica sua.' },
      { q: 'Posso ganhar mais créditos?', a: 'Para acesso ilimitado, ative o Premium.' }
    ]
  },
  {
    title: 'Premium',
    items: [
      { q: 'O que ganho?', a: 'Receitas ilimitadas e ferramentas completas.' },
      { q: 'Como ativar?', a: 'Clique em Ativar Premium e digite o código recebido.' },
      { q: 'Posso cancelar?', a: 'Sim. Sem fidelidade.' }
    ]
  },
  {
    title: 'Ferramentas',
    items: [
      { q: 'Calculadora de Calorias', a: 'Preencha seus dados para estimar metas.' },
      { q: 'Lista de Compras', a: 'Adicione ingredientes direto da receita.' },
      { q: 'Planejador Semanal', a: 'Escolha dia e refeição e organize sua semana.' }
    ]
  },
  {
    title: 'Receitas',
    items: [
      { q: 'Como desbloquear?', a: 'Clique na receita e use 1 crédito.' },
      { q: 'Posso buscar?', a: 'Use a barra de busca ou categorias.' },
      { q: 'Tem informação nutricional?', a: 'Sim: calorias, proteína, tempo e porções.' }
    ]
  }
];

function chevronSvg() {
  return `
    <svg viewBox="0 0 24 24" fill="none">
      <polyline points="9 18 15 12 9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline>
    </svg>
  `;
}

function renderFAQ() {
  const content = document.getElementById('faq-content');
  if (!content) return;

  content.innerHTML = faqData.map((section, idx) => `
    <div class="faq-section" id="faq-sec-${idx}">
      <button class="faq-header" onclick="toggleFAQSection(${idx})" aria-expanded="false">
        <span class="faq-title">${section.title}</span>
        <span class="faq-chevron">${chevronSvg()}</span>
      </button>
      <div class="faq-body" id="faq-body-${idx}" style="display:block;">
        ${section.items.map(item => `
          <div style="margin-bottom:12px;">
            <div class="faq-q">${item.q}</div>
            <div class="faq-a">${item.a}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('') + `
    <div class="faq-help">
      <h4>Ainda tem dúvidas?</h4>
      <div class="faq-help-links">
        <a class="wa" href="https://wa.me/5511999999999?text=Ajuda%20MyNutriFlow" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M22 16.92V21a1 1 0 0 1-1.09 1A19.8 19.8 0 0 1 3 5.09 1 1 0 0 1 4 4h4.09a1 1 0 0 1 1 .75l1.14 4.57a1 1 0 0 1-.27.95l-2.2 2.2a16 16 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 .95-.27l4.57 1.14a1 1 0 0 1 .75 1z" stroke="currentColor" stroke-width="2"/>
          </svg>
          WhatsApp
        </a>
        <a class="ig" href="https://instagram.com/mynutriflow" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" stroke-width="2"/>
            <path d="M16 11.37a4 4 0 1 1-7.88 1.26 4 4 0 0 1 7.88-1.26z" stroke="currentColor" stroke-width="2"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" stroke-width="2"/>
          </svg>
          Instagram
        </a>
      </div>
    </div>
  `;

  // marca como "open" pra CSS girar chevron
  document.querySelectorAll('.faq-section').forEach(sec => sec.classList.add('open'));
}

window.toggleFAQSection = function(idx) {
  const body = document.getElementById(`faq-body-${idx}`);
  const sec = document.getElementById(`faq-sec-${idx}`);
  if (!body || !sec) return;

  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  sec.classList.toggle('open', !isOpen);
};

window.openFAQ = function() {
  renderFAQ();
  openModal(faqModal);
};
window.closeFAQ = function() { closeModal(faqModal); };

if (faqBtn) faqBtn.addEventListener('click', window.openFAQ);

// START
loadUserData();
