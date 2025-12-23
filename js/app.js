// ============================================
// ARQUIVO: js/app.js
// VERSÃO COMPLETA (com Premium via /api/redeem + Status Bar funcionando)
// ============================================

// --------------------------------------------
// Estado da aplicação
// --------------------------------------------
let credits = 3;
let unlockedRecipes = [];
let isPremium = false;
let currentRecipe = null;

let currentSlide = 0;
let featuredRecipes = [];
let searchTerm = '';
let shoppingList = [];
let weekPlan = {};

// Detectar ambiente (Claude / sandbox vs browser normal)
const isClaudeEnvironment = typeof window.storage !== 'undefined';

// Storage adaptativo
const storage = {
  async get(key) {
    if (isClaudeEnvironment) {
      return await window.storage.get(key);
    } else {
      const value = localStorage.getItem(key);
      return value ? { key, value } : null;
    }
  },
  async set(key, value) {
    if (isClaudeEnvironment) {
      return await window.storage.set(key, value);
    } else {
      localStorage.setItem(key, value);
      return { key, value };
    }
  }
};

// --------------------------------------------
// Elementos DOM
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

// Carrossel “antigo” (se existir no HTML)
const carouselTrack = document.getElementById('carousel-track');
const carouselPrev = document.getElementById('carousel-prev');
const carouselNext = document.getElementById('carousel-next');
const carouselIndicators = document.getElementById('carousel-indicators');

// Botões das ferramentas
const calculatorBtn = document.getElementById('calculator-btn');
const shoppingBtn = document.getElementById('shopping-btn');
const plannerBtn = document.getElementById('planner-btn');
const shoppingCounter = document.getElementById('shopping-counter');

// Modais das ferramentas
const calculatorModal = document.getElementById('calculator-modal');
const shoppingModal = document.getElementById('shopping-modal');
const plannerModal = document.getElementById('planner-modal');

// --------------------------------------------
// STATUS BAR (UX)
// --------------------------------------------
function updateStatusBar() {
  const elCredits = document.getElementById('statusCredits');
  const elUnlocked = document.getElementById('statusUnlocked');
  const elPremium = document.getElementById('statusPremium');
  const elHint = document.getElementById('statusHint');

  // Se a barra não existir na página, não faz nada (não quebra nada)
  if (!elCredits || !elUnlocked || !elPremium) return;

  // Créditos
  if (isPremium) {
    elCredits.textContent = '🎟️ Créditos: ∞';
  } else {
    elCredits.textContent = `🎟️ Créditos: ${credits}`;
  }

  // Desbloqueadas
  const unlockedCount = Array.isArray(unlockedRecipes) ? unlockedRecipes.length : 0;
  elUnlocked.textContent = `🔓 Desbloqueadas: ${unlockedCount}`;

  // Premium
  elPremium.textContent = `⭐ Premium: ${isPremium ? 'ativo' : 'inativo'}`;

  // Mensagem/Hint
  if (!elHint) return;

  if (isPremium) {
    elHint.textContent = 'Você é Premium: acesso ilimitado + ferramentas liberadas.';
  } else if (credits > 0) {
    elHint.textContent = 'Você tem créditos grátis. Cada receita clicada desbloqueia 1 permanentemente.';
  } else {
    elHint.textContent = 'Seus créditos acabaram. Ative o Premium para liberar tudo.';
  }
}

// ============================================
// INICIALIZAÇÃO
// ============================================
async function loadUserData() {
  console.log('Carregando dados...');

  try {
    const premiumResult = await storage.get('fit_premium');

    if (premiumResult && premiumResult.value === 'true') {
      isPremium = true;
      console.log('✓ Usuário PREMIUM');
    } else {
      const creditsResult = await storage.get('fit_credits');
      const unlockedResult = await storage.get('fit_unlocked');

      if (creditsResult) credits = parseInt(creditsResult.value, 10);
      if (unlockedResult) unlockedRecipes = JSON.parse(unlockedResult.value);
    }

    // Carregar lista de compras e planejamento
    const shoppingResult = await storage.get('fit_shopping');
    const weekPlanResult = await storage.get('fit_weekplan');

    if (shoppingResult && shoppingResult.value) shoppingList = JSON.parse(shoppingResult.value);
    if (weekPlanResult && weekPlanResult.value) weekPlan = JSON.parse(weekPlanResult.value);

  } catch (error) {
    console.log('Primeira visita / Storage vazio');
  }

  updateUI();
  updateShoppingCounter();
  renderCarousel();
  renderRecipes();
}

async function saveUserData() {
  try {
    await storage.set('fit_credits', credits.toString());
    await storage.set('fit_unlocked', JSON.stringify(unlockedRecipes));
    await storage.set('fit_premium', isPremium.toString());
    console.log('✓ Dados salvos!');
  } catch (error) {
    console.error('✗ Erro ao salvar:', error);
  }
}

async function saveShoppingList() {
  try {
    await storage.set('fit_shopping', JSON.stringify(shoppingList));
    updateShoppingCounter();
  } catch (error) {
    console.error('Erro ao salvar lista');
  }
}

async function saveWeekPlan() {
  try {
    await storage.set('fit_weekplan', JSON.stringify(weekPlan));
  } catch (error) {
    console.error('Erro ao salvar planejamento');
  }
}

function updateUI() {
  if (isPremium) {
    creditsBadge.classList.add('premium');
    creditsBadge.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      <span>PREMIUM</span>
    `;
    premiumBtn.style.display = 'none';
  } else {
    creditsBadge.classList.remove('premium');
    if (creditsText) creditsText.textContent = `${credits} créditos`;
    premiumBtn.style.display = 'block';
  }

  // ✅ ÚNICO lugar onde a barra é atualizada (sem duplicação)
  updateStatusBar();
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
// CARROSSEL (antigo, se existir)
// ============================================
function renderCarousel() {
  if (!carouselTrack || !carouselIndicators) return;

  featuredRecipes = RECIPES.filter(r => r.featured);

  carouselTrack.innerHTML = featuredRecipes.map(recipe => `
    <div class="carousel-slide">
      <img src="${recipe.image}" alt="${recipe.name}">
      <div class="carousel-caption">
        <h3>${recipe.name}</h3>
      </div>
    </div>
  `).join('');

  carouselIndicators.innerHTML = featuredRecipes.map((_, idx) => `
    <button class="carousel-indicator ${idx === 0 ? 'active' : ''}" onclick="goToSlide(${idx})"></button>
  `).join('');

  updateCarousel();
}

function updateCarousel() {
  if (!carouselTrack) return;
  const offset = -currentSlide * 100;
  carouselTrack.style.transform = `translateX(${offset}%)`;

  document.querySelectorAll('.carousel-indicator').forEach((btn, idx) => {
    btn.classList.toggle('active', idx === currentSlide);
  });
}

function nextSlide() {
  if (!featuredRecipes.length) return;
  currentSlide = (currentSlide + 1) % featuredRecipes.length;
  updateCarousel();
}

function prevSlide() {
  if (!featuredRecipes.length) return;
  currentSlide = (currentSlide - 1 + featuredRecipes.length) % featuredRecipes.length;
  updateCarousel();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

// ============================================
// RECEITAS
// ============================================
function renderRecipes() {
  if (!recipeGrid) return;

  let filtered = RECIPES;

  if (searchTerm) {
    filtered = RECIPES.filter(recipe => {
      const matchCategory = recipe.category === searchTerm;
      const matchName = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory || matchName;
    });
  }

  recipeGrid.innerHTML = filtered.map(recipe => {
    const isUnlocked = isPremium || unlockedRecipes.includes(recipe.id);
    const showLock = !isUnlocked && credits === 0;

    return `
      <div class="recipe-card" onclick="viewRecipe(${recipe.id})">
        <div class="recipe-image-container">
          <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
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

function viewRecipe(recipeId) {
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
      modalMessage.textContent = 'Seus créditos acabaram! Ative o Premium para acesso ilimitado.';

      const creditsWarning = document.getElementById('credits-warning');
      if (creditsWarning) creditsWarning.style.display = 'block';

      premiumModal.classList.remove('hidden');
      document.body.classList.add('modal-open');
      return;
    }
  }

  currentRecipe = recipe;
  showRecipeDetail(recipe);
}

function showRecipeDetail(recipe) {
  recipeGrid.classList.add('hidden');
  recipeDetail.classList.remove('hidden');

  recipeDetail.innerHTML = `
    <button class="back-button" onclick="closeRecipeDetail()">← Voltar</button>
    <img src="${recipe.image}" alt="${recipe.name}" class="detail-image">

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

      ${recipe.tags ? `
        <div class="detail-section">
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${recipe.tags.map(tag => `
              <span style="background: #f0fdf4; color: #16a34a; padding: 0.375rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500;">
                ${tag}
              </span>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${recipe.benefits ? `
        <div class="detail-section">
          <h3 class="section-title">✨ Benefícios</h3>
          <ul style="list-style: none; padding: 0; display: grid; gap: 0.75rem;">
            ${recipe.benefits.map(benefit => `
              <li style="display: flex; align-items: start; gap: 0.75rem;">
                <span style="color: #16a34a; font-size: 1.25rem;">✓</span>
                <span style="color: #4b5563;">${benefit}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <div class="detail-section">
        <h3 class="section-title">Adicionar ao Planejamento Semanal</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(day => `
            <button onclick="selectDayForPlanning('${day}', ${recipe.id})"
                    class="btn-secondary" style="padding: 0.5rem 1rem;">
              ${day}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="detail-section">
        <h3 class="section-title">Ingredientes</h3>
        <ul class="ingredients-list">
          ${recipe.ingredients.map(ing => `
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
          ${recipe.instructions.map((step, idx) => `
            <li class="instruction-item">
              <div class="instruction-number">${idx + 1}</div>
              <div class="instruction-text">${step}</div>
            </li>
          `).join('')}
        </ol>
      </div>

      ${recipe.tips ? `
        <div class="detail-section">
          <h3 class="section-title">💡 Dicas Profissionais</h3>
          <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 1.5rem; border-radius: 0.5rem;">
            <ul style="list-style: none; padding: 0; display: grid; gap: 1rem;">
              ${recipe.tips.map(tip => `<li style="color: #92400e;">${tip}</li>`).join('')}
            </ul>
          </div>
        </div>
      ` : ''}
    </div>
  `;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeRecipeDetail() {
  recipeDetail.classList.add('hidden');
  recipeGrid.classList.remove('hidden');
  currentRecipe = null;
  renderRecipes();
}

// ============================================
// LISTA DE COMPRAS
// ============================================
function addToShoppingList(recipeId) {
  const recipe = RECIPES.find(r => r.id === recipeId);
  if (!recipe) return;

  recipe.ingredients.forEach(ing => {
    const existingItem = shoppingList.find(item => item.text.toLowerCase() === ing.toLowerCase());

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
  alert(`Ingredientes de "${recipe.name}" adicionados à lista! 🛒`);
}

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
        <p style="font-size: 1.125rem; margin-bottom: 0.5rem;">Sua lista está vazia!</p>
        <p style="font-size: 0.875rem;">Adicione ingredientes das receitas.</p>
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
            <button class="btn-delete" onclick="removeShoppingItem('${item.id}')">
              <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        `;
      }).join('')}
    </div>
    <button class="btn-clear-list" onclick="clearShoppingList()">Limpar Toda a Lista</button>
  `;
}

function toggleShoppingItem(id) {
  shoppingList = shoppingList.map(item =>
    item.id.toString() === id.toString() ? { ...item, checked: !item.checked } : item
  );
  saveShoppingList();
  renderShoppingList();
}

function removeShoppingItem(id) {
  shoppingList = shoppingList.filter(item => item.id.toString() !== id.toString());
  saveShoppingList();
  renderShoppingList();
}

function clearShoppingList() {
  if (confirm('Tem certeza que deseja limpar toda a lista?')) {
    shoppingList = [];
    saveShoppingList();
    renderShoppingList();
  }
}

// ============================================
// PLANEJADOR SEMANAL
// ============================================
let selectedDayForPlanner = null;
let selectedRecipeForPlanner = null;

function selectDayForPlanning(day, recipeId) {
  const existingModal = document.getElementById('meal-selector');
  if (existingModal) existingModal.remove();

  const recipe = RECIPES.find(r => r.id === recipeId);
  if (!recipe) return;

  selectedDayForPlanner = day;
  selectedRecipeForPlanner = recipe;

  const modalHTML = `
    <div class="meal-selector-modal" id="meal-selector" onclick="closeOnOverlayClick(event)">
      <div class="meal-selector-content" onclick="event.stopPropagation()">
        <h3 class="meal-selector-title">Escolha a Refeição</h3>
        <p class="meal-selector-subtitle">${day} - ${recipe.name}</p>
        <div class="meal-options">
          <button class="meal-option" onclick="addToWeekPlanWithMeal('Café da Manhã')">Café da Manhã</button>
          <button class="meal-option" onclick="addToWeekPlanWithMeal('Lanche da Manhã')">Lanche da Manhã</button>
          <button class="meal-option" onclick="addToWeekPlanWithMeal('Almoço')">Almoço</button>
          <button class="meal-option" onclick="addToWeekPlanWithMeal('Lanche da Tarde')">Lanche da Tarde</button>
          <button class="meal-option" onclick="addToWeekPlanWithMeal('Jantar')">Jantar</button>
        </div>
        <button class="meal-selector-cancel" onclick="closeMealSelector()">Cancelar</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeOnOverlayClick(event) {
  if (event.target.id === 'meal-selector') closeMealSelector();
}

function addToWeekPlanWithMeal(meal) {
  if (selectedDayForPlanner && selectedRecipeForPlanner) {
    addToWeekPlan(selectedRecipeForPlanner, selectedDayForPlanner, meal);
    closeMealSelector();
  }
}

function closeMealSelector() {
  const modal = document.getElementById('meal-selector');
  if (modal) modal.remove();
  selectedDayForPlanner = null;
  selectedRecipeForPlanner = null;
}

function addToWeekPlan(recipe, day, meal) {
  const key = `${day}-${meal}`;
  weekPlan[key] = recipe;
  saveWeekPlan();
  alert(`"${recipe.name}" adicionado ao ${day} - ${meal}! 📅`);
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
              <td style="background: #f9fafb; font-weight: 600;">${meal}</td>
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
            <td style="background: #fffbeb; font-weight: 700;">Total do Dia</td>
            ${days.map(day => `
              <td style="background: #fffbeb; font-weight: 700; color: #ea580c; font-size: 1.125rem;">
                ${dailyCalories[day]} cal
              </td>
            `).join('')}
          </tr>
        </tbody>
      </table>
    </div>

    ${isPremium ? `
      <button class="btn-save-plan" onclick="saveWeekPlanConfirm()">💾 Salvar Planejamento</button>
    ` : `
      <button class="btn-save-plan" disabled title="Disponível apenas para usuários Premium">🔒 Salvar Planejamento (Premium)</button>
    `}
  `;
}

function saveWeekPlanConfirm() {
  alert('Planejamento semanal salvo com sucesso! ✅');
}

function removeFromWeekPlan(day, meal) {
  const key = `${day}-${meal}`;
  delete weekPlan[key];
  saveWeekPlan();
  renderWeekPlanner();
}

// ============================================
// CALCULADORA DE CALORIAS
// ============================================
function calculateCalories() {
  const weight = parseFloat(document.getElementById('calc-weight').value);
  const height = parseFloat(document.getElementById('calc-height').value);
  const age = parseFloat(document.getElementById('calc-age').value);
  const gender = document.getElementById('calc-gender').value;
  const activity = document.getElementById('calc-activity').value;

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

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };

  const tdee = bmr * activityMultipliers[activity];
  const deficit = tdee - 500;
  const surplus = tdee + 300;

  const results = document.getElementById('calc-results');
  results.classList.remove('hidden');
  results.innerHTML = `
    <div class="result-box" style="background: #dbeafe;">
      <h4>Suas Necessidades Calóricas</h4>
      <div class="result-grid">
        <div class="result-item">
          <div class="result-value" style="color: #16a34a;">${Math.round(tdee)}</div>
          <div class="result-label">Manutenção</div>
        </div>
        <div class="result-item">
          <div class="result-value" style="color: #ea580c;">${Math.round(deficit)}</div>
          <div class="result-label">Perder Peso</div>
        </div>
        <div class="result-item">
          <div class="result-value" style="color: #3b82f6;">${Math.round(surplus)}</div>
          <div class="result-label">Ganhar Massa</div>
        </div>
      </div>
    </div>

    <div class="result-box" style="background: #f0fdf4;">
      <h4>Macronutrientes Recomendados</h4>
      <div class="result-grid">
        <div class="result-item">
          <div class="result-value" style="color: #3b82f6;">${Math.round(weight * 2)}g</div>
          <div class="result-label">Proteína</div>
        </div>
        <div class="result-item">
          <div class="result-value" style="color: #fbbf24;">${Math.round(tdee * 0.4 / 4)}g</div>
          <div class="result-label">Carboidratos</div>
        </div>
        <div class="result-item">
          <div class="result-value" style="color: #ea580c;">${Math.round(tdee * 0.25 / 9)}g</div>
          <div class="result-label">Gorduras</div>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// CONTROLE DE MODAIS (Ferramentas)
// ============================================
function openCalculator() {
  if (!isPremium) {
    modalMessage.textContent = 'A Calculadora de Calorias é exclusiva para usuários Premium!';
    premiumModal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    return;
  }
  calculatorModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function closeCalculator() {
  calculatorModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

function openShoppingList() {
  if (!isPremium) {
    modalMessage.textContent = 'A Lista de Compras é exclusiva para usuários Premium!';
    premiumModal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    return;
  }
  renderShoppingList();
  shoppingModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function closeShoppingList() {
  shoppingModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

function openWeekPlanner() {
  if (!isPremium) {
    modalMessage.textContent = 'O Planejador Semanal é exclusivo para usuários Premium!';
    premiumModal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    return;
  }
  renderWeekPlanner();
  plannerModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function closeWeekPlanner() {
  plannerModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

// ============================================
// PREMIUM (via /api/redeem)
// ============================================
async function activatePremium() {
  const code = premiumCodeInput.value.trim().toUpperCase();

  if (!code) {
    alert('Digite um código.');
    return;
  }

  try {
    const res = await fetch('/api/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    const data = await res.json();

    if (!data.ok) {
      alert(data.error || 'Código inválido. Tente novamente.');
      return;
    }

    // ✅ Premium ON
    isPremium = true;
    await storage.set('fit_premium', 'true');

    updateUI();
    renderRecipes();

    premiumModal.classList.add('hidden');
    premiumCodeInput.value = '';
    document.body.classList.remove('modal-open');

    alert('Premium ativado com sucesso! 🎉');

  } catch (err) {
    alert('Erro ao validar o código. Tente novamente.');
  }
}

// ============================================
// EVENT LISTENERS
// ============================================
if (premiumBtn) {
  premiumBtn.addEventListener('click', () => {
    modalMessage.textContent = 'Tenha acesso ilimitado a todas as receitas!';
    premiumModal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  });
}

if (modalCancel) {
  modalCancel.addEventListener('click', () => {
    premiumModal.classList.add('hidden');
    premiumCodeInput.value = '';
    document.body.classList.remove('modal-open');
  });
}

if (modalActivate) modalActivate.addEventListener('click', activatePremium);

if (premiumCodeInput) {
  premiumCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') activatePremium();
  });
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderRecipes();
  });
}

// Carrossel antigo (apenas se existir)
if (carouselPrev && carouselNext) {
  carouselPrev.addEventListener('click', prevSlide);
  carouselNext.addEventListener('click', nextSlide);
  setInterval(nextSlide, 5000);
}

// Ferramentas
if (calculatorBtn) calculatorBtn.addEventListener('click', openCalculator);
if (shoppingBtn) shoppingBtn.addEventListener('click', openShoppingList);
if (plannerBtn) plannerBtn.addEventListener('click', openWeekPlanner);

// ============================================
// INICIALIZAR
// ============================================
loadUserData();

// ============================================================
// PARTE EXTRA: SLIDER NOVO + CATEGORIAS (como você já tinha)
// ============================================================
(function () {
  'use strict';

  console.log('🚀 Inicializando slider e categorias...');

  let currentSlideIndex = 0;
  let sliderAutoplay;

  function initSlider() {
    const track = document.getElementById('sliderTrack');
    const dots = document.getElementById('sliderDots');

    if (!track || !dots) {
      console.warn('⚠️ Elementos do slider não encontrados');
      return;
    }

    const featured = RECIPES.filter(r => r.featured).slice(0, 4);
    if (!featured.length) {
      console.warn('⚠️ Nenhuma receita featured encontrada');
      return;
    }

    track.innerHTML = featured.map(recipe => `
      <div class="slide-new">
        <img src="${recipe.image}" alt="${recipe.name}" onerror="this.src='https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600&q=80'">
        <div class="slide-overlay-new">
          <h2 class="slide-title-new">${recipe.name}</h2>
          <p class="slide-description-new">${recipe.ingredients?.[0] || 'Receita deliciosa e saudável'}</p>
        </div>
      </div>
    `).join('');

    dots.innerHTML = featured.map((_, index) =>
      `<button class="slider-dot-new ${index === 0 ? 'active' : ''}" onclick="goToSlideNew(${index})"></button>`
    ).join('');

    startAutoplay();
    console.log('✅ Slider inicializado');
  }

  window.changeSlideNew = function (direction) {
    const slides = document.querySelectorAll('.slide-new');
    if (!slides.length) return;

    currentSlideIndex = (currentSlideIndex + direction + slides.length) % slides.length;
    updateSlider();
  };

  window.goToSlideNew = function (index) {
    currentSlideIndex = index;
    updateSlider();
  };

  function updateSlider() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;

    track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

    document.querySelectorAll('.slider-dot-new').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlideIndex);
    });

    startAutoplay();
  }

  function startAutoplay() {
    clearInterval(sliderAutoplay);
    sliderAutoplay = setInterval(() => window.changeSlideNew(1), 8000);
  }

  function initCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) {
      console.warn('⚠️ Grid de categorias não encontrado');
      return;
    }

    const categories = [
      { name: 'Todas', value: '' },
      { name: 'Café da Manhã', value: 'Café da Manhã' },
      { name: 'Almoço', value: 'Almoço' },
      { name: 'Jantar', value: 'Jantar' },
      { name: 'Lanches', value: 'Lanches' },
      { name: 'Sobremesas', value: 'Sobremesas' },
      { name: 'Veganas', value: 'Veganas' }
    ];

    grid.innerHTML = categories.map((cat, index) => `
      <div class="category-card-new ${index === 0 ? 'active' : ''}"
           onclick="filterByCategory('${cat.value}', this)">
        ${cat.name}
      </div>
    `).join('');

    console.log('✅ Categorias inicializadas');
  }

  window.filterByCategory = function (category, element) {
    document.querySelectorAll('.category-card-new').forEach(card => card.classList.remove('active'));
    if (element) element.classList.add('active');

    searchTerm = category || '';
    renderRecipes();
  };

  function setupSliderHideShow() {
    const originalShowRecipe = window.showRecipeDetail;
    if (originalShowRecipe) {
      window.showRecipeDetail = function (recipe) {
        const slider = document.getElementById('heroSlider');
        const categories = document.querySelector('.categories-new');

        if (slider) slider.classList.add('hidden');
        if (categories) categories.style.display = 'none';

        return originalShowRecipe.call(this, recipe);
      };
    }

    const originalCloseRecipe = window.closeRecipeDetail;
    if (originalCloseRecipe) {
      window.closeRecipeDetail = function () {
        const slider = document.getElementById('heroSlider');
        const categories = document.querySelector('.categories-new');

        if (slider) slider.classList.remove('hidden');
        if (categories) categories.style.display = 'block';

        return originalCloseRecipe.call(this);
      };
    }
  }

  function initCategoriesDrag() {
    const grid = document.querySelector('.categories-grid-new');
    if (!grid) return;

    let isDown = false;
    let startX;
    let scrollLeft;

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

    const style = document.createElement('style');
    style.textContent = `
      .category-card-new {
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    if (typeof RECIPES === 'undefined') {
      console.warn('⚠️ RECIPES não definido, aguardando...');
      setTimeout(init, 500);
      return;
    }

    initSlider();
    initCategories();
    setupSliderHideShow();

    setTimeout(initCategoriesDrag, 2000);
    console.log('✅ Slider e categorias prontos!');
  }

  setTimeout(init, 1000);
})();

// ============================================
// FAQ (como você tinha)
// ============================================
const faqData = [
  {
    title: '💳 Créditos Gratuitos',
    items: [
      { q: 'Como funcionam os 3 créditos?', a: 'Use 1 crédito = 1 receita liberada permanentemente.' },
      { q: 'Perco acesso às receitas?', a: 'NÃO! Receita desbloqueada fica sua para sempre.' },
      { q: 'Posso ganhar mais créditos?', a: 'Os 3 são únicos. Para ilimitado, ative Premium.' }
    ]
  },
  {
    title: '⭐ Premium',
    items: [
      { q: 'O que ganho?', a: '46+ receitas • Ferramentas liberadas • Novas receitas • E-book PDF (se você quiser incluir)' },
      { q: 'Como ativar?', a: 'Clique "Ativar Premium" → usará o código validado no checkout.' },
      { q: 'Posso cancelar?', a: 'Sim! Sem fidelidade (quando você implementar assinatura).' }
    ]
  },
  {
    title: '🛠️ Ferramentas',
    items: [
      { q: 'Calculadora de Calorias?', a: 'Ícone azul → Preencha dados → Veja calorias ideais' },
      { q: 'Lista de Compras?', a: 'Na receita, clique "Adicionar à Lista" → Marque ao comprar' },
      { q: 'Planejador Semanal?', a: 'Ícone laranja → Escolha dia/refeição → Adicione receitas' },
      { q: 'São pagas?', a: 'Sim, exclusivas Premium.' }
    ]
  },
  {
    title: '🍽️ Receitas',
    items: [
      { q: 'Como desbloquear?', a: 'Clique na receita → Use 1 crédito → Acesso permanente' },
      { q: 'Posso buscar?', a: 'Use a barra de busca ou clique nas categorias' },
      { q: 'Têm info nutricional?', a: 'Sim! Calorias, proteína, tempo, porções' }
    ]
  }
];

function renderFAQ() {
  const content = document.getElementById('faq-content');
  if (!content) return;

  content.innerHTML =
    faqData.map((section, idx) => `
      <div style="margin-bottom: 1.5rem;">
        <button onclick="toggleFAQSection(${idx})"
                style="width: 100%; padding: 1rem; background: #f3f4f6; border: none; border-radius: 0.75rem;
                       cursor: pointer; font-weight: 600; font-size: 1.125rem; text-align: left;
                       display: flex; justify-content: space-between; align-items: center;">
          <span>${section.title}</span>
          <span id="faq-arrow-${idx}">▼</span>
        </button>
        <div id="faq-section-${idx}" style="display: block; padding: 1rem; background: white; border-radius: 0 0 0.75rem 0.75rem;">
          ${section.items.map(item => `
            <div style="margin-bottom: 1rem;">
              <strong style="color: #16a34a;">• ${item.q}</strong>
              <p style="margin: 0.25rem 0 0 1rem; color: #6b7280; font-size: 0.95rem;">${item.a}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
}

function toggleFAQSection(idx) {
  const section = document.getElementById(`faq-section-${idx}`);
  const arrow = document.getElementById(`faq-arrow-${idx}`);
  if (!section || !arrow) return;

  if (section.style.display === 'none') {
    section.style.display = 'block';
    arrow.textContent = '▼';
  } else {
    section.style.display = 'none';
    arrow.textContent = '▶';
  }
}

function openFAQ() {
  renderFAQ();
  const modal = document.getElementById('faq-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function closeFAQ() {
  const modal = document.getElementById('faq-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

const faqBtn = document.getElementById('faq-btn');
if (faqBtn) faqBtn.addEventListener('click', openFAQ);
