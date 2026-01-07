// ============================================
// ARQUIVO: js/app.js (CONSOLIDADO B — REVISADO)
// - Remove dupla cobrança de crédito
// - Remove duplicação de closeMealSelector (assumindo B: #meal-selector-modal no HTML)
// - Centraliza RECIPES/allRecipes (fonte única)
// - Premium preparado p/ evoluir pra token/KV sem quebrar nada
// - Mantém visual e funcionalidades
// ============================================


// TÉCNICAS ANTI-BURLA (DevTools)
// Dificuldade: ⭐⭐⭐☆☆ (só dev experiente consegue)
// ============================================

// ============================================
// PROTEÇÃO ANTI-BURLA (3 camadas) - V2
// ============================================

(function() {
  'use strict';
  
  // 1️⃣ VALIDAÇÃO DE TOKEN (a cada 5s)
  setInterval(() => {
    const premium = localStorage.getItem('fit_premium');
    const token = localStorage.getItem('fit_premium_token');
    
    if (premium === 'true') {
      if (!token || token.length === 0) {
        console.warn('🚨 Premium sem token - limpando...');
        localStorage.clear();
        location.reload();
        return;
      }

      try {
        const decoded = atob(token);
        const tokenData = JSON.parse(decoded);
        
        if (!tokenData.code || !tokenData.expires || !tokenData.activated) {
          throw new Error('Token malformado');
        }
        
        if (Date.now() > tokenData.expires) {
          console.warn('🚨 Token expirado - limpando...');
          localStorage.clear();
          location.reload();
          return;
        }
        
      } catch (e) {
        console.warn('🚨 Token inválido - limpando...', e.message);
        localStorage.clear();
        location.reload();
      }
    }
  }, 5000);

  // 2️⃣ DETECTAR DEVTOOLS ABERTO
  let devtoolsWarned = false;
  setInterval(() => {
    const threshold = 160;
    const isOpen = window.outerWidth - window.innerWidth > threshold || 
                   window.outerHeight - window.innerHeight > threshold;
    
    if (isOpen && !devtoolsWarned) {
      devtoolsWarned = true;
      console.clear();
      console.log('%c⚠️ ÁREA TÉCNICA', 'color:red;font-size:30px;font-weight:bold;text-shadow:2px 2px 4px rgba(0,0,0,0.3)');
      console.log('%c ', 'font-size:1px');
      console.log('%cEsta é uma área para desenvolvedores.', 'font-size:16px;color:#333');
      console.log('%cModificar o código pode violar os Termos de Uso.', 'font-size:14px;color:orange;font-weight:bold');
      console.log('%c ', 'font-size:1px');
      console.log('%cSe você é desenvolvedor e quer contribuir, entre em contato!', 'font-size:12px;color:#16a34a');
    } else if (!isOpen) {
      devtoolsWarned = false;
    }
  }, 1000);

  // 3️⃣ MONITORAR MUDANÇAS NO LOCALSTORAGE
  // Detecta modificações suspeitas
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    // Detecta tentativas de burla
    if (key === 'fit_premium' && value === 'true') {
      const token = localStorage.getItem('fit_premium_token');
      if (!token || token.length < 20) {
        console.error('🚨 Tentativa de burla detectada!');
        console.warn('Premium sem token válido.');
        // Não permite setar
        return;
      }
    }
    
    // Chama original
    return originalSetItem.apply(this, arguments);
  };

  // 4️⃣ VALIDAÇÃO EXTRA AO ACESSAR RECEITAS
  // Intercepta cliques nas receitas
  document.addEventListener('click', function(e) {
    const recipeCard = e.target.closest('.recipe-card');
    if (recipeCard) {
      // Valida estado premium
      const premium = localStorage.getItem('fit_premium');
      const token = localStorage.getItem('fit_premium_token');
      
      if (premium === 'true' && (!token || token.length < 20)) {
        e.preventDefault();
        e.stopPropagation();
        console.error('🚨 Estado inválido detectado');
        localStorage.clear();
        location.reload();
      }
    }
  }, true);

  console.log('%c✅ Proteções ativas (v2)', 'color:#16a34a;font-weight:bold');

})();







// ==============================
// FONTE ÚNICA DE DADOS (receitas)
// ==============================
const ALL_RECIPES = (typeof RECIPES !== 'undefined' && Array.isArray(RECIPES)) ? RECIPES : [];
let allRecipes = ALL_RECIPES; // compat

// ==============================
// ESTADO DO USUÁRIO
// ==============================
let credits = 3;
let unlockedRecipes = [];


let isPremium = false;
let premiumToken = null;
let premiumExpires = null;

// ⭐ NOVO - Controle de timers de expiração
let _premiumTimeout = null;
let _premiumInterval = null;

// UI state
let currentRecipe = null;


let currentSlideIndex = 0;
let featuredRecipes = [];
let searchTerm = '';
let shoppingList = [];
let weekPlan = {};

// ==============================
// STORAGE ADAPTER (localStorage / Claude)
// ==============================
const isClaudeEnvironment = typeof window.storage !== 'undefined';

const storage = {
  async get(key) {
    try {
      if (isClaudeEnvironment) return await window.storage.get(key);
      const value = localStorage.getItem(key);
      return value ? { key, value } : null;
    } catch (e) {
      return null;
    }
  },
  async set(key, value) {
    try {
      if (isClaudeEnvironment) return await window.storage.set(key, value);
      localStorage.setItem(key, value);
      return { key, value };
    } catch (e) {
      return null;
    }
  }
};

// ==============================
// DOM
// ==============================
const creditsBadge = document.getElementById('credits-badge');
const premiumBtn = document.getElementById('premium-btn');
const creditsText = document.getElementById('credits-text'); // pode não existir (vc re-renderiza)

const recipeGrid = document.getElementById('recipe-grid');
const recipeDetail = document.getElementById('recipe-detail');

const premiumModal = document.getElementById('premium-modal');
const premiumCodeInput = document.getElementById('premium-code-input');
const modalMessage = document.getElementById('modal-message');
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

// Modal (B) — modal de refeição existente no HTML
const mealSelectorModal = document.getElementById('meal-selector-modal');
const mealSelectorSubtitle = document.getElementById('meal-selector-subtitle');

// ==============================
// MODAL HELPERS
// ==============================



function openModal(el) {
  if (!el) return;

  el.classList.remove('hidden');
  document.body.classList.add('modal-open');

  // ✅ Foco automático se for o modal Premium (cobre TODOS os caminhos)
  if (el.id === 'premium-modal') {
    setTimeout(() => {
      const input = document.getElementById('premium-code-input');
      if (input) {
        input.focus();
        input.select();
      }
    }, 150);
  }
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

  // 🔁 volta a tab para Início (cinza)
  setActiveTab(0);
};





// ==============================
// CORE BUSINESS RULES (fonte da verdade)
// ==============================
function canAccessRecipe(recipeId) {
  if (isPremium) return true;
  if (unlockedRecipes.includes(recipeId)) return true;
  return credits > 0;
}

/**
 * Consome crédito e libera receita APENAS uma vez,
 * e somente quando necessário.
 * Retorna true se pode acessar, false se deve ir pro premium.
 */
function ensureRecipeAccess(recipeId) {
  // Premium ou já liberada
  if (isPremium || unlockedRecipes.includes(recipeId)) return true;
  
  // ✅ Tem crédito: ABRE MODAL DE CONFIRMAÇÃO
  if (credits > 0) {
    openConfirmCreditModal(recipeId);
    return false; // Não abre a receita ainda
  }
  
  // ✅ SEM CRÉDITO: Isso nunca deve acontecer aqui porque viewRecipe() já trata
  // Mas mantemos como fallback de segurança
  if (modalMessage) {
    modalMessage.textContent = 'Seus créditos acabaram. Ative o Premium para acesso ilimitado.';
  }
  const warning = document.getElementById('credits-warning');
  if (warning) warning.classList.remove('hidden');
  openModal(premiumModal);
  return false;
}






// ================================
// MODAL DE CONFIRMAÇÃO DE CRÉDITO
// ================================
let pendingRecipeId = null;

window.openConfirmCreditModal = function(recipeId) {
  const recipe = allRecipes.find(r => r.id === recipeId);
  if (!recipe) return;
  
  pendingRecipeId = recipeId;
  
  // Atualiza o modal com informações
  const creditsRemaining = document.getElementById('credits-remaining');
  const recipeNameConfirm = document.getElementById('recipe-name-confirm');
  
  if (creditsRemaining) creditsRemaining.textContent = credits;
  if (recipeNameConfirm) recipeNameConfirm.textContent = recipe.name;
  
  // Abre o modal
  const modal = document.getElementById('confirm-credit-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }
};

window.closeConfirmCreditModal = function() {
  const modal = document.getElementById('confirm-credit-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
  pendingRecipeId = null;
};

window.confirmUnlockRecipe = function() {
  if (!pendingRecipeId) return;
  
  // ✅ Salva o ID ANTES de fechar o modal
  const recipeToOpen = pendingRecipeId;
  
  // Gasta o crédito e desbloqueia
  if (credits > 0) {
    credits--;
    unlockedRecipes.push(recipeToOpen);
    saveUserData();
    updateUI();
    renderRecipes();
    
    // Fecha modal e abre receita
    closeConfirmCreditModal();
    showRecipeDetail(recipeToOpen);
  }
};










// ==============================
// INIT
// ==============================
async function loadUserData() {
  try {
    // Carrega token premium
    const tokenResult = await storage.get('fit_premium_token');
    const expiresResult = await storage.get('fit_premium_expires');
    
    if (tokenResult && tokenResult.value) {
      premiumToken = tokenResult.value;
      
      // ✅ CONVERSÃO CORRETA DO TIMESTAMP
      const expiresStr = expiresResult?.value;
      if (expiresStr) {
        // Garante que é número
        premiumExpires = parseInt(expiresStr, 10);
        
        // ✅ DEBUG - MOSTRA OS VALORES
        console.log('[LOAD] Premium data:', {
          token: premiumToken,
          expiresStr: expiresStr,
          expiresNum: premiumExpires,
          now: Date.now(),
          expiresDate: new Date(premiumExpires).toISOString(),
          isExpired: Date.now() > premiumExpires
        });
        
        // ✅ VALIDAÇÃO DE EXPIRAÇÃO
        if (Date.now() > premiumExpires) {
          console.log('[PREMIUM] Token expirado ao carregar');
          await storage.set('fit_premium', 'false');
          await storage.set('fit_premium_token', '');
          await storage.set('fit_premium_expires', '');
          isPremium = false;
          premiumToken = null;
          premiumExpires = null;
        } else {
          // Token válido
          console.log('[PREMIUM] Token válido!');
          isPremium = true;
          await storage.set('fit_premium', 'true');
        }
      } else {
        // Sem data de expiração
        isPremium = false;
      }
    } else {
      // Não tem token - verifica flag antiga
      const premiumResult = await storage.get('fit_premium');
      if (premiumResult && premiumResult.value === 'true') {
        isPremium = true;
      }
    }
    
    // Se não é premium, carrega créditos
    if (!isPremium) {
      const creditsResult = await storage.get('fit_credits');
      const unlockedResult = await storage.get('fit_unlocked');
      if (creditsResult) credits = parseInt(creditsResult.value || '3', 10);
      if (unlockedResult) unlockedRecipes = JSON.parse(unlockedResult.value || '[]');
    }
    
    const shoppingResult = await storage.get('fit_shopping');
    const weekPlanResult = await storage.get('fit_weekplan');
    if (shoppingResult && shoppingResult.value) shoppingList = JSON.parse(shoppingResult.value);
    if (weekPlanResult && weekPlanResult.value) weekPlan = JSON.parse(weekPlanResult.value);
    
  } catch (e) {
    console.error('Erro ao carregar dados:', e);
  }

  updateUI();
  updateShoppingCounter();
  initSliderAndCategories();
  renderRecipes();
  
   if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ✅ SETUP TIMERS DEPOIS DE TUDO
  _setupPremiumTimers();
  
}


async function saveUserData() {
  try {
    if (isPremium && premiumToken) {
      // Salva token premium
      await storage.set('fit_premium', 'true');
      await storage.set('fit_premium_token', premiumToken);
      if (premiumExpires) {
        await storage.set('fit_premium_expires', premiumExpires.toString());
      }
    } else {
      // Salva créditos
      await storage.set('fit_credits', credits.toString());
      await storage.set('fit_unlocked', JSON.stringify(unlockedRecipes));
      await storage.set('fit_premium', 'false');
    }
  } catch (e) {
    console.error('Erro ao salvar dados:', e);
  }
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






// ==============================
// UI (Badge / Premium)
// ==============================
function updateUI() {
  try {
    if (!creditsBadge) return;

    let badgeText = 'Premium';

    if (isPremium) {
      document.body.classList.remove('free-user');
      document.body.classList.add('premium-active');

      creditsBadge.classList.add('premium');

      if (premiumExpires) {
        const daysLeft = Math.ceil(
          (premiumExpires - Date.now()) / (1000 * 60 * 60 * 24)
        );

        if (daysLeft > 0) {
          badgeText = `PREMIUM (${daysLeft}D)`;
        }
      }

      creditsBadge.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span>${badgeText}</span>
      `;

      if (premiumBtn) {
        premiumBtn.style.display = 'none';
        premiumBtn.offsetHeight; // força reflow
      }

    } else {
      document.body.classList.add('free-user');
      document.body.classList.remove('premium-active');

      creditsBadge.classList.remove('premium');
      creditsBadge.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <span id="credits-text">${credits} Créditos</span>
      `;

      if (premiumBtn) {
        premiumBtn.style.display = 'block';
        premiumBtn.offsetHeight; // força reflow
      }
    }

    creditsBadge.classList.add('ready');

    // ===============================
    // 🔶 PREMIUM NO MENU HAMBÚRGUER
    // ===============================
    const hamburgerLabel = document.getElementById('hamburger-premium-label');
    const hamburgerBtn = document.querySelector('.hamburger-premium-btn');

    if (hamburgerLabel && hamburgerBtn) {
      if (isPremium) {
        hamburgerLabel.textContent = badgeText;
        hamburgerBtn.classList.add('premium');
        hamburgerBtn.classList.remove('free');
      } else {
        hamburgerLabel.textContent = 'Seja Premium';
        hamburgerBtn.classList.remove('premium');
        hamburgerBtn.classList.add('free');
      }
    }

  } catch (error) {
    console.error('Erro em updateUI:', error);
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

// ==============================
// SLIDER + CATEGORIAS
// ==============================
let sliderAutoplay = null;

function initSliderAndCategories() {
  if (!allRecipes || allRecipes.length === 0) return;

  if (sliderTrack && sliderDots) {
    featuredRecipes = allRecipes.filter(r => r.featured).slice(0, 4);

    sliderTrack.innerHTML = featuredRecipes.map(recipe => `
      <div class="slide-new">
        <img src="${recipe.image}" alt="${recipe.name}"
          onerror="this.src='https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80'">
        <div class="slide-overlay-new">
          <h2 class="slide-title-new">${recipe.name}</h2>
          <p class="slide-description-new">${recipe.description || 'Receita deliciosa e saudável'}</p>
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

  if (element && element.scrollIntoView) {
    element.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  searchTerm = category || '';
  closeRecipeDetail();
  renderRecipes();
};

// ==============================
// RENDER RECEITAS
// ==============================
function renderRecipes() {
  if (!recipeGrid || !allRecipes || allRecipes.length === 0) return;

  let filtered = allRecipes;

  if (searchTerm) {
    filtered = allRecipes.filter(recipe => {
      return recipe.category === searchTerm ||
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  recipeGrid.innerHTML = filtered.map(recipe => {
    const isUnlocked = isPremium || unlockedRecipes.includes(recipe.id);
    const showLock = !isUnlocked && credits === 0; // UX: só aparece quando zerou

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
              <span class="btn-label">Ver Receita</span>
            ` : `
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>

              <span class="btn-label btn-label-desktop">Desbloquear <small>(1 crédito)</small></span>
              <span class="btn-label btn-label-mobile">1 crédito</span>
            `}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.viewRecipe = function(recipeId) {
  haptic(10);
  
  // ✅ NOVO: Se não tem créditos E não é premium → abre premium modal DIRETO
  if (!isPremium && credits === 0 && !unlockedRecipes.includes(recipeId)) {
    if (modalMessage) {
      modalMessage.textContent = 'Seus créditos acabaram. Ative o Premium para acesso ilimitado.';
    }
    const warning = document.getElementById('credits-warning');
    if (warning) warning.classList.remove('hidden');
    
    openModal(premiumModal);
    return; // Para aqui, não continua
  }
  
  // ✅ Verifica expiração premium
  if (isPremium && premiumExpires && Date.now() > premiumExpires) {
    console.log('[PREMIUM] Expirou ao tentar abrir receita');
    _handlePremiumExpiration();
    return;
  }
  
  // ✅ Consome crédito OU verifica premium (SÓ chega aqui se credits > 0)
  if (!ensureRecipeAccess(recipeId)) return;
  
  showRecipeDetail(recipeId);
};

// ==============================
// DETALHE DA RECEITA
// ==============================


function showRecipeDetail(recipeId) {
  const recipe = allRecipes.find(r => r.id === recipeId);
  if (!recipe) return;

  currentRecipe = recipe;
  const heroImage = recipe.images?.hero || recipe.image;


  

 recipeDetail.innerHTML = `
  <div class="breadcrumbs-wrapper">
    <button class="back-btn" onclick="closeRecipeDetail()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      Início
    </button>

    <div class="breadcrumbs">
      <div class="breadcrumb-item">
        <span class="breadcrumb-link" onclick="closeRecipeDetailAndFilter('${recipe.category}')">
          ${recipe.category}
        </span>
        <span class="breadcrumb-separator">></span>
      </div>
      <div class="breadcrumb-item">
        <span class="breadcrumb-current">${recipe.name}</span>
      </div>
    </div>
  </div>

  <img src="${heroImage}" alt="${recipe.name}" class="detail-hero-image">



    

    <div class="detail-content-wrapper">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem;">
        <h2 class="detail-title" style="margin:0;">${recipe.name}</h2>
        <button class="btn-add-shopping" onclick="addToShoppingList(${recipe.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Adicionar à Lista
        </button>
      </div>

      ${recipe.tags && recipe.tags.length > 0 ? `
        <div class="tags-container">
          ${recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      ` : ''}

      <div class="detail-stats">
        <div class="detail-stat">
          <div class="detail-stat-value">${recipe.calories}</div>
          <div class="detail-stat-label">Calorias</div>
        </div>
        <div class="detail-stat">
          <div class="detail-stat-value">${recipe.protein}g</div>
          <div class="detail-stat-label">Proteína</div>
        </div>
        <div class="detail-stat">
          <div class="detail-stat-value">${recipe.carbs}g</div>
          <div class="detail-stat-label">Carbos</div>
        </div>
        <div class="detail-stat">
          <div class="detail-stat-value">${recipe.fats}g</div>
          <div class="detail-stat-label">Gorduras</div>
        </div>
        <div class="detail-stat">
          <div class="detail-stat-value">${recipe.time}min</div>
          <div class="detail-stat-label">Tempo</div>
        </div>
        <div class="detail-stat">
          <div class="detail-stat-value">${recipe.difficulty}</div>
          <div class="detail-stat-label">Dificuldade</div>
        </div>
      </div>

      <div class="detail-section">
        <h3 class="section-title">
          <i data-lucide="calendar-plus" class="section-icon"></i>
          Adicionar ao Planejamento Semanal
        </h3>
        <p class="planner-subtitle">Selecione o dia da semana que você quer fazer esta receita</p>
        <div class="planner-days">
          ${['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'].map(day => `
            <button class="planner-day" onclick="addToWeekPlan('${day}', ${recipe.id})">${day}</button>
          `).join('')}
        </div>
      </div>

      ${recipe.benefits && recipe.benefits.length > 0 ? `
        <div class="detail-section">
          <h3 class="section-title">
            <i data-lucide="heart-pulse" class="section-icon"></i>
            Benefícios
          </h3>
          <div class="benefits-grid">
            ${recipe.benefits.map(benefit => `
              <div class="benefit-item">
                <i data-lucide="check-circle" class="benefit-icon"></i>
                <span>${benefit}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="detail-section">
        <h3 class="section-title">
          <i data-lucide="chef-hat" class="section-icon"></i>
          Ingredientes
        </h3>
        <div class="ingredients-grid">
          ${(recipe.ingredients || []).map(ing => {
            if (typeof ing === 'string') {
              return `
                <div class="ingredient-item">
                  <div class="ingredient-icon-wrapper">
                    <i data-lucide="circle-dot" class="ingredient-icon"></i>
                  </div>
                  <div class="ingredient-content">
                    <span class="ingredient-text">${ing}</span>
                  </div>
                </div>
              `;
            }
            return `
              <div class="ingredient-item">
                <div class="ingredient-icon-wrapper">
                  <i data-lucide="${ing.icon || 'circle-dot'}" class="ingredient-icon"></i>
                </div>
                <div class="ingredient-content">
                  <span class="ingredient-quantity">${ing.quantity || ''}</span>
                  <span class="ingredient-text">${ing.text || ''}</span>
                  ${ing.optional ? '<span class="ingredient-optional">Opcional</span>' : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="detail-section">
        <h3 class="section-title">
          <i data-lucide="utensils" class="section-icon"></i>
          Modo de Preparo
        </h3>
        <ol class="instructions-list">
          ${(recipe.instructions || []).map((step, idx) => `
            <li class="instruction-item">
              <div class="instruction-header">
                <div class="instruction-number">${idx + 1}</div>
                <div class="instruction-text">${step}</div>
              </div>
              ${recipe.images?.steps && recipe.images.steps[idx] ? `
                <img src="${recipe.images.steps[idx]}" alt="Passo ${idx + 1}"
                     class="instruction-image" loading="lazy">
              ` : ''}
            </li>
          `).join('')}
        </ol>
      </div>

      ${recipe.tips && recipe.tips.length > 0 ? `
        <div class="detail-section">
          <h3 class="section-title">
            <i data-lucide="lightbulb" class="section-icon"></i>
            Dicas do Chef
          </h3>
          <div class="tips-list">
            ${recipe.tips.map(tip => `<div class="tip-item">${tip}</div>`).join('')}
          </div>
        </div>
      ` : ''}

      ${recipe.allergens && recipe.allergens.length > 0 ? `
        <div class="detail-section">
          <h3 class="section-title">
            <i data-lucide="alert-triangle" class="section-icon"></i>
            Alérgenos
          </h3>
          <div class="allergens-container">
            ${recipe.allergens.map(allergen => `
              <div class="allergen-badge">
                <i data-lucide="alert-circle" class="allergen-icon"></i>
                ${allergen}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // ✅ Renderiza os ícones Lucide
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // ✅ ANIMAÇÃO SUAVE
  const slider = document.getElementById('heroSlider');
  const categories = document.querySelector('.categories-new');
  
  // Fade out: grid, slider, categorias
  recipeGrid.classList.add('fade-out');
  if (slider) slider.classList.add('fade-out');
  if (categories) categories.classList.add('fade-out');
  
  setTimeout(() => {
    // Esconde os elementos
    recipeGrid.classList.add('hidden');
    recipeGrid.classList.remove('fade-out');
    if (slider) {
      slider.style.display = 'none';
      slider.classList.remove('fade-out');
    }
    if (categories) {
      categories.style.display = 'none';
      categories.classList.remove('fade-out');
    }
    
    // Mostra receita
    recipeDetail.classList.remove('hidden');
    recipeDetail.classList.add('fade-in');
    
    // Scroll suave pro topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 300);
}




window.closeRecipeDetail = function() {
  const recipeDetailEl = document.getElementById('recipe-detail');
  const recipeGridEl = document.getElementById('recipe-grid');
  
  if (!recipeDetailEl || !recipeGridEl) return;

  const slider = document.getElementById('heroSlider');
  const categories = document.querySelector('.categories-new');
  
  // Fade out: receita
  recipeDetailEl.classList.add('fade-out');
  
  setTimeout(() => {
    // Esconde receita
    recipeDetailEl.classList.add('hidden');
    recipeDetailEl.classList.remove('fade-out', 'fade-in');
    
    currentRecipe = null;
    
    // Mostra grid, slider, categorias
    recipeGridEl.classList.remove('hidden');
    recipeGridEl.classList.add('fade-in');
    
    if (slider) {
      slider.style.display = 'block';
      slider.classList.add('fade-in');
    }
    if (categories) {
      categories.style.display = 'block';
      categories.classList.add('fade-in');
    }
    
    renderRecipes();
    
    // Scroll suave pro topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 300);
};




window.closeRecipeDetailAndFilter = function(category) {
  const recipeDetailEl = document.getElementById('recipe-detail');
  const recipeGridEl = document.getElementById('recipe-grid');
  
  if (!recipeDetailEl || !recipeGridEl) return;

  const slider = document.getElementById('heroSlider');
  const categories = document.querySelector('.categories-new');
  
  // Fade out: receita
  recipeDetailEl.classList.add('fade-out');
  
  setTimeout(() => {
    // Esconde receita
    recipeDetailEl.classList.add('hidden');
    recipeDetailEl.classList.remove('fade-out', 'fade-in');
    
    currentRecipe = null;
    
    // Mostra grid, slider, categorias
    recipeGridEl.classList.remove('hidden');
    recipeGridEl.classList.add('fade-in');
    
    if (slider) {
      slider.style.display = 'block';
      slider.classList.add('fade-in');
    }
    if (categories) {
      categories.style.display = 'block';
      categories.classList.add('fade-in');
    }
    
    // ✅ FILTRA PELA CATEGORIA
    searchTerm = category;
    renderRecipes();
    
    // ✅ ATIVA O BOTÃO DA CATEGORIA
    document.querySelectorAll('.category-card-new').forEach(card => {
      card.classList.remove('active');
      if (card.textContent.trim() === category) {
        card.classList.add('active');
        // Scroll pra categoria ativa
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });
    
    // Scroll suave pro topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 300);
};







// ==============================
// LISTA DE COMPRAS
// ==============================
window.addToShoppingList = function(recipeId) {
  const recipe = allRecipes.find(r => r.id === recipeId);
  if (!recipe) return;

  (recipe.ingredients || []).forEach(ing => {
    const ingText = typeof ing === 'string'
      ? ing
      : `${ing.quantity || ''} ${ing.text || ''}`.trim();

    const existingItem = shoppingList.find(item => {
      const itemText = typeof item.text === 'string'
        ? item.text
        : `${item.quantity || ''} ${item.text || ''}`.trim();
      return itemText.toLowerCase() === ingText.toLowerCase();
    });

    if (existingItem) {
      if (!existingItem.recipes) existingItem.recipes = [existingItem.recipe];
      if (!existingItem.recipes.includes(recipe.name)) existingItem.recipes.push(recipe.name);
    } else {
      shoppingList.push({
        id: Date.now() + Math.random(),
        text: ingText,
        checked: false,
        recipe: recipe.name,
        recipes: [recipe.name]
      });
    }
  });

  saveShoppingList();
  showNotification('Sucesso!', `Ingredientes de "${recipe.name}" adicionados à lista.`);
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
        <p style="font-size:1.125rem;margin-bottom:.5rem;">Sua lista está vazia</p>
        <p style="font-size:.875rem;">Adicione ingredientes das receitas</p>
      </div>
    `;
    return;
  }

  content.innerHTML = `
    <div style="max-height: 60vh; overflow-y: auto;">
      ${shoppingList.map(item => `
        <div class="shopping-item">
          <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleShoppingItem('${item.id}')">
          <div class="shopping-item-content">
            <div class="shopping-item-content">
              ${item.text
                ? (typeof item.text === 'string' ? item.text : `${item.quantity || ''} ${item.text}`)
                : (item.quantity && item.text ? `${item.quantity} ${item.text}` : (item.ingredient || item))
              }
            </div>
            <div class="shopping-item-recipe">${item.recipes ? item.recipes.join(', ') : ''}</div>
          </div>
          <button class="btn-delete" onclick="removeShoppingItem('${item.id}')" aria-label="Remover item">
            <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      `).join('')}
    </div>

    <button class="btn-clear-list" onclick="clearShoppingList()">Limpar Toda a Lista</button>
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
  showConfirm(
    'Limpar lista',
    'Tem certeza que deseja limpar toda a lista de compras?',
    () => {
      shoppingList = [];
      saveShoppingList();
      updateShoppingCounter();
      closeShoppingList();
      showNotification('Tudo certo', 'Lista de compras limpa.');
    }
  );
};

// ==============================
// PLANEJADOR SEMANAL
// ==============================
let selectedDayForPlanner = null;
let selectedRecipeForPlanner = null;

// ✅ B) abre modal existente no HTML (#meal-selector-modal)
window.addToWeekPlan = function(day, recipeId) {
  console.log('[PLANNER] Abrindo seletor:', { day, recipeId });
  
  // ✅ Salva os valores
  selectedDayForPlanner = day;
  selectedRecipeForPlanner = recipeId;

  const recipe = allRecipes.find(r => r.id === recipeId);
  if (mealSelectorSubtitle && recipe) {
    mealSelectorSubtitle.textContent = `${day} - ${recipe.name}`;
  }

  const mealModal = document.getElementById('meal-selector-modal');
  if (mealModal) {
    // ✅ Remove hidden e modal-open do body
    mealModal.classList.remove('hidden');
    mealModal.style.pointerEvents = 'auto'; // ✅ IMPORTANTE
    document.body.classList.add('modal-open');
    
    console.log('[PLANNER] Modal aberto');
  }
  
  
  // ✅ Renderiza ícones Lucide
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}
    
};


window.addToWeekPlanWithMeal = function(meal) {
  console.log('[PLANNER] Adicionando:', { 
    day: selectedDayForPlanner, 
    recipeId: selectedRecipeForPlanner, 
    meal 
  });
  
  // ✅ Validação com log de erro
  if (!selectedDayForPlanner || !selectedRecipeForPlanner) {
    console.error('[PLANNER] Erro: Variáveis não definidas!', {
      selectedDay: selectedDayForPlanner,
      selectedRecipe: selectedRecipeForPlanner
    });
    return;
  }

  // ✅ Busca a receita
  const recipe = allRecipes.find(r => r.id === selectedRecipeForPlanner);
  
  if (!recipe) {
    console.error('[PLANNER] Erro: Receita não encontrada!', {
      recipeId: selectedRecipeForPlanner
    });
    return;
  }

  // ✅ Adiciona ao planejamento
  const key = `${selectedDayForPlanner}-${meal}`;
  weekPlan[key] = recipe;

  // ✅ Salva
  saveWeekPlan();
  
  console.log('[PLANNER] Receita salva:', { key, recipe: recipe.name });
  
  // ✅ Notificação
  showNotification(
  'Receita Adicionada!', 
  `${recipe.name} adicionado para\n${selectedDayForPlanner} - ${meal}`
   );

  // ✅ FECHA O MODAL (IMPORTANTE!)
  window.closeMealSelector();
  
  console.log('[PLANNER] Modal fechado, processo concluído');
};

window.closeMealSelector = function() {
  const modal = document.getElementById('meal-selector-modal');

  if (modal) {
    modal.classList.add('hidden');
    modal.style.pointerEvents = 'auto'; // ✅ MUDOU: 'auto' em vez de 'none'
  }

  // ✅ Limpa as variáveis
  selectedDayForPlanner = null;
  selectedRecipeForPlanner = null;
  
  // ✅ Remove a classe modal-open
  document.body.classList.remove('modal-open');
  
  console.log('[MEAL SELECTOR] Modal fechado e variáveis limpas');
};






function renderWeekPlanner() {
  const content = document.getElementById('week-planner-content');
  if (!content) return;

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo' ];
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
  showNotification('Planejamento salvo', 'Planejamento semanal salvo com sucesso.');
};

window.removeFromWeekPlan = function(day, meal) {
  const key = `${day}-${meal}`;
  delete weekPlan[key];
  saveWeekPlan();
  renderWeekPlanner();
};

// ==============================
// CALCULADORA
// ==============================
window.calculateCalories = function() {
  const weight = parseFloat(document.getElementById('calc-weight')?.value);
  const height = parseFloat(document.getElementById('calc-height')?.value);
  const age = parseFloat(document.getElementById('calc-age')?.value);
  const gender = document.getElementById('calc-gender')?.value;
  const activity = document.getElementById('calc-activity')?.value;

  if (!weight || !height || !age) {
    showNotification('Atenção', 'Preencha todos os campos.');
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

// ==============================
// MODAIS (controle)
// ==============================
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

// ==============================
// PREMIUM (pronto p/ evoluir)
// ==============================
async function redeemPremiumCode(code) {
  // hoje: /api/redeem
  // amanhã: token/KV/edge -> só troca aqui
  const res = await fetch('/api/redeem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });

  const data = await res.json();
  return data; // { ok: true } | { ok:false, error }
}

async function activatePremium() {
  const input = document.getElementById('premium-code-input');
  const code = input ? input.value.trim().toUpperCase() : '';

  if (!code) {
    showNotification('Aviso', 'Digite um código válido');
    return;
  }

  try {
    const data = await redeemPremiumCode(code);

    if (!data || !data.ok) {
      showNotification('Código Inválido', data?.error || 'Código inválido ou expirado');
      return;
    }


    

    // ✅ DEBUG - MOSTRA O QUE A API RETORNOU
    console.log('[ACTIVATE] API Response:', {
      token: data.token,
      expiresAt: data.expiresAt,
      expiresInDays: data.expiresInDays,
      expiresDate: new Date(data.expiresAt).toISOString(),
      now: Date.now(),
      diff: data.expiresAt - Date.now()
    });



    

    // ✅ ATIVA PREMIUM COM TOKEN
    isPremium = true;
    premiumToken = data.token;
    premiumExpires = data.expiresAt;
    
    await storage.set('fit_premium', 'true');
    await storage.set('fit_premium_token', data.token);
    await storage.set('fit_premium_expires', data.expiresAt.toString());
    
    updateUI();
    _setupPremiumTimers();

    const daysLeft = data.expiresInDays || 30;
    showNotification(
      'Premium Ativado! 🎉', 
      `Você tem acesso ilimitado por ${daysLeft} dias!`
    );
    
    window.closePremiumModal();

    console.log('[PREMIUM] Ativado', { expires: new Date(data.expiresAt).toISOString() });

  } catch (e) {
    console.error('Erro ao ativar premium:', e);
    
    // ✅ MENSAGEM MAIS ESPECÍFICA
    if (e.message.includes('fetch')) {
      showNotification('Erro de Conexão', 'Verifique sua internet e tente novamente.');
    } else {
      showNotification('Erro', 'Erro ao validar código. Tente novamente.');
    }
  }
}


// ==============================
// SISTEMA HYBRID DE EXPIRAÇÃO PREMIUM
// ==============================

async function _handlePremiumExpiration() {
  console.log('[PREMIUM] Expirado - executando bloqueio');
  
  isPremium = false;
  premiumToken = null;
  premiumExpires = null;
  
  await storage.set('fit_premium', 'false');
  await storage.set('fit_premium_token', '');
  await storage.set('fit_premium_expires', '');
  
  updateUI();
  renderRecipes();
  
  // ✅ FECHA TODOS OS MODAIS ABERTOS
  const allModals = document.querySelectorAll('.modal:not(.hidden)');
  allModals.forEach(modal => {
    modal.classList.add('hidden');
  });
  document.body.classList.remove('modal-open');
  
  // Fecha modal de refeição especificamente
  if (typeof window.closeMealSelector === 'function') {
    window.closeMealSelector();
  }
  
  // Fecha detalhe de receita se estiver aberto
  if (typeof window.closeRecipeDetail === 'function') {
    window.closeRecipeDetail();
  }
  
  showNotification(
    'Premium Expirado', 
    'Seu acesso premium expirou. Adquira um novo código para continuar.'
  );
  
  setTimeout(() => {
    openModal(premiumModal);
  }, 2000);
  
  _clearPremiumTimers();
}

function _setupPremiumTimers() {
  // Limpa timers anteriores (se existirem)
  _clearPremiumTimers();
  
  if (!isPremium || !premiumExpires) return;
  
  const now = Date.now();
  const timeLeft = premiumExpires - now;
  
  // ✅ DEBUG - Ver cálculo
  console.log('[PREMIUM] Setup timers:', {
    now: new Date(now).toISOString(),
    expires: new Date(premiumExpires).toISOString(),
    timeLeft: timeLeft,
    timeLeftSeconds: Math.ceil(timeLeft / 1000),
    timeLeftDays: Math.ceil(timeLeft / (1000 * 60 * 60 * 24))
  });
  
  // ✅ Se já expirou, executa imediatamente
  if (timeLeft <= 0) {
    console.log('[PREMIUM] Já expirado ao configurar timer');
    _handlePremiumExpiration();
    return;
  }
  
  // ✅ CORREÇÃO: Usar apenas setInterval (não setTimeout para períodos longos)
  // Verifica a cada 30 segundos se expirou
  _premiumInterval = setInterval(() => {
    const now = Date.now();
    
    if (now >= premiumExpires) {
      console.log('[PREMIUM] Interval detectou expiração');
      _handlePremiumExpiration();
    } else {
      // ✅ DEBUG: mostra quanto tempo falta
      const remaining = premiumExpires - now;
      const daysLeft = Math.ceil(remaining / (1000 * 60 * 60 * 24));
      console.log(`[PREMIUM] Ainda ativo - ${daysLeft} dias restantes`);
    }




    
  }, 30000); // Verifica a cada 30 segundos

  
  
  console.log('[PREMIUM] Timer de verificação configurado (check a cada 30s)');
}




function _clearPremiumTimers() {
  if (_premiumTimeout) {
    clearTimeout(_premiumTimeout);
    _premiumTimeout = null;
  }
  
  if (_premiumInterval) {
    clearInterval(_premiumInterval);
    _premiumInterval = null;
  }
}

// ✅ Mantém função pública para compatibilidade
async function checkPremiumExpiration() {
  if (!isPremium || !premiumExpires) return;
  
  const now = Date.now();
  
  if (now > premiumExpires) {
    await _handlePremiumExpiration();
  }
}


// ==============================
// EVENTOS
// ==============================
if (premiumBtn) {
  premiumBtn.addEventListener('click', () => {
    if (modalMessage) modalMessage.textContent = 'Tenha acesso ilimitado a todas as receitas.';
    const warning = document.getElementById('credits-warning');
    if (warning) {
      if (credits === 0) warning.classList.remove('hidden');
      else warning.classList.add('hidden');
    }
    openModal(premiumModal);

    setTimeout(() => {
      if (premiumCodeInput) premiumCodeInput.focus();
    }, 100);
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

// ==============================
// FAQ (SEM emoji)
// ==============================
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

// ==============================
// NOTIFICAÇÃO + CONFIRM
// ==============================
function showNotification(title, message) {
  const modal = document.getElementById('notification-modal');
  const titleEl = document.getElementById('notification-title');
  const messageEl = document.getElementById('notification-message');

  if (titleEl) titleEl.textContent = title;
  if (messageEl) messageEl.textContent = message;

  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }
}

window.closeNotification = function() {
  const modal = document.getElementById('notification-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
};

function showConfirm(title, message, onConfirm) {
  const modal = document.getElementById('confirm-modal');
  if (!modal) return;

  const titleEl = modal.querySelector('.confirm-title');
  const messageEl = modal.querySelector('.confirm-message');
  const yesBtn = modal.querySelector('.confirm-yes');
  const noBtn = modal.querySelector('.confirm-no');

  if (titleEl) titleEl.textContent = title;
  if (messageEl) messageEl.textContent = message;

  const cleanup = () => {
    if (yesBtn) yesBtn.onclick = null;
    if (noBtn) noBtn.onclick = null;
    modal.classList.add('hidden');
  };

  if (yesBtn) {
    yesBtn.onclick = () => {
      cleanup();
      onConfirm();
    };
  }

  if (noBtn) noBtn.onclick = cleanup;

  modal.classList.remove('hidden');

  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  };
}

// ==============================
// HAPTIC
// ==============================
function haptic(ms = 8) {
  try {
    if (window.matchMedia('(pointer: coarse)').matches) {
      if (navigator.vibrate) navigator.vibrate(ms);
    }
  } catch(e){}
}

document.addEventListener('touchstart', (e) => {
  const target = e.target.closest('.tap');
  if (target) haptic(8);
}, { passive: true });



// ================================
// BOTÃO VOLTAR AO TOPO
// ================================
const backToTopBtn = document.getElementById('back-to-top');
// Mostra/esconde baseado no scroll


// ================================
// TAB BAR - FUNÇÕES
// ================================
window.tabGoHome = function() {
  haptic(10);
  
  // Fecha modal de detalhes se estiver aberto
  closeRecipeDetail();
  
  // Reseta busca
  searchTerm = '';
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  
  // Renderiza todas as receitas
  renderRecipes();
  
  // Scroll pro topo
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Atualiza estado ativo
  setActiveTab(0);
};

window.tabGoSearch = function() {
  haptic(10);
  
  // Scroll pro topo
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Foca no campo de busca
  setTimeout(() => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }, 300);
  
  // Atualiza estado ativo
  setActiveTab(1);
};

window.togglePlannerDropdown = function() {
  haptic(10);
  const dropdown = document.getElementById('planner-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
    
    // Renderiza ícones Lucide
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  
  // Atualiza estado ativo
  setActiveTab(2);
};

window.closePlannerDropdown = function() {
  const dropdown = document.getElementById('planner-dropdown');
  if (dropdown) {
    dropdown.classList.add('hidden');
  }
};





window.tabGoPremium = function() {
  haptic(10);

  // 1) Se premium e expirou, derruba premium e sai
  if (isPremium && premiumExpires && Date.now() > premiumExpires) {
    _handlePremiumExpiration();
    return;
  }

  // 2) Se já é premium válido: NÃO abre modal.
  //    Só marca a tab ativa (e o updateUI já cuida das cores do badge e do botão premium)
  if (isPremium) {
    setActiveTab(3);
    return;
  }

  // 3) Se não é premium: abre o modal (comportamento atual)
  openPremiumModal();
  setActiveTab(3);
};








function setActiveTab(index) {
  const tabs = document.querySelectorAll('.tab-item');
  tabs.forEach((tab, i) => {
    if (i === index) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
}




// ================================
// DROPDOWN PLANNER - FUNÇÕES
// ================================
window.openCalorieCalculator = function() {
  closePlannerDropdown();
  haptic(10);
  
  // ✅ Chama a função do botão calculadora
  const calcBtn = document.getElementById('calculator-btn');
  if (calcBtn) {
    calcBtn.click();
  }
};

window.openShoppingList = function() {
  closePlannerDropdown();
  haptic(10);
  
  // ✅ Chama a função do botão lista
  const shoppingBtn = document.getElementById('shopping-btn');
  if (shoppingBtn) {
    shoppingBtn.click();
  }
};

window.openWeekPlanner = function() {
  closePlannerDropdown();
  haptic(10);
  
  // ✅ Chama a função do botão planner
  const plannerBtn = document.getElementById('planner-btn');
  if (plannerBtn) {
    plannerBtn.click();
  }
};



window.openCalorieCalculator = function() {
  haptic(10);
  
  const calcBtn = document.getElementById('calculator-btn');
  if (calcBtn) {
    calcBtn.click();
    // ✅ Fecha dropdown DEPOIS
    setTimeout(() => closePlannerDropdown(), 100);
  }
};

window.openShoppingList = function() {
  haptic(10);
  
  const shoppingBtn = document.getElementById('shopping-btn');
  if (shoppingBtn) {
    shoppingBtn.click();
    // ✅ Fecha dropdown DEPOIS
    setTimeout(() => closePlannerDropdown(), 100);
  }
};

window.openWeekPlanner = function() {
  haptic(10);
  
  const plannerBtn = document.getElementById('planner-btn');
  if (plannerBtn) {
    plannerBtn.click();
    // ✅ Fecha dropdown DEPOIS
    setTimeout(() => closePlannerDropdown(), 100);
  }
};

// ================================
// MENU HAMBÚRGUER - FUNÇÕES
// ================================
window.openHamburgerMenu = function() {
  haptic(10);
  const menu = document.getElementById('hamburger-menu');
  if (menu) {
    menu.classList.remove('hidden');
    document.body.classList.add('modal-open');
    
    // Renderiza ícones Lucide
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
};

window.closeHamburgerMenu = function() {
  const menu = document.getElementById('hamburger-menu');
  if (menu) {
    menu.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
};

// ================================
// RODAPÉ - FUNÇÕES
// ================================
window.openFAQModal = function() {
  haptic(10);
  const faqModal = document.getElementById('faq-modal');
  if (faqModal) {
    faqModal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }
};

window.openPremiumModal = function() {
  haptic(10);

  const premiumModal = document.getElementById('premium-modal');
  if (!premiumModal) return;

  premiumModal.classList.remove('hidden');
  document.body.classList.add('modal-open');

  // 🎯 Foco automático no input do código
  setTimeout(() => {
    const input = document.getElementById('premium-code-input');
    if (input) {
      input.focus();
      input.select();
    }
  }, 150);
};





// ==============================
// START
// ==============================
loadUserData();



// ================================
// RENDERIZA ÍCONES LUCIDE AO CARREGAR
// ================================
window.addEventListener('DOMContentLoaded', function() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
    console.log('Ícones Lucide renderizados');
  }
});

// Renderiza novamente após 500ms (garantia)
setTimeout(() => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}, 500);




// ================================
// BOTÃO VOLTAR AO TOPO
// ================================
window.scrollToTop = function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

window.addEventListener('scroll', () => {
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (backToTopBtn) {
    const scrollY = window.scrollY;
    
    // Aparece depois de 500px, some quando volta pra menos de 200px
    if (scrollY > 1000) {
      backToTopBtn.classList.remove('hidden');
    } else if (scrollY < 1000) {
      backToTopBtn.classList.add('hidden');
    }
  }
});


document.addEventListener('click', (e) => {
  const tabItem = e.target.closest('.tab-item');
  if (tabItem) closePlannerDropdown();
}, true);













// ================================
// AUTO-ABRIR FERRAMENTAS VIA URL
// ================================
window.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const tool = urlParams.get('tool');
  
  if (tool) {
    setTimeout(() => {
      switch(tool) {
        case 'calculator':
          const calcBtn = document.getElementById('calculator-btn');
          if (calcBtn) calcBtn.click();
          break;
        case 'shopping':
          const shopBtn = document.getElementById('shopping-btn');
          if (shopBtn) shopBtn.click();
          break;
        case 'planner':
          const planBtn = document.getElementById('planner-btn');
          if (planBtn) planBtn.click();
          break;
        case 'faq':
          const faqBtn = document.getElementById('faq-btn');
          if (faqBtn) faqBtn.click();
          break;
        case 'premium':
          const premBtn = document.getElementById('premium-btn');
          if (premBtn) premBtn.click();
          break;
      }
      
      // Limpa URL depois de abrir
      window.history.replaceState({}, document.title, window.location.pathname);
    }, 500);
  }
});
