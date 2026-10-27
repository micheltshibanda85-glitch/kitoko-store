(() => {
  "use strict";
  console.log("[Kitoko Store] script chargé");

  /* ============ CATÉGORIES & TAILLES ============ */
  const SIZES = {
    "Robes": ["S", "M", "L", "XL"],
    "Hauts": ["S", "M", "L", "XL"],
    "Accessoires": ["Unique"],
    "Chaussures": ["36", "37", "38", "39", "40", "41", "42"]
  };

  /* ============ PRODUITS ============ */
  const products = [
    { id: 1, name: "Robe Kinshasa", category: "Robes", price: 45000, emoji: "👗", bg: "linear-gradient(135deg,#C75B39,#A8482B)", tags: ["best"],
      desc: "Robe longue en wax, coupe fluide, ceinture à nouer. Confectionnée à la main dans notre atelier de la Gombe. Pièce unique par série." },
    { id: 2, name: "Robe Wax Élégance", category: "Robes", price: 55000, emoji: "👗", bg: "linear-gradient(135deg,#4A2E5C,#35203F)", tags: ["new"],
      desc: "Robe mi-longue, buste ajusté, jupe évasée. Wax de Cotonou, doublure coton. Idéale pour les cérémonies." },
    { id: 3, name: "Robe Soirée Gombe", category: "Robes", price: 75000, emoji: "👗", bg: "linear-gradient(135deg,#C9A227,#A68020)", tags: [],
      desc: "Robe de soirée en wax noble, broderie faite main, ceinture dorée. Édition limitée à 10 exemplaires." },
    { id: 4, name: "Robe Longue Ngaliema", category: "Robes", price: 62000, emoji: "👗", bg: "linear-gradient(135deg,#7A9E7E,#4F7050)", tags: [],
      desc: "Robe longue à manches bouffantes, imprimé floral wax, coupe empire. Très confortable." },

    { id: 5, name: "Haut Brodé Linge", category: "Hauts", price: 25000, emoji: "👚", bg: "linear-gradient(135deg,#C75B39,#7A2E15)", tags: ["new"],
      desc: "Haut en lin lavé, broderies géométriques, manches courtes. Parfait avec un pantalon ou une jupe." },
    { id: 6, name: "Top Wax Moderne", category: "Hauts", price: 22000, emoji: "👚", bg: "linear-gradient(135deg,#C9A227,#8B6508)", tags: [],
      desc: "Top court en wax, dos nu, coupe droite. À porter avec un jean ou un pantalon large." },
    { id: 7, name: "Chemise Wax Homme", category: "Hauts", price: 30000, emoji: "👕", bg: "linear-gradient(135deg,#4A2E5C,#2B1F33)", tags: ["best"],
      desc: "Chemise homme en wax, col classique, coupe droite. Unisexe dans la coupe." },
    { id: 8, name: "Blouse Brodée", category: "Hauts", price: 28000, emoji: "👚", bg: "linear-gradient(135deg,#C75B39,#A8482B)", tags: [],
      desc: "Blouse ample en coton, broderies au col et aux poignets. Idéale pour le bureau." },

    { id: 9, name: "Sac Cabas Wax", category: "Accessoires", price: 18000, emoji: "👜", bg: "linear-gradient(135deg,#4A2E5C,#35203F)", tags: ["best"],
      desc: "Grand cabas en wax doublé, poignées en cuir tanné à Kinshasa. Format ordinateur 15\"." },
    { id: 10, name: "Foulard Soie Wax", category: "Accessoires", price: 12000, emoji: "🧣", bg: "linear-gradient(135deg,#C9A227,#A68020)", tags: ["new"],
      desc: "Foulard carré en soie, motif wax revisité. Peut se porter au cou, dans les cheveux ou en ceinture." },
    { id: 11, name: "Bijoux Perles Dorées", category: "Accessoires", price: 15000, emoji: "📿", bg: "linear-gradient(135deg,#C75B39,#7A2E15)", tags: [],
      desc: "Parure collier + boucles d'oreilles en perles dorées et laiton. Fait main, pièce unique." },

    { id: 12, name: "Sandales Cuir", category: "Chaussures", price: 35000, emoji: "👡", bg: "linear-gradient(135deg,#7A9E7E,#4F7050)", tags: [],
      desc: "Sandales plates en cuir tanné, semelle cousue main. Confort toute la journée." },
    { id: 13, name: "Escarpins Wax", category: "Chaussures", price: 42000, emoji: "👠", bg: "linear-gradient(135deg,#C75B39,#A8482B)", tags: ["new"],
      desc: "Escarpins talon 7 cm, motif wax. Série limitée, fabrication locale." },
    { id: 14, name: "Baskets Toile", category: "Chaussures", price: 38000, emoji: "👟", bg: "linear-gradient(135deg,#4A2E5C,#35203F)", tags: ["best"],
      desc: "Baskets en toile teintée, semelle blanche. Confortables et stylées au quotidien." }
  ];

  /* ============ ÉTAT ============ */
  const state = {
    cart: [],           // [{ productId, size, qty }]
    wishlist: [],       // [productId]
    filters: {
      category: "all",
      size: "all",
      sort: "featured",
      search: ""
    }
  };

  const FREE_SHIPPING = 100000;
  const SHIPPING_FEE = 5000;
  const STORAGE_CART = "kitoko_cart";
  const STORAGE_WISH = "kitoko_wishlist";

  /* ============ HELPERS ============ */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = n => n.toLocaleString("fr-FR") + " CDF";

  /* ============ STORAGE ============ */
  function loadState() {
    try {
      const c = localStorage.getItem(STORAGE_CART);
      if (c) state.cart = JSON.parse(c);
    } catch (e) { state.cart = []; }
    try {
      const w = localStorage.getItem(STORAGE_WISH);
      if (w) state.wishlist = JSON.parse(w);
    } catch (e) { state.wishlist = []; }
  }
  function saveCart() {
    try { localStorage.setItem(STORAGE_CART, JSON.stringify(state.cart)); } catch (e) {}
  }
  function saveWishlist() {
    try { localStorage.setItem(STORAGE_WISH, JSON.stringify(state.wishlist)); } catch (e) {}
  }

  /* ============ UTILS ============ */
  const getProduct = id => products.find(p => p.id === id);
  const getSizes = product => SIZES[product.category] || ["Unique"];

  /* ============ BADGES ============ */
  function updateBadges() {
    const cartCount = state.cart.reduce((sum, i) => sum + i.qty, 0);
    const cartBadge = $("#cart-count");
    if (cartBadge) {
      cartBadge.textContent = cartCount;
      cartBadge.hidden = cartCount === 0;
    }
    const wishBadge = $("#wishlist-count");
    if (wishBadge) {
      wishBadge.textContent = state.wishlist.length;
      wishBadge.hidden = state.wishlist.length === 0;
    }
  }

  /* ============ RENDU PRODUITS ============ */
  function renderProducts() {
    const grid = $("#products-grid");
    const emptyState = $("#empty-state");
    const countEl = $("#results-count");
    if (!grid) return;

    let list = products.slice();

    // Filtre catégorie ou favoris
    if (state.filters.category === "wishlist") {
      list = list.filter(p => state.wishlist.includes(p.id));
    } else if (state.filters.category !== "all") {
      list = list.filter(p => p.category === state.filters.category);
    }

    // Filtre taille
    if (state.filters.size !== "all") {
      list = list.filter(p => getSizes(p).includes(state.filters.size));
    }

    // Recherche
    if (state.filters.search.trim()) {
      const q = state.filters.search.trim().toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
      );
    }

    // Tri
    switch (state.filters.sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "new": list.sort((a, b) => {
        const aNew = a.tags.includes("new") ? 1 : 0;
        const bNew = b.tags.includes("new") ? 1 : 0;
        return bNew - aNew;
      }); break;
      default: list.sort((a, b) => a.id - b.id);
    }

    // Rendu
    if (list.length === 0) {
      grid.innerHTML = "";
      if (emptyState) emptyState.hidden = false;
    } else {
      if (emptyState) emptyState.hidden = true;
      grid.innerHTML = list.map(p => {
        const isWished = state.wishlist.includes(p.id);
        let badgeHTML = "";
        if (p.tags.includes("new")) badgeHTML = '<span class="badge badge-new">Nouveau</span>';
        else if (p.tags.includes("best")) badgeHTML = '<span class="badge badge-best">Best-seller</span>';
        return `
          <article class="product-card">
            <div class="product-img" style="background:${p.bg}" data-open="${p.id}" role="button" tabindex="0" aria-label="Voir ${p.name}">
              ${badgeHTML}
              <span class="product-emoji" aria-hidden="true">${p.emoji}</span>
              <button class="wish-btn${isWished ? " is-active" : ""}" data-wish="${p.id}" aria-label="${isWished ? "Retirer des favoris" : "Ajouter aux favoris"}">${isWished ? "♥" : "♡"}</button>
            </div>
            <div class="product-body">
              <p class="product-cat">${p.category}</p>
              <h3 class="product-name">${p.name}</h3>
              <p class="product-price">${fmt(p.price)}</p>
              <button class="btn-add" data-open="${p.id}">Choisir la taille</button>
            </div>
          </article>`;
      }).join("");
    }

    if (countEl) {
      countEl.textContent = list.length === 0
        ? "Aucun résultat"
        : `${list.length} produit${list.length > 1 ? "s" : ""} affiché${list.length > 1 ? "s" : ""}`;
    }
  }

  /* ============ RENDU PANIER ============ */
  function renderCart() {
    const itemsEl = $("#cart-items");
    const footEl = $("#cart-footer");
    if (!itemsEl || !footEl) return;

    if (state.cart.length === 0) {
      itemsEl.innerHTML = `
        <div class="cart-empty">
          <p class="cart-empty-emoji" aria-hidden="true">🛍️</p>
          <p>Votre panier est vide.</p>
          <button class="btn btn-primary" data-close-cart data-go-shop>Découvrir la boutique</button>
        </div>`;
      footEl.hidden = true;
      return;
    }

    footEl.hidden = false;

    let subtotal = 0;
    itemsEl.innerHTML = state.cart.map(item => {
      const p = getProduct(item.productId);
      if (!p) return "";
      const lineTotal = p.price * item.qty;
      subtotal += lineTotal;
      return `
        <div class="cart-item">
          <div class="cart-item-img" style="background:${p.bg}">${p.emoji}</div>
          <div class="cart-item-info">
            <span class="cart-item-name">${p.name}</span>
            <span class="cart-item-variant">Taille ${item.size}</span>
            <span class="cart-item-price">${fmt(lineTotal)}</span>
          </div>
          <div class="cart-item-actions">
            <div class="cart-qty">
              <button type="button" data-cart-minus="${item.productId}|${item.size}" aria-label="Diminuer">−</button>
              <span>${item.qty}</span>
              <button type="button" data-cart-plus="${item.productId}|${item.size}" aria-label="Augmenter">+</button>
            </div>
            <button class="cart-remove" data-cart-remove="${item.productId}|${item.size}">Retirer</button>
          </div>
        </div>`;
    }).join("");

    const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;

    let shipNote = "";
    if (shipping === 0) {
      shipNote = `<p class="cart-shipping-note free">🚚 Livraison offerte !</p>`;
    } else {
      const missing = FREE_SHIPPING - subtotal;
      shipNote = `<p class="cart-shipping-note">Plus que ${fmt(missing)} pour la livraison offerte</p>`;
    }

    footEl.innerHTML = `
      ${shipNote}
      <div class="cart-line"><span>Sous-total</span><span>${fmt(subtotal)}</span></div>
      <div class="cart-line"><span>Livraison</span><span>${shipping === 0 ? "Offerte" : fmt(shipping)}</span></div>
      <div class="cart-line total"><span>Total</span><span>${fmt(total)}</span></div>
      <button class="btn btn-primary btn-block" id="checkout-btn" style="margin-top:1rem">Commander via WhatsApp</button>
    `;
  }

  /* ============ ACTIONS PANIER ============ */
  function addToCart(productId, size, qty = 1) {
    const existing = state.cart.find(i => i.productId === productId && i.size === size);
    if (existing) existing.qty += qty;
    else state.cart.push({ productId, size, qty });
    saveCart();
    renderCart();
    updateBadges();
    const p = getProduct(productId);
    showToast(`✓ ${p ? p.name : "Article"} ajouté au panier`);
  }

  function updateQty(productId, size, delta) {
    const item = state.cart.find(i => i.productId === productId && i.size === size);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      state.cart = state.cart.filter(i => !(i.productId === productId && i.size === size));
    }
    saveCart();
    renderCart();
    updateBadges();
  }

  function removeFromCart(productId, size) {
    state.cart = state.cart.filter(i => !(i.productId === productId && i.size === size));
    saveCart();
    renderCart();
    updateBadges();
    showToast("Article retiré du panier");
  }

  /* ============ FAVORIS ============ */
  function toggleWishlist(productId) {
    const idx = state.wishlist.indexOf(productId);
    if (idx >= 0) {
      state.wishlist.splice(idx, 1);
      showToast("Retiré des favoris");
    } else {
      state.wishlist.push(productId);
      showToast("♥ Ajouté aux favoris");
    }
    saveWishlist();
    updateBadges();
    renderProducts();
  }

  /* ============ MODAL PRODUIT ============ */
  const modalState = { productId: null, size: null, qty: 1 };
  let lastFocused = null;

  function openProductModal(productId) {
    const p = getProduct(productId);
    const modal = $("#product-modal");
    if (!p || !modal) return;

    lastFocused = document.activeElement;
    modalState.productId = productId;
    modalState.qty = 1;
    const sizes = getSizes(p);
    modalState.size = sizes[0];

    const media = $("#product-modal-media");
    if (media) { media.style.background = p.bg; media.textContent = p.emoji; }
    const cat = $("#product-modal-cat"); if (cat) cat.textContent = p.category;
    const title = $("#product-modal-title"); if (title) title.textContent = p.name;
    const price = $("#product-modal-price"); if (price) price.textContent = fmt(p.price);
    const desc = $("#product-modal-desc"); if (desc) desc.textContent = p.desc;

    const sizesEl = $("#product-sizes");
    if (sizesEl) {
      sizesEl.innerHTML = sizes.map(s =>
        `<button type="button" class="size-btn${s === modalState.size ? " is-active" : ""}" data-size="${s}">${s}</button>`
      ).join("");
    }

    const qtyVal = $("#product-qty-value"); if (qtyVal) qtyVal.textContent = "1";

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const closeBtn = $("#product-modal-close"); if (closeBtn) closeBtn.focus();
  }

  function closeProductModal() {
    const modal = $("#product-modal");
    if (!modal || !modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  /* ============ DRAWER PANIER ============ */
  let lastCartFocused = null;

  function openCartDrawer() {
    const drawer = $("#cart-drawer");
    if (!drawer) return;
    lastCartFocused = document.activeElement;
    renderCart();
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const closeBtn = drawer.querySelector("[data-close-cart]");
    if (closeBtn) closeBtn.focus();
  }

  function closeCartDrawer() {
    const drawer = $("#cart-drawer");
    if (!drawer || !drawer.classList.contains("is-open")) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastCartFocused) lastCartFocused.focus();
  }

  /* ============ CHECKOUT WHATSAPP ============ */
  function checkout() {
    if (state.cart.length === 0) return;
    let subtotal = 0;
    const lines = ["Bonjour Kitoko Store ! Je souhaite commander :", ""];
    state.cart.forEach(item => {
      const p = getProduct(item.productId);
      if (!p) return;
      const lineTotal = p.price * item.qty;
      subtotal += lineTotal;
      lines.push(`• ${p.name} (Taille ${item.size}) ×${item.qty} — ${fmt(lineTotal)}`);
    });
    const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;
    lines.push("");
    lines.push(`Sous-total : ${fmt(subtotal)}`);
    lines.push(`Livraison : ${shipping === 0 ? "Offerte" : fmt(shipping)}`);
    lines.push(`Total : ${fmt(total)}`);
    lines.push("");
    lines.push("Mes coordonnées :");
    lines.push("Nom : ");
    lines.push("Adresse : ");
    lines.push("Téléphone : ");

    const msg = lines.join("\n");
    const phone = "243000000000";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    showToast("Commande prête sur WhatsApp ✓", true);
  }

  /* ============ TOAST ============ */
  function showToast(message, success = false) {
    const container = $("#toast-container");
    if (!container) return;
    const el = document.createElement("div");
    el.className = "toast" + (success ? " toast-success" : "");
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transition = "opacity .3s ease";
      setTimeout(() => el.remove(), 300);
    }, 2800);
  }

  /* ============ INIT SÉCURISÉE ============ */
  try {
    loadState();

    /* ---- MENU MOBILE ---- */
    const navToggle = $(".nav-toggle");
    const nav = $(".nav");
    if (navToggle && nav) {
      navToggle.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(open));
      });
      $$(".nav-link", nav).forEach(l => l.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }));
    }

    /* ---- FILTRES ---- */
    $$(".chip[data-filter-cat]").forEach(btn => {
      btn.addEventListener("click", () => {
        $$(".chip[data-filter-cat]").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        state.filters.category = btn.dataset.filterCat;
        renderProducts();
      });
    });

    const sizeSelect = $("#filter-size");
    if (sizeSelect) sizeSelect.addEventListener("change", () => {
      state.filters.size = sizeSelect.value;
      renderProducts();
    });

    const sortSelect = $("#filter-sort");
    if (sortSelect) sortSelect.addEventListener("change", () => {
      state.filters.sort = sortSelect.value;
      renderProducts();
    });

    const searchInput = $("#search-input");
    if (searchInput) {
      let t;
      searchInput.addEventListener("input", () => {
        clearTimeout(t);
        t = setTimeout(() => {
          state.filters.search = searchInput.value;
          renderProducts();
        }, 200);
      });
    }

    const resetBtn = $("#reset-filters");
    if (resetBtn) resetBtn.addEventListener("click", () => {
      state.filters = { category: "all", size: "all", sort: "featured", search: "" };
      $$(".chip[data-filter-cat]").forEach(b => b.classList.remove("is-active"));
      const first = $('.chip[data-filter-cat="all"]');
      if (first) first.classList.add("is-active");
      if (sizeSelect) sizeSelect.value = "all";
      if (sortSelect) sortSelect.value = "featured";
      if (searchInput) searchInput.value = "";
      renderProducts();
    });

    /* ---- CARTES CATÉGORIES ---- */
    $$("[data-cat-jump]").forEach(btn => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.catJump;
        $$(".chip[data-filter-cat]").forEach(b => {
          b.classList.toggle("is-active", b.dataset.filterCat === cat);
        });
        state.filters.category = cat;
        renderProducts();
        const shopSection = $("#boutique");
        if (shopSection) shopSection.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
    });

   /* ---- CARTES CATÉGORIES ---- */
    $$("[data-cat-jump]").forEach(btn => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.catJump;
        $$(".chip[data-filter-cat]").forEach(b => {
          b.classList.toggle("is-active", b.dataset.filterCat === cat);
        });
        state.filters.category = cat;
        renderProducts();
        const shopSection = $("#boutique");
        if (shopSection) shopSection.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
    });

    // Compteurs de catégories
    $$("[data-count]").forEach(el => {
      const cat = el.dataset.count;
      const count = products.filter(p => p.category === cat).length;
      el.textContent = `${count} pièce${count > 1 ? "s" : ""}`;
    });

    /* ---- CLIC PRODUIT (grille) ---- */
    const grid = $("#products-grid");
    if (grid) {
      grid.addEventListener("click", e => {
        // Retirer des favoris
        const wishBtn = e.target.closest("[data-wish]");
        if (wishBtn) {
          e.stopPropagation();
          toggleWishlist(Number(wishBtn.dataset.wish));
          return;
        }
        // Ouvrir modal
        const opener = e.target.closest("[data-open]");
        if (opener) {
          openProductModal(Number(opener.dataset.open));
        }
      });
      // Clavier sur product-img
      grid.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          const opener = e.target.closest("[data-open]");
          if (opener) {
            e.preventDefault();
            openProductModal(Number(opener.dataset.open));
          }
        }
      });
    }

    /* ---- MODAL PRODUIT — ÉVÉNEMENTS ---- */
    const modal = $("#product-modal");
    if (modal) {
      // Tailles
      const sizesList = $("#product-sizes");
      if (sizesList) {
        sizesList.addEventListener("click", e => {
          const btn = e.target.closest("[data-size]");
          if (!btn) return;
          modalState.size = btn.dataset.size;
          $$(".size-btn", sizesList).forEach(b => b.classList.toggle("is-active", b === btn));
        });
      }
      // Quantité
      modal.addEventListener("click", e => {
        const qtyBtn = e.target.closest("[data-qty]");
        if (qtyBtn) {
          const delta = Number(qtyBtn.dataset.qty);
          modalState.qty = Math.max(1, modalState.qty + delta);
          const v = $("#product-qty-value");
          if (v) v.textContent = String(modalState.qty);
        }
      });
      // Ajouter au panier
      const addBtn = $("#product-add");
      if (addBtn) addBtn.addEventListener("click", () => {
        if (!modalState.productId || !modalState.size) return;
        addToCart(modalState.productId, modalState.size, modalState.qty);
        closeProductModal();
      });
      // Fermetures
      $$("[data-close-product]", modal).forEach(el => el.addEventListener("click", closeProductModal));
      const closeBtn = $("#product-modal-close");
      if (closeBtn) closeBtn.addEventListener("click", closeProductModal);
    }

    /* ---- DRAWER PANIER — ÉVÉNEMENTS ---- */
    const cartBtn = $("#cart-btn");
    if (cartBtn) cartBtn.addEventListener("click", openCartDrawer);

    const drawer = $("#cart-drawer");
    if (drawer) {
      $$("[data-close-cart]", drawer).forEach(el => el.addEventListener("click", closeCartDrawer));

      const itemsEl = $("#cart-items");
      if (itemsEl) {
        itemsEl.addEventListener("click", e => {
          const goShop = e.target.closest("[data-go-shop]");
          if (goShop) {
            closeCartDrawer();
            const shop = $("#boutique");
            if (shop) shop.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
            return;
          }
          const minus = e.target.closest("[data-cart-minus]");
          if (minus) {
            const [pid, size] = minus.dataset.cartMinus.split("|");
            updateQty(Number(pid), size, -1);
            return;
          }
          const plus = e.target.closest("[data-cart-plus]");
          if (plus) {
            const [pid, size] = plus.dataset.cartPlus.split("|");
            updateQty(Number(pid), size, 1);
            return;
          }
          const rem = e.target.closest("[data-cart-remove]");
          if (rem) {
            const [pid, size] = rem.dataset.cartRemove.split("|");
            removeFromCart(Number(pid), size);
            return;
          }
        });
      }

      const footEl = $("#cart-footer");
      if (footEl) {
        footEl.addEventListener("click", e => {
          const btn = e.target.closest("#checkout-btn");
          if (btn) checkout();
        });
      }
    }

    /* ---- ESCAPE ---- */
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        closeProductModal();
        closeCartDrawer();
      }
    });

    /* ---- NEWSLETTER ---- */
    const nlForm = $("#newsletter-form");
    if (nlForm) {
      nlForm.addEventListener("submit", e => {
        e.preventDefault();
        const input = $("#nl-email");
        const success = $("#nl-success");
        if (!input) return;
        const v = input.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
          showToast("Merci d'entrer un email valide");
          input.focus();
          return;
        }
        if (success) success.hidden = false;
        nlForm.reset();
        showToast("Merci pour votre inscription !", true);
        setTimeout(() => { if (success) success.hidden = true; }, 6000);
      });
    }

    /* ---- RÉVÉLATION SCROLL ---- */
    const revealEls = $$(".reveal");
    if (!prefersReducedMotion && "IntersectionObserver" in window) {
      revealEls.forEach(el => el.classList.add("will-animate"));
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.1 });
      revealEls.forEach(el => io.observe(el));
      setTimeout(() => revealEls.forEach(el => el.classList.add("is-visible")), 2500);
    } else {
      revealEls.forEach(el => el.classList.add("is-visible"));
    }

    /* ---- LIEN NAV ACTIF ---- */
    const sections = $$("main section[id]");
    const navLinks = $$(".nav-link");
    if ("IntersectionObserver" in window && sections.length) {
      const navIO = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            navLinks.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id));
          }
        });
      }, { rootMargin: "-40% 0px -55% 0px" });
      sections.forEach(s => navIO.observe(s));
    }

    /* ---- INIT VISUEL ---- */
    renderProducts();
    renderCart();
    updateBadges();

    console.log("[Kitoko Store] initialisation terminée ✓ — Produits:", products.length, "| Panier:", state.cart.length, "| Favoris:", state.wishlist.length);
  } catch (err) {
    console.error("[Kitoko Store] erreur :", err);
  }
})();