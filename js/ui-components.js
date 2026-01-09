/* ============================================
   ui-components.js — Tab bar + Premium (centralizado)
   - Tab bar: Início | Busca | Planner | Premium
   - Planner abre/fecha dropdown existente (.planner-dropdown)
   - Busca foca o input da busca
   - Premium chama openPremium('tab')
   - Suporte a hash: #rf-search / #rf-planner (quando vem de outra página)
   ============================================ */

(function() {
    'use strict';

    // --------- HELPERS ---------
    function $(sel, root = document) {
        return root.querySelector(sel);
    }

    function findSearchInput() {
        return (
            document.getElementById('search-input') ||
            document.querySelector('.search-input') ||
            document.querySelector('input[type="search"]')
        );
    }

    function focusSearch() {
        const input = findSearchInput();
        if (!input) return;

        try {
            input.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        } catch (_) {}

        input.focus();
    }




// --------- PLANNER DROPDOWN (estável) ---------
function getPlannerDropdown() {
  let dd = document.querySelector('.planner-dropdown');

  // se não existe, cria
  if (!dd) {
    dd = document.createElement('div');
    dd.className = 'planner-dropdown hidden';
    dd.id = 'planner-dropdown';

    dd.innerHTML = `
      <div class="planner-dropdown-overlay" onclick="window.closePlannerDropdown && window.closePlannerDropdown()"></div>

      <div class="planner-dropdown-content">
        <button class="planner-dropdown-item tap" type="button" onclick="window.openCalorieCalculator && window.openCalorieCalculator()">
          <i data-lucide="calculator" class="planner-dropdown-icon"></i>
          <span>Calculadora de Calorias</span>
        </button>

        <button class="planner-dropdown-item tap" type="button" onclick="window.openShoppingList && window.openShoppingList()">
          <i data-lucide="shopping-cart" class="planner-dropdown-icon"></i>
          <span>Lista de Compras</span>
        </button>

        <button class="planner-dropdown-item tap" type="button" onclick="window.openWeekPlanner && window.openWeekPlanner()">
          <i data-lucide="calendar-days" class="planner-dropdown-icon"></i>
          <span>Planejador Semanal</span>
        </button>
      </div>
    `;

    document.body.appendChild(dd);

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  return dd;
}

// ✅ precisa ser função "nomeada" (não só window.xxx = function)
// pra nunca existir re-assign errado depois.
function openPlannerDropdown() {
  const dd = getPlannerDropdown();
  if (!dd) return;
  dd.classList.remove('hidden');
}

function closePlannerDropdown() {
  const dd = getPlannerDropdown();
  if (!dd) return;
  dd.classList.add('hidden');
}

function togglePlannerDropdown() {
  const dd = getPlannerDropdown();
  if (!dd) return;
  dd.classList.toggle('hidden');
}

// ✅ expõe certinho no window (SEM reatribuir pra algo inexistente)
window.openPlannerDropdown = openPlannerDropdown;
window.closePlannerDropdown = closePlannerDropdown;
window.togglePlannerDropdown = togglePlannerDropdown;






    // --------- PREMIUM OPEN (centralizado) ---------
    // OBS: você já tem a openPremiumModal() e ela está ok.
    // Aqui a gente cria um wrapper único (com "source") e chama ela.
    window.openPremium = function(source) {
        // marca de onde abriu (header/tab/hamburger etc.) — útil pro seu controle de badges
        try {
            window.__premium_open_source = source || 'unknown';
        } catch (_) {}

        if (typeof window.openPremiumModal === 'function') {
            window.openPremiumModal();
            return;
        }

        // fallback: abre pelo id direto
        const premiumModal = document.getElementById('premium-modal');
        if (premiumModal) {
            premiumModal.classList.remove('hidden');
            document.body.classList.add('modal-open');
        }
    };

 // --------- TAB BAR RENDER (ATIVO VERDE) ---------
function renderTabbar(root) {
  if (!root) return;
  if (root.dataset.mounted === '1') return;
  root.dataset.mounted = '1';

  root.innerHTML = `
    <div class="tab-bar" id="rf-tabbar">
      <button class="tab-item" type="button" aria-label="Início" data-tab="home">
        <i data-lucide="home" class="tab-icon"></i>
        <span class="tab-label">Início</span>
      </button>

      <button class="tab-item" type="button" aria-label="Busca" data-tab="search">
        <i data-lucide="search" class="tab-icon"></i>
        <span class="tab-label">Busca</span>
      </button>

      <button class="tab-item" type="button" aria-label="Planner" data-tab="planner">
        <i data-lucide="calendar" class="tab-icon"></i>
        <span class="tab-label">Planner</span>
      </button>

      <button class="tab-item tab-premium" type="button" aria-label="Premium" data-tab="premium" data-open-premium="tab">
        <i data-lucide="star" class="tab-icon"></i>
        <span class="tab-label">Premium</span>
      </button>
    </div>
  `;

  // === helpers de ativo ===
  function setActive(tabName) {
    const items = root.querySelectorAll('.tab-item');
    items.forEach((b) => b.classList.remove('active'));

    const btn = root.querySelector(`.tab-item[data-tab="${tabName}"]`);
    if (btn) btn.classList.add('active');

    // guarda para manter ao trocar de página
    try { sessionStorage.setItem('rf_active_tab', tabName); } catch (_) {}
  }

  function applyActiveFromStorage() {
    let saved = 'home';
    try { saved = sessionStorage.getItem('rf_active_tab') || 'home'; } catch (_) {}
    setActive(saved);
  }

  // aplica ao montar
  applyActiveFromStorage();

  // Clique (robusto: pega clique no <button>, <i> ou <span>)
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn || !root.contains(btn)) return;

    const tab = btn.dataset.tab;

    // marca o ativo primeiro (pra feedback imediato)
    if (tab) setActive(tab);

    // 1) Início
    if (tab === 'home') {
      window.location.href = 'index.html';
      return;
    }

    // 2) Busca
    if (tab === 'search') {
      if (!/index\.html/i.test(location.pathname)) {
        window.location.href = 'index.html#rf-search';
        return;
      }
      focusSearch();
      return;
    }

   // 3) Planner (toggle abre/fecha)
if (tab === 'planner') {
  if (!/index\.html/i.test(location.pathname) && location.pathname !== '/') {
    window.location.href = 'index.html#rf-planner';
    return;
  }
  // Chama a função global
  if (typeof window.togglePlannerDropdown === 'function') {
    window.togglePlannerDropdown();
  }
  return;
}

    // 4) Premium (sem premium ativo: deve ficar verde ao clicar)
    if (tab === 'premium') {
      if (typeof window.openPremium === 'function') {
        window.openPremium('tab');
      } else if (typeof window.openPremiumModal === 'function') {
        window.openPremiumModal('tab');
      }
      return;
    }
  });
  
// ✅ Atualiza estado do botão premium após renderizar
  if (typeof window.updatePremiumButtons === 'function') {
    setTimeout(() => window.updatePremiumButtons(), 100);
  }

}

    // --------- HAMBURGER MENU RENDER ---------
    function renderHamburger(root) {
        if (!root) return;
        if (root.dataset.mounted === '1') return;
        root.dataset.mounted = '1';

        root.innerHTML = `
      <!-- MENU HAMBÚRGUER (mesma estrutura do index.html) -->
    <div id="hamburger-menu" class="hamburger-menu hidden">
      <div class="hamburger-overlay" onclick="closeHamburgerMenu()"></div>
      <div class="hamburger-content">
        <div class="hamburger-header">
          <div class="hamburger-logo">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                           <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
                           <line x1="6" y1="17" x2="18" y2="17"/>
                        </svg>
                  <span>Receitafit<span style="color: #16a34a;">.App</span></span>
               </div>
          <button class="hamburger-close tap" onclick="closeHamburgerMenu()" aria-label="Fechar menu">
            <i data-lucide="x"></i>
          </button>
        </div>
        
				
			<nav class="hamburger-nav">
  <div class="hamburger-section">
    <div class="hamburger-section-title">
      <i data-lucide="calendar-days"></i>
      <span>Planner</span>
    </div>
    <a href="index.html?tool=calculator" class="hamburger-link hamburger-sublink tap">
      <i data-lucide="calculator"></i>
      <span>Calculadora de Calorias</span>
    </a>
    <a href="index.html?tool=shopping" class="hamburger-link hamburger-sublink tap">
      <i data-lucide="shopping-cart"></i>
      <span>Lista de Compras</span>
    </a>
    <a href="index.html?tool=planner" class="hamburger-link hamburger-sublink tap">
      <i data-lucide="calendar-check"></i>
      <span>Planejador Semanal</span>
    </a>
  </div>
  
  <div class="hamburger-divider"></div>
  
  <a href="quem-somos.html" class="hamburger-link tap">
    <i data-lucide="users"></i>
    <span>Quem Somos</span>
  </a>
  
  
  
  <a href="index.html?tool=faq" class="hamburger-link tap">
    <i data-lucide="help-circle"></i>
    <span>Ajuda</span>
  </a>
  
  
  
  <a href="https://instagram.com/receitafit.app" target="_blank" rel="noopener noreferrer" class="hamburger-link tap">
    <i data-lucide="instagram"></i>
    <span>Instagram</span>
  </a>
  
  <div class="hamburger-divider"></div>
			
			
			
			
			
			
			

            <button class="hamburger-premium-btn tap" id="hamburger-premium-btn" onclick="openPremiumModal('hamburger'); closeHamburgerMenu();">
              <i data-lucide="star"></i>
              <span id="hamburger-premium-text">Seja Premium</span>
            </button>
          </div>



          
        </nav>
      </div>
    </div>
  `;

        // Recria os ícones lucide (se estiver usando)
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
		
		// ✅ Atualiza estado do botão premium após renderizar
        if (typeof window.updatePremiumButtons === 'function') {
            setTimeout(() => window.updatePremiumButtons(), 100);
        }
    }




    // --------- MOUNT ---------
    function mount() {
        // 1) Render da TAB BAR (root oficial)
        const tabRoot = document.getElementById('rf-tabbar-root');
        if (tabRoot) {
            renderTabbar(tabRoot);
        }

        // 2) Render do MENU HAMBÚRGUER (root oficial)
        const hamRoot = document.getElementById('rf-hamburger-root');
        if (hamRoot) {
            renderHamburger(hamRoot);
        }

        // 3) Hash actions (quando veio de outra página)
        const hash = (location.hash || '').toLowerCase();

        if (hash === '#rf-search') {
            focusSearch();
        }

        if (hash === '#rf-planner') {
            openPlannerDropdown();
        }

        // 4) Re-render dos ícones (lucide)
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    document.addEventListener('DOMContentLoaded', mount);
    document.addEventListener('DOMContentLoaded', mount);

})();
