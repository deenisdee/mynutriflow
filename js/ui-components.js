/* ============================================
   ui-components.js — Tab bar + Menu Hambúrguer + Premium
   - Tab bar: Início | Busca | Planner | Premium
   - Menu hambúrguer completo
   - Botões premium ficam amarelos quando ativo
   - Sistema de hash: #rf-search / #rf-planner
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

    // --------- PLANNER DROPDOWN ---------
    function getPlannerDropdown() {
        let dd = document.querySelector('.planner-dropdown');

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

    // Expõe no window
    window.openPlannerDropdown = openPlannerDropdown;
    window.closePlannerDropdown = closePlannerDropdown;
    window.togglePlannerDropdown = togglePlannerDropdown;

    // --------- PREMIUM OPEN ---------
    window.openPremium = function(source) {
        try {
            window.__premium_open_source = source || 'unknown';
        } catch (_) {}

        if (typeof window.openPremiumModal === 'function') {
            window.openPremiumModal();
            return;
        }

        const premiumModal = document.getElementById('premium-modal');
        if (premiumModal) {
            premiumModal.classList.remove('hidden');
            document.body.classList.add('modal-open');
        }
    };
	
	
	
	
	
// --------- TAB BAR RENDER ---------
function renderTabbar(root) {
    if (!root) return;
    
    // Remove qualquer tab bar existente primeiro
    const existing = document.querySelectorAll('.tab-bar');
    existing.forEach(el => el.remove());
    
    if (root.dataset.mounted === '1') {
        root.dataset.mounted = '';
    }
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

            <button class="tab-item tab-premium" type="button" aria-label="Premium" data-tab="premium">
                <i data-lucide="star" class="tab-icon"></i>
                <span class="tab-label">Premium</span>
            </button>
        </div>
    `;

    // Sistema de active
    function setActive(tabName) {
        const items = root.querySelectorAll('.tab-item');
        items.forEach((b) => b.classList.remove('active'));

        const btn = root.querySelector(`.tab-item[data-tab="${tabName}"]`);
        if (btn) btn.classList.add('active');

        try { 
            sessionStorage.setItem('rf_active_tab', tabName); 
        } catch (_) {}
    }

    function applyActiveFromStorage() {
        let saved = 'home';
        try { 
            saved = sessionStorage.getItem('rf_active_tab') || 'home'; 
        } catch (_) {}
        setActive(saved);
    }

    applyActiveFromStorage();

    
}










    // --------- HAMBURGER MENU RENDER ---------
    function renderHamburger(root) {
        if (!root) return;
        if (root.dataset.mounted === '1') return;
        root.dataset.mounted = '1';

        root.innerHTML = `
            <div id="hamburger-menu" class="hamburger-menu hidden">
                <div class="hamburger-overlay" onclick="window.closeHamburgerMenu && window.closeHamburgerMenu()"></div>
                <div class="hamburger-content">
                    <div class="hamburger-header">
                        <div class="hamburger-logo">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
                                <line x1="6" y1="17" x2="18" y2="17"/>
                            </svg>
                            <span>Receita<span style="color: #16a34a;">fit</span><span style="opacity: 0.7;">.App</span></span>
                        </div>
                        <button class="hamburger-close tap" onclick="window.closeHamburgerMenu && window.closeHamburgerMenu()" aria-label="Fechar menu">
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
                        
						
						
						
                        <button class="hamburger-premium-btn tap" id="hamburger-premium-btn" onclick="if (!/index\.html/i.test(location.pathname) && location.pathname !== '/') { window.location.href = 'index.html?open=premium'; } else { window.openPremiumModal && window.openPremiumModal(); window.closeHamburgerMenu && window.closeHamburgerMenu(); }">
                            
							
							
							<i data-lucide="star"></i>
                            <span id="hamburger-premium-text">Seja Premium</span>
                        </button>
                    </nav>
                </div>
            </div>
        `;

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }

        // Atualiza premium após renderizar
        setTimeout(() => {
            if (typeof window.updatePremiumButtons === 'function') {
                window.updatePremiumButtons();
            }
        }, 200);
    }
	
	
	
	
	
	
	
	
	// --------- ANEXAÇÃO FORÇADA DE LISTENERS (sempre funciona) ---------
function attachTabbarListeners() {
    const buttons = document.querySelectorAll('.tab-item');
    if (buttons.length === 0) {
        console.warn('[TABBAR] Nenhum botão encontrado, tentando novamente...');
        setTimeout(attachTabbarListeners, 200);
        return;
    }
    
    console.log('[TABBAR] Anexando listeners em', buttons.length, 'botões');
    
    buttons.forEach((btn) => {
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('[TABBAR] Clique em:', this.dataset.tab);
            
            const tab = this.dataset.tab;
            
            // Remove active de todos
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            try { 
                sessionStorage.setItem('rf_active_tab', tab); 
            } catch (_) {}

            // 1) Início
            if (tab === 'home') {
                if (window.location.hash) {
                    window.location.href = 'index.html';
                } else if (window.location.pathname !== '/index.html' && !window.location.pathname.endsWith('index.html')) {
                    window.location.href = 'index.html';
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                return;
            }

            // 2) Busca
            if (tab === 'search') {
                if (!/index\.html/i.test(location.pathname) && location.pathname !== '/') {
                    window.location.href = 'index.html#rf-search';
                    return;
                }
                const input = document.getElementById('search-input') || document.querySelector('.search-input');
                if (input) {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    input.focus();
                }
                return;
            }





// 3) Planner
if (tab === 'planner') {
    const isIndex = /index\.html/i.test(location.pathname) || location.pathname === '/' || location.pathname === '';
    
    if (!isIndex) {
        window.location.href = 'index.html#rf-planner';
        return;
    }
    
    // DEBUG: mostra alert
    const dropdown = document.querySelector('.planner-dropdown');
    if (!dropdown) {
        alert('Dropdown não existe!');
        return;
    }
    
    alert('Abrindo dropdown... classe antes: ' + dropdown.className);
    
    dropdown.classList.remove('hidden');
    
    setTimeout(() => {
        alert('Classe depois: ' + dropdown.className);
    }, 500);
    
    return;
}






            // 4) Premium
            if (tab === 'premium') {
                if (!/index\.html/i.test(location.pathname) && location.pathname !== '/') {
                    window.location.href = 'index.html?open=premium';
                    return;
                }
                
                if (typeof window.openPremium === 'function') {
                    window.openPremium('tab');
                } else if (typeof window.openPremiumModal === 'function') {
                    window.openPremiumModal();
                }
                return;
            }
        };
    });
    
    console.log('[TABBAR] ✅ Listeners anexados com sucesso!');
}

// Expõe globalmente
window.attachTabbarListeners = attachTabbarListeners;
	
	
	
	
	
	

  // --------- MOUNT ---------
function mount() {
    const tabRoot = document.getElementById('rf-tabbar-root');
    if (tabRoot) {
        renderTabbar(tabRoot);
    }

    const hamRoot = document.getElementById('rf-hamburger-root');
    if (hamRoot) {
        renderHamburger(hamRoot);
    }

    const hash = (location.hash || '').toLowerCase();

    if (hash === '#rf-search') {
        const input = document.getElementById('search-input') || document.querySelector('.search-input');
        if (input) {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            input.focus();
        }
    }

    if (hash === '#rf-planner') {
        if (typeof window.openPlannerDropdown === 'function') {
            window.openPlannerDropdown();
        }
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
    
    // ✅ ANEXA LISTENERS DA TAB BAR (força depois de tudo carregar)
    setTimeout(() => {
        attachTabbarListeners();
        
        // Atualiza premium
        if (typeof window.updatePremiumButtons === 'function') {
            window.updatePremiumButtons();
        }
    }, 500);
}

document.addEventListener('DOMContentLoaded', mount);

})();
