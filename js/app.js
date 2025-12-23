// ============================================
// ARQUIVO: js/app.js  (ETAPA 1 — ESTABILIZAÇÃO)
// - Modais funcionando (Premium/Calc/Lista/Planner/FAQ)
// - Premium com feedback e UI atualizada
// - Categorias renderizando e filtrando
// - Slider Hero funcionando
// - Detalhe da receita com layout correto
// ============================================

(() => {
  "use strict";

  // -----------------------------
  // Estado
  // -----------------------------
  let credits = 3;
  let unlockedRecipes = []; // [id, id, ...]
  let isPremium = false;

  let searchQuery = "";
  let categoryFilter = ""; // "" = todas

  let shoppingList = [];
  let weekPlan = {}; // { "Segunda-Almoço": recipeObj, ... }

  // Slider
  let featuredRecipes = [];
  let currentSlideIndex = 0;
  let sliderAutoplayTimer = null;

  // -----------------------------
  // Storage (localStorage simples)
  // -----------------------------
  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        // ignore
      }
    },
  };

  // -----------------------------
  // DOM helpers
  // -----------------------------
  const $ = (id) => document.getElementById(id);

  // Header / UI
  const creditsText = $("credits-text");
  const creditsBadge = $("credits-badge");
  const premiumBtn = $("premium-btn");

  // Grid / Detail
  const recipeGrid = $("recipe-grid");
  const recipeDetail = $("recipe-detail");

  // Search
  const searchInput = $("search-input");

  // Premium modal
  const premiumModal = $("premium-modal");
  const modalMessage = $("modal-message");
  const premiumCodeInput = $("premium-code-input");
  const modalCancel = $("modal-cancel");
  const modalActivate = $("modal-activate");
  const creditsWarning = $("credits-warning");

  // Tools buttons
  const calculatorBtn = $("calculator-btn");
  const shoppingBtn = $("shopping-btn");
  const plannerBtn = $("planner-btn");
  const shoppingCounter = $("shopping-counter");

  // Tools modals
  const calculatorModal = $("calculator-modal");
  const shoppingModal = $("shopping-modal");
  const plannerModal = $("planner-modal");

  // FAQ
  const faqBtn = $("faq-btn");
  const faqModal = $("faq-modal");
  const faqContent = $("faq-content");

  // Slider + categories
  const heroSlider = $("heroSlider");
  const sliderTrack = $("sliderTrack");
  const sliderDots = $("sliderDots");
  const categoriesGrid = $("categoriesGrid");

  // -----------------------------
  // Util
  // -----------------------------
  function lockBodyScroll(locked) {
    document.body.classList.toggle("modal-open", !!locked);
  }

  function openModal(el) {
    if (!el) return;
    el.classList.remove("hidden");
    lockBodyScroll(true);
  }

  function closeModal(el) {
    if (!el) return;
    el.classList.add("hidden");
    // só libera scroll se não tiver outro modal aberto
    const anyOpen = document.querySelectorAll(".modal:not(.hidden)").length > 0;
    lockBodyScroll(anyOpen);
  }

  function isRecipeUnlocked(recipeId) {
    return isPremium || unlockedRecipes.includes(recipeId);
  }

  function safeJsonParse(str, fallback) {
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  }

  // -----------------------------
  // Load / Save
  // -----------------------------
  function loadUserData() {
    const premiumStr = storage.get("fit_premium");
    isPremium = premiumStr === "true";

    const creditsStr = storage.get("fit_credits");
    if (creditsStr && !Number.isNaN(parseInt(creditsStr, 10))) {
      credits = parseInt(creditsStr, 10);
    }

    const unlockedStr = storage.get("fit_unlocked");
    if (unlockedStr) {
      unlockedRecipes = safeJsonParse(unlockedStr, []);
      if (!Array.isArray(unlockedRecipes)) unlockedRecipes = [];
    }

    const shoppingStr = storage.get("fit_shopping");
    if (shoppingStr) {
      shoppingList = safeJsonParse(shoppingStr, []);
      if (!Array.isArray(shoppingList)) shoppingList = [];
    }

    const weekPlanStr = storage.get("fit_weekplan");
    if (weekPlanStr) {
      weekPlan = safeJsonParse(weekPlanStr, {});
      if (!weekPlan || typeof weekPlan !== "object") weekPlan = {};
    }

    // Defaults
    if (typeof credits !== "number" || credits < 0) credits = 3;
  }

  function saveUserData() {
    storage.set("fit_premium", String(isPremium));
    storage.set("fit_credits", String(credits));
    storage.set("fit_unlocked", JSON.stringify(unlockedRecipes));
  }

  function saveShoppingList() {
    storage.set("fit_shopping", JSON.stringify(shoppingList));
    updateShoppingCounter();
  }

  function saveWeekPlan() {
    storage.set("fit_weekplan", JSON.stringify(weekPlan));
  }

  // -----------------------------
  // UI
  // -----------------------------
  function updateUI() {
    if (!creditsBadge || !creditsText || !premiumBtn) return;

    if (isPremium) {
      creditsBadge.classList.add("premium");
      creditsBadge.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span>PREMIUM</span>
      `;
      premiumBtn.style.display = "none";
    } else {
      creditsBadge.classList.remove("premium");
      // restaura conteúdo padrão
      creditsBadge.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <span id="credits-text">${credits} créditos</span>
      `;
      // re-pegar referência do span (porque recriamos HTML acima)
      const newCreditsText = $("credits-text");
      if (newCreditsText) newCreditsText.textContent = `${credits} créditos`;

      premiumBtn.style.display = "inline-flex";
    }
  }

  function updateShoppingCounter() {
    if (!shoppingCounter) return;
    if (shoppingList.length > 0) {
      shoppingCounter.textContent = String(shoppingList.length);
      shoppingCounter.classList.remove("hidden");
    } else {
      shoppingCounter.classList.add("hidden");
    }
  }

  function showPremiumGate(message) {
    if (modalMessage) modalMessage.textContent = message || "Ative o Premium para continuar.";
    if (creditsWarning) {
      // só mostra warning se créditos acabaram
      creditsWarning.style.display = !isPremium && credits <= 0 ? "block" : "none";
    }
    openModal(premiumModal);
  }

  // -----------------------------
  // Slider Hero
  // -----------------------------
  function renderSlider() {
    if (!sliderTrack || !sliderDots || typeof RECIPES === "undefined") return;

    featuredRecipes = (RECIPES || []).filter((r) => r && r.featured).slice(0, 6);
    if (featuredRecipes.length === 0) {
      // sem featured -> esconder slider
      if (heroSlider) heroSlider.classList.add("hidden");
      return;
    }

    if (heroSlider) heroSlider.classList.remove("hidden");

    sliderTrack.innerHTML = featuredRecipes
      .map((recipe) => {
        const img = recipe.image || "";
        const title = recipe.name || "Receita";
        const desc = (recipe.ingredients && recipe.ingredients[0]) ? recipe.ingredients[0] : "Receita deliciosa e saudável";
        return `
          <div class="slide-new" role="button" tabindex="0" aria-label="${title}">
            <img src="${img}" alt="${title}" onerror="this.src='https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600&q=80'">
            <div class="slide-overlay-new">
              <h2 class="slide-title-new">${title}</h2>
              <p class="slide-description-new">${desc}</p>
            </div>
          </div>
        `;
      })
      .join("");

    sliderDots.innerHTML = featuredRecipes
      .map((_, idx) => `<button class="slider-dot-new ${idx === 0 ? "active" : ""}" onclick="goToSlideNew(${idx})"></button>`)
      .join("");

    currentSlideIndex = 0;
    updateSliderPosition();
    startSliderAutoplay();

    // clique no slide abre a receita
    sliderTrack.querySelectorAll(".slide-new").forEach((slideEl, idx) => {
      slideEl.addEventListener("click", () => {
        const r = featuredRecipes[idx];
        if (r && typeof r.id !== "undefined") viewRecipe(r.id);
      });
      slideEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const r = featuredRecipes[idx];
          if (r && typeof r.id !== "undefined") viewRecipe(r.id);
        }
      });
    });
  }

  function updateSliderPosition() {
    if (!sliderTrack) return;
    sliderTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

    document.querySelectorAll(".slider-dot-new").forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentSlideIndex);
    });
  }

  function startSliderAutoplay() {
    stopSliderAutoplay();
    if (featuredRecipes.length <= 1) return;
    sliderAutoplayTimer = setInterval(() => {
      changeSlideNew(1);
    }, 8000);
  }

  function stopSliderAutoplay() {
    if (sliderAutoplayTimer) clearInterval(sliderAutoplayTimer);
    sliderAutoplayTimer = null;
  }

  // Precisam ser globais por causa do onclick no HTML
  window.changeSlideNew = function (direction) {
    if (!featuredRecipes || featuredRecipes.length === 0) return;
    currentSlideIndex = (currentSlideIndex + direction + featuredRecipes.length) % featuredRecipes.length;
    updateSliderPosition();
    startSliderAutoplay();
  };

  window.goToSlideNew = function (index) {
    if (!featuredRecipes || featuredRecipes.length === 0) return;
    if (index < 0 || index >= featuredRecipes.length) return;
    currentSlideIndex = index;
    updateSliderPosition();
    startSliderAutoplay();
  };

  // -----------------------------
  // Categorias
  // -----------------------------
  function getCategoriesFromRecipes() {
    const set = new Set();
    (RECIPES || []).forEach((r) => {
      if (r && r.category) set.add(r.category);
    });

    // ordem amigável
    const preferred = ["Café da Manhã", "Almoço", "Jantar", "Lanches", "Sobremesas", "Veganas"];
    const existingPreferred = preferred.filter((c) => set.has(c));
    const others = [...set].filter((c) => !preferred.includes(c)).sort((a, b) => a.localeCompare(b, "pt-BR"));

    return ["", ...existingPreferred, ...others]; // "" = Todas
  }

  function renderCategories() {
    if (!categoriesGrid || typeof RECIPES === "undefined") return;

    const cats = getCategoriesFromRecipes();

    categoriesGrid.innerHTML = cats
      .map((cat, idx) => {
        const label = cat === "" ? "Todas" : cat;
        const active = (cat === categoryFilter) || (cat === "" && categoryFilter === "");
        return `
          <div class="category-card-new ${active ? "active" : ""}" data-cat="${cat}">
            ${label}
          </div>
        `;
      })
      .join("");

    categoriesGrid.querySelectorAll(".category-card-new").forEach((el) => {
      el.addEventListener("click", () => {
        const cat = el.getAttribute("data-cat") || "";
        categoryFilter = cat;

        // marcar ativo
        categoriesGrid.querySelectorAll(".category-card-new").forEach((c) => c.classList.remove("active"));
        el.classList.add("active");

        renderRecipes();
      });
    });

    // drag horizontal (mobile)
    initCategoriesDrag();
  }

  function initCategoriesDrag() {
    const grid = document.querySelector(".categories-grid-new");
    if (!grid) return;

    grid.style.cursor = "grab";
    grid.ondragstart = () => false;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    grid.addEventListener("mousedown", (e) => {
      isDown = true;
      grid.style.cursor = "grabbing";
      startX = e.pageX - grid.offsetLeft;
      scrollLeft = grid.scrollLeft;
    });

    grid.addEventListener("mouseleave", () => {
      isDown = false;
      grid.style.cursor = "grab";
    });

    grid.addEventListener("mouseup", () => {
      isDown = false;
      grid.style.cursor = "grab";
    });

    grid.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - grid.offsetLeft;
      const walk = x - startX;
      grid.scrollLeft = scrollLeft - walk;
    });

    // touch
    let touchStartX = 0;
    let touchScrollLeft = 0;

    grid.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = grid.scrollLeft;
    });

    grid.addEventListener("touchmove", (e) => {
      const x = e.touches[0].pageX;
      const walk = (touchStartX - x) * 1.2;
      grid.scrollLeft = touchScrollLeft + walk;
    });
  }

  // -----------------------------
  // Receitas (Grid)
  // -----------------------------
  function filterRecipes() {
    let list = [...(RECIPES || [])];

    if (categoryFilter) {
      list = list.filter((r) => r && r.category === categoryFilter);
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((r) => {
        const name = (r.name || "").toLowerCase();
        const cat = (r.category || "").toLowerCase();
        return name.includes(q) || cat.includes(q);
      });
    }

    return list;
  }

  function renderRecipes() {
    if (!recipeGrid) return;

    const filtered = filterRecipes();

    recipeGrid.innerHTML = filtered
      .map((recipe) => {
        const unlocked = isRecipeUnlocked(recipe.id);
        const needsCredits = !unlocked;
        const canUnlock = credits > 0;

        return `
          <div class="recipe-card" data-id="${recipe.id}">
            <div class="recipe-image-container">
              <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image"
                   onerror="this.src='https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80'">
              <div class="recipe-category">${recipe.category || ""}</div>
              ${needsCredits && !canUnlock ? `
                <div class="recipe-overlay" aria-label="Bloqueado">
                  <svg class="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
              ` : ""}
            </div>
            <div class="recipe-content">
              <h3 class="recipe-title">${recipe.name}</h3>

              <div class="recipe-meta">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>${recipe.time ?? "-"}min</span>

                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                </svg>
                <span>${recipe.servings ?? "-"}</span>

                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                <span>${recipe.difficulty ?? "-"}</span>
              </div>

              <div class="recipe-stats">
                <div class="stat">
                  <div class="stat-value calories">${recipe.calories ?? "-"}</div>
                  <div class="stat-label">calorias</div>
                </div>
                <div class="stat">
                  <div class="stat-value protein">${recipe.protein ?? "-"}g</div>
                  <div class="stat-label">proteína</div>
                </div>
              </div>

              <button class="recipe-button ${unlocked ? "unlocked" : "locked"}" type="button">
                ${unlocked ? "Ver Receita" : "Desbloquear (1 crédito)"}
              </button>
            </div>
          </div>
        `;
      })
      .join("");

    // Click handlers
    recipeGrid.querySelectorAll(".recipe-card").forEach((card) => {
      const id = parseInt(card.getAttribute("data-id"), 10);
      card.addEventListener("click", () => viewRecipe(id));
    });
  }

  function viewRecipe(recipeId) {
    const recipe = (RECIPES || []).find((r) => r && r.id === recipeId);
    if (!recipe) return;

    const unlocked = isRecipeUnlocked(recipeId);

    if (!unlocked) {
      if (credits > 0) {
        credits -= 1;
        unlockedRecipes.push(recipeId);
        saveUserData();
        updateUI();
      } else {
        showPremiumGate("Seus créditos acabaram! Ative o Premium para acesso ilimitado.");
        return;
      }
    }

    showRecipeDetail(recipe);
  }

  function showRecipeDetail(recipe) {
    // esconder slider/categorias
    if (heroSlider) heroSlider.classList.add("hidden");
    const categoriesWrap = document.querySelector(".categories-new");
    if (categoriesWrap) categoriesWrap.style.display = "none";

    recipeGrid.classList.add("hidden");
    recipeDetail.classList.remove("hidden");

    recipeDetail.innerHTML = `
      <button class="back-button" type="button" id="back-to-grid">← Voltar</button>

      <img src="${recipe.image}" alt="${recipe.name}" class="detail-image"
           onerror="this.src='https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600&q=80'">

      <div class="detail-content">

        <div class="detail-header">
          <h2 class="detail-title">${recipe.name}</h2>
          <button class="btn-add-list" type="button" id="btn-add-shopping">
            <svg style="width:20px;height:20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Adicionar à Lista
          </button>
        </div>

        <div class="detail-stats">
          <div class="detail-stat">
            <div class="detail-stat-value">${recipe.calories ?? "-"}</div>
            <div class="detail-stat-label">calorias</div>
          </div>
          <div class="detail-stat">
            <div class="detail-stat-value">${recipe.protein ?? "-"}g</div>
            <div class="detail-stat-label">proteína</div>
          </div>
          <div class="detail-stat">
            <div class="detail-stat-value">${recipe.time ?? "-"}min</div>
            <div class="detail-stat-label">tempo</div>
          </div>
          <div class="detail-stat">
            <div class="detail-stat-value">${recipe.servings ?? "-"}</div>
            <div class="detail-stat-label">porções</div>
          </div>
        </div>

        <div class="detail-section">
          <h3 class="section-title">Adicionar ao Planejamento Semanal</h3>
          <div style="display:flex;flex-wrap:wrap;gap:.5rem">
            ${["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"].map(day => `
              <button class="btn-secondary" type="button" data-plan-day="${day}" style="padding:.5rem 1rem">
                ${day}
              </button>
            `).join("")}
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
            `).join("")}
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
            `).join("")}
          </ol>
        </div>

      </div>
    `;

    // handlers
    $("back-to-grid")?.addEventListener("click", closeRecipeDetail);

    $("btn-add-shopping")?.addEventListener("click", (e) => {
      e.stopPropagation();
      addToShoppingList(recipe);
    });

    recipeDetail.querySelectorAll("[data-plan-day]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const day = btn.getAttribute("data-plan-day");
        selectDayForPlanning(day, recipe);
      });
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeRecipeDetail() {
    recipeDetail.classList.add("hidden");
    recipeGrid.classList.remove("hidden");

    // re-mostrar slider/categorias
    if (heroSlider && featuredRecipes.length > 0) heroSlider.classList.remove("hidden");
    const categoriesWrap = document.querySelector(".categories-new");
    if (categoriesWrap) categoriesWrap.style.display = "block";

    renderRecipes();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  window.closeRecipeDetail = closeRecipeDetail; // compat

  // -----------------------------
  // Lista de Compras (Premium)
  // -----------------------------
  function addToShoppingList(recipe) {
    if (!isPremium) {
      showPremiumGate("A Lista de Compras é exclusiva para usuários Premium!");
      return;
    }
    const ings = recipe.ingredients || [];
    ings.forEach((ing) => {
      const norm = String(ing).trim().toLowerCase();
      const existing = shoppingList.find((it) => String(it.text).trim().toLowerCase() === norm);
      if (existing) {
        existing.checked = existing.checked || false;
      } else {
        shoppingList.push({
          id: Date.now() + Math.random(),
          text: ing,
          checked: false,
        });
      }
    });

    saveShoppingList();
    alert(`Ingredientes de "${recipe.name}" adicionados à lista! 🛒`);
  }

  function renderShoppingList() {
    const content = $("shopping-list-content");
    if (!content) return;

    if (shoppingList.length === 0) {
      content.innerHTML = `
        <div class="shopping-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <p style="font-size:1.125rem;margin-bottom:.5rem;">Sua lista está vazia!</p>
          <p style="font-size:.875rem;">Adicione ingredientes das receitas.</p>
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <div style="max-height:60vh;overflow-y:auto;">
        ${shoppingList
          .map(
            (item) => `
          <div class="shopping-item">
            <input type="checkbox" ${item.checked ? "checked" : ""} data-shop-check="${item.id}">
            <div class="shopping-item-content">
              <div class="shopping-item-text ${item.checked ? "checked" : ""}">${item.text}</div>
            </div>
            <button class="btn-delete" type="button" data-shop-del="${item.id}">
              <svg style="width:16px;height:16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        `
          )
          .join("")}
      </div>
      <button class="btn-clear-list" type="button" id="btn-clear-shopping">Limpar Toda a Lista</button>
    `;

    content.querySelectorAll("[data-shop-check]").forEach((inp) => {
      inp.addEventListener("change", () => {
        const id = inp.getAttribute("data-shop-check");
        shoppingList = shoppingList.map((it) =>
          String(it.id) === String(id) ? { ...it, checked: !it.checked } : it
        );
        saveShoppingList();
        renderShoppingList();
      });
    });

    content.querySelectorAll("[data-shop-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-shop-del");
        shoppingList = shoppingList.filter((it) => String(it.id) !== String(id));
        saveShoppingList();
        renderShoppingList();
      });
    });

    $("btn-clear-shopping")?.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja limpar toda a lista?")) {
        shoppingList = [];
        saveShoppingList();
        renderShoppingList();
      }
    });
  }

  // -----------------------------
  // Planejador (Premium) — versão simples estável
  // -----------------------------
  const MEALS = ["Café da Manhã", "Lanche da Manhã", "Almoço", "Lanche da Tarde", "Jantar"];
  const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  function selectDayForPlanning(day, recipe) {
    if (!isPremium) {
      showPremiumGate("O Planejador Semanal é exclusivo para usuários Premium!");
      return;
    }

    // modal simples via prompt (estável agora; refinamos depois)
    const meal = prompt(
      `Adicionar "${recipe.name}" em ${day}.\nDigite a refeição:\n- ${MEALS.join("\n- ")}`
    );
    if (!meal) return;

    const normalized = MEALS.find((m) => m.toLowerCase() === meal.trim().toLowerCase());
    if (!normalized) {
      alert("Refeição inválida. Tente novamente com um dos nomes sugeridos.");
      return;
    }

    const key = `${day}-${normalized}`;
    weekPlan[key] = recipe;
    saveWeekPlan();
    alert(`"${recipe.name}" adicionado ao ${day} - ${normalized}! 📅`);
  }

  function renderWeekPlanner() {
    const content = $("week-planner-content");
    if (!content) return;

    // calories totals
    const dailyCalories = {};
    DAYS.forEach((day) => {
      let total = 0;
      MEALS.forEach((meal) => {
        const r = weekPlan[`${day}-${meal}`];
        if (r && typeof r.calories === "number") total += r.calories;
      });
      dailyCalories[day] = total;
    });

    content.innerHTML = `
      <div class="week-planner-wrapper">
        <table class="week-table">
          <thead>
            <tr>
              <th>Refeição</th>
              ${DAYS.map((d) => `<th>${d}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${MEALS.map(
              (meal) => `
              <tr>
                <td style="background:#f9fafb;font-weight:600;">${meal}</td>
                ${DAYS.map((day) => {
                  const key = `${day}-${meal}`;
                  const planned = weekPlan[key];
                  return `
                    <td>
                      ${
                        planned
                          ? `
                        <div class="planned-meal">
                          <div class="planned-meal-name">${planned.name}</div>
                          <div class="planned-meal-cal">${planned.calories ?? "-"} cal</div>
                          <button class="btn-remove-meal" type="button" data-remove="${key}">Remover</button>
                        </div>
                      `
                          : `<div class="empty-slot">-</div>`
                      }
                    </td>
                  `;
                }).join("")}
              </tr>
            `
            ).join("")}
            <tr>
              <td style="background:#fffbeb;font-weight:700;">Total do Dia</td>
              ${DAYS.map(
                (day) => `
                <td style="background:#fffbeb;font-weight:700;color:#ea580c;font-size:1.125rem;">
                  ${dailyCalories[day]} cal
                </td>
              `
              ).join("")}
            </tr>
          </tbody>
        </table>
      </div>
    `;

    content.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-remove");
        delete weekPlan[key];
        saveWeekPlan();
        renderWeekPlanner();
      });
    });
  }

  // -----------------------------
  // Calculadora (Premium)
  // -----------------------------
  window.calculateCalories = function () {
    const weight = parseFloat($("calc-weight")?.value || "");
    const height = parseFloat($("calc-height")?.value || "");
    const age = parseFloat($("calc-age")?.value || "");
    const gender = $("calc-gender")?.value || "male";
    const activity = $("calc-activity")?.value || "sedentary";

    if (!weight || !height || !age) {
      alert("Preencha todos os campos!");
      return;
    }

    let bmr;
    if (gender === "male") {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const tdee = bmr * (activityMultipliers[activity] || 1.2);
    const deficit = tdee - 500;
    const surplus = tdee + 300;

    const results = $("calc-results");
    if (!results) return;

    results.classList.remove("hidden");
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
    `;
  };

  // -----------------------------
  // Premium (/api/redeem)
  // -----------------------------
  async function activatePremium() {
    const code = (premiumCodeInput?.value || "").trim().toUpperCase();
    if (!code) {
      alert("Digite um código.");
      return;
    }

    modalActivate.disabled = true;
    modalActivate.textContent = "Validando...";

    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data || !data.ok) {
        alert((data && data.error) ? data.error : "Código inválido. Tente novamente.");
        return;
      }

      isPremium = true;
      storage.set("fit_premium", "true");
      saveUserData();
      updateUI();

      closeModal(premiumModal);
      if (premiumCodeInput) premiumCodeInput.value = "";

      alert("Premium ativado com sucesso! 🎉");

      // re-render (agora ferramentas funcionam)
      updateShoppingCounter();
      renderRecipes();
    } catch (err) {
      alert("Erro ao validar o código. Tente novamente.");
    } finally {
      modalActivate.disabled = false;
      modalActivate.textContent = "Ativar Premium";
    }
  }

  // -----------------------------
  // FAQ (simples e estável)
  // -----------------------------
  const faqData = [
    {
      title: "💳 Créditos Gratuitos",
      items: [
        { q: "Como funcionam os 3 créditos?", a: "Use 1 crédito = 1 receita liberada permanentemente." },
        { q: "Perco acesso às receitas?", a: "NÃO! Receita desbloqueada fica sua para sempre." },
        { q: "Posso ganhar mais créditos?", a: "Os 3 são únicos. Para ilimitado, ative Premium." },
      ],
    },
    {
      title: "⭐ Premium",
      items: [
        { q: "O que ganho?", a: "Acesso ilimitado às receitas + ferramentas Premium." },
        { q: "Como ativar?", a: 'Clique "Ativar Premium" e digite o código.' },
        { q: "Posso cancelar?", a: "Sim! Sem fidelidade." },
      ],
    },
    {
      title: "🛠️ Ferramentas",
      items: [
        { q: "Calculadora de Calorias?", a: "Ícone azul → Preencha dados → Veja calorias ideais." },
        { q: "Lista de Compras?", a: "Na receita, clique “Adicionar à Lista” → marque ao comprar." },
        { q: "Planejador Semanal?", a: "Na receita, escolha o dia → informe a refeição." },
      ],
    },
  ];

  function renderFAQ() {
    if (!faqContent) return;

    faqContent.innerHTML =
      faqData
        .map(
          (section, idx) => `
        <div style="margin-bottom:1.5rem;">
          <button type="button" data-faq-toggle="${idx}"
            style="width:100%;padding:1rem;background:#f3f4f6;border:none;border-radius:.75rem;cursor:pointer;font-weight:600;font-size:1.125rem;text-align:left;display:flex;justify-content:space-between;align-items:center;">
            <span>${section.title}</span>
            <span data-faq-arrow="${idx}">▼</span>
          </button>
          <div data-faq-section="${idx}" style="display:block;padding:1rem;background:white;border-radius:0 0 .75rem .75rem;">
            ${section.items
              .map(
                (it) => `
              <div style="margin-bottom:1rem;">
                <strong style="color:#16a34a;">• ${it.q}</strong>
                <p style="margin:.25rem 0 0 1rem;color:#6b7280;font-size:.95rem;">${it.a}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
        )
        .join("");

    faqContent.querySelectorAll("[data-faq-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = btn.getAttribute("data-faq-toggle");
        const section = faqContent.querySelector(`[data-faq-section="${idx}"]`);
        const arrow = faqContent.querySelector(`[data-faq-arrow="${idx}"]`);
        if (!section || !arrow) return;

        const isHidden = section.style.display === "none";
        section.style.display = isHidden ? "block" : "none";
        arrow.textContent = isHidden ? "▼" : "▶";
      });
    });
  }

  function openFAQ() {
    renderFAQ();
    openModal(faqModal);
  }

  window.closeFAQ = function () {
    closeModal(faqModal);
  };

  // -----------------------------
  // Eventos
  // -----------------------------
  function bindEvents() {
    // Search
    searchInput?.addEventListener("input", (e) => {
      searchQuery = e.target.value || "";
      renderRecipes();
    });

    // Premium open
    premiumBtn?.addEventListener("click", () => {
      showPremiumGate("Tenha acesso ilimitado a todas as receitas!");
    });

    // Premium modal buttons
    modalCancel?.addEventListener("click", () => {
      closeModal(premiumModal);
      if (premiumCodeInput) premiumCodeInput.value = "";
    });

    modalActivate?.addEventListener("click", activatePremium);

    premiumCodeInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") activatePremium();
    });

    // Tools
    calculatorBtn?.addEventListener("click", () => {
      if (!isPremium) return showPremiumGate("A Calculadora de Calorias é exclusiva para usuários Premium!");
      openModal(calculatorModal);
    });

    shoppingBtn?.addEventListener("click", () => {
      if (!isPremium) return showPremiumGate("A Lista de Compras é exclusiva para usuários Premium!");
      renderShoppingList();
      openModal(shoppingModal);
    });

    plannerBtn?.addEventListener("click", () => {
      if (!isPremium) return showPremiumGate("O Planejador Semanal é exclusivo para usuários Premium!");
      renderWeekPlanner();
      openModal(plannerModal);
    });

    // FAQ
    faqBtn?.addEventListener("click", openFAQ);

    // Fechar modais clicando fora (apenas os que têm overlay)
    document.querySelectorAll(".modal").forEach((m) => {
      m.addEventListener("click", (e) => {
        // se clicou no próprio container modal (fora do conteúdo)
        if (e.target === m) closeModal(m);
      });
    });
  }

  // -----------------------------
  // Boot
  // -----------------------------
  function init() {
    if (typeof RECIPES === "undefined") {
      // data.js ainda não carregou
      setTimeout(init, 100);
      return;
    }

    loadUserData();
    updateUI();
    updateShoppingCounter();

    renderSlider();
    renderCategories();
    renderRecipes();

    bindEvents();
  }

  // expor close functions usados no HTML (onclick)
  window.closeCalculator = () => closeModal(calculatorModal);
  window.closeShoppingList = () => closeModal(shoppingModal);
  window.closeWeekPlanner = () => closeModal(plannerModal);

  document.addEventListener("DOMContentLoaded", init);
})();
