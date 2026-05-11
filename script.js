// Product data with images + specs
const PRODUCTS = [
  {
    id: "ff-vortex-spinner",
    name: "Vortex Flow Spinner",
    price: 22.0,
    category: "spinner",
    tag: "Featured",
    description: "Balanced tri‑arm spinner with soft edges and a smooth ceramic core for quiet, satisfying spins.",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=800&q=80",
    specs: [
      "Material: PLA+",
      "Core: Hybrid ceramic bearing",
      "Spin time: 2–4 minutes",
      "Profile: Rounded edges for soft feel"
    ]
  },
  {
    id: "ff-orbit-ring",
    name: "Orbit Ring",
    price: 16.0,
    category: "ring",
    tag: "Subtle",
    description: "Low‑profile ring with a rotating outer track you can spin and roll with one hand.",
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80",
    specs: [
      "Material: PETG",
      "Fit: Multiple inner diameters",
      "Motion: Outer ring rotation",
      "Noise: Very quiet"
    ]
  },
  {
    id: "ff-rail-slider",
    name: "Rail Slider",
    price: 21.0,
    category: "slider",
    tag: "Smooth",
    description: "Dual‑rail slider with gentle magnetic stops for a calm, looping back‑and‑forth motion.",
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80",
    specs: [
      "Material: PLA+ with embedded magnets",
      "Travel: 3‑stage slide",
      "Feel: Soft magnetic stops",
      "Ideal for: Focus sessions"
    ]
  },
  {
    id: "ff-click-cube",
    name: "Soft Click Cube",
    price: 18.5,
    category: "cube",
    tag: "Classic",
    description: "Compact cube with gentle click panels and rounded corners for palm‑friendly fidgeting.",
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80",
    specs: [
      "Material: PLA+",
      "Features: Click panels, traceable edges",
      "Size: 30mm cube",
      "Noise: Low click"
    ]
  },
  {
    id: "ff-loop-band",
    name: "Loop Band",
    price: 14.0,
    category: "loop",
    tag: "Minimal",
    description: "Flexible loop you can twist, fold, and roll between your fingers without looking.",
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80",
    specs: [
      "Material: Flexible filament blend",
      "Motion: Twist, fold, loop",
      "Weight: Ultra light",
      "Best for: Idle scrolling, calls"
    ]
  },
  {
    id: "ff-roller-bar",
    name: "Calm Roller Bar",
    price: 19.0,
    category: "roller",
    tag: "New",
    description: "Rounded bar with dual rollers that glide under your thumb for a gentle, repeating motion.",
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80",
    specs: [
      "Material: PLA+ with smooth rollers",
      "Motion: Thumb rolling",
      "Grip: Soft texture",
      "Noise: Near silent"
    ]
  },
  {
    id: "ff-wave-spinner",
    name: "Wave Disc Spinner",
    price: 20.0,
    category: "spinner",
    tag: "Calm",
    description: "Disc‑style spinner with a wavy surface you can trace while it spins.",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=800&q=80",
    specs: [
      "Material: PLA+",
      "Shape: Disc with wave texture",
      "Spin: Smooth, low wobble",
      "Feel: Traceable ridges"
    ]
  },
  {
    id: "ff-track-slider",
    name: "Track Slider",
    price: 23.0,
    category: "slider",
    tag: "Focus",
    description: "Single‑track slider with a gentle resistance that feels like a slow, controlled glide.",
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80",
    specs: [
      "Material: PETG",
      "Motion: Single‑track slide",
      "Resistance: Light, consistent",
      "Ideal for: Deep work"
    ]
  },
  {
    id: "ff-grid-cube",
    name: "Grid Trace Cube",
    price: 19.5,
    category: "cube",
    tag: "Tactile",
    description: "Cube with a grid of soft ridges you can trace, tap, and press while you think.",
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80",
    specs: [
      "Material: PLA+",
      "Texture: Raised grid",
      "Size: 28mm cube",
      "Best for: Thinking, planning"
    ]
  }
];

let cart = [];

// DOM helpers
function $(selector) {
  return document.querySelector(selector);
}

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

// Render products on index page
function renderProducts() {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = "";

  const searchValue = ($("#searchInput")?.value || "").toLowerCase();
  const categoryValue = $("#categoryFilter")?.value || "all";
  const sortValue = $("#sortSelect")?.value || "featured";

  let filtered = PRODUCTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchValue) ||
      p.description.toLowerCase().includes(searchValue);
    const matchesCategory =
      categoryValue === "all" ? true : p.category === categoryValue;
    return matchesSearch && matchesCategory;
  });

  if (sortValue === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  filtered.forEach((product) => {
    const card = createEl("article", "product-card");

    const tag = createEl("div", "product-tag", product.tag);
    card.appendChild(tag);

    const imgWrap = createEl("div", "product-image");
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    imgWrap.appendChild(img);
    card.appendChild(imgWrap);

    const title = createEl("h2", "product-title", product.name);
    card.appendChild(title);

    const meta = createEl("div", "product-meta");
    const price = createEl(
      "div",
      "product-price",
      `$${product.price.toFixed(2)}`
    );
    const category = createEl(
      "div",
      "product-category",
      product.category.toUpperCase()
    );
    meta.appendChild(price);
    meta.appendChild(category);
    card.appendChild(meta);

    const desc = createEl("p", "product-description", product.description);
    card.appendChild(desc);

    const actions = createEl("div", "product-actions");
    const detailsBtn = createEl("button", "btn-ghost", "Details");
    detailsBtn.addEventListener("click", () => openProductModal(product));

    const addBtn = createEl("button", "btn-primary btn-add", "Add to Cart");
    addBtn.addEventListener("click", () => addToCart(product.id));

    actions.appendChild(detailsBtn);
    actions.appendChild(addBtn);
    card.appendChild(actions);

    container.appendChild(card);
  });
}

// Cart logic
function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  updateCartUI();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartUI();
}

function changeQty(productId, delta) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
  } else {
    updateCartUI();
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    if (!product) return sum;
    return sum + product.price * item.qty;
  }, 0);
}

function updateCartUI() {
  const cartCountEl = $("#cartCount");
  const cartItemsEl = $("#cartItems");
  const cartTotalEl = $("#cartTotal");

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartCountEl) cartCountEl.textContent = totalItems;

  if (!cartItemsEl || !cartTotalEl) return;

  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    const empty = createEl("p", "cart-empty", "Your cart is currently empty.");
    empty.style.color = "#9a9a9a";
    empty.style.fontSize = "0.85rem";
    cartItemsEl.appendChild(empty);
  } else {
    cart.forEach((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (!product) return;

      const row = createEl("div", "cart-item");

      const title = createEl("div", "cart-item-title", product.name);
      const price = createEl(
        "div",
        "cart-item-price",
        `$${(product.price * item.qty).toFixed(2)}`
      );
      row.appendChild(title);
      row.appendChild(price);

      const meta = createEl(
        "div",
        "cart-item-meta",
        `${product.category.toUpperCase()} • $${product.price.toFixed(2)} ea`
      );
      meta.style.gridColumn = "1 / -1";
      row.appendChild(meta);

      const actions = createEl("div", "cart-item-actions");

      const qtyControls = createEl("div", "qty-controls");
      const minus = createEl("button", null, "–");
      const qty = createEl("span", null, String(item.qty));
      const plus = createEl("button", null, "+");

      minus.addEventListener("click", () => changeQty(item.id, -1));
      plus.addEventListener("click", () => changeQty(item.id, 1));

      qtyControls.appendChild(minus);
      qtyControls.appendChild(qty);
      qtyControls.appendChild(plus);

      const removeBtn = createEl("button", "cart-remove", "Remove");
      removeBtn.addEventListener("click", () => removeFromCart(item.id));

      actions.appendChild(qtyControls);
      actions.appendChild(removeBtn);

      row.appendChild(actions);

      cartItemsEl.appendChild(row);
    });
  }

  cartTotalEl.textContent = `$${getCartTotal().toFixed(2)}`;
}

// Cart drawer controls
function openCart() {
  $("#cartDrawer")?.classList.add("open");
  $("#cartBackdrop")?.classList.add("open");
}

function closeCart() {
  $("#cartDrawer")?.classList.remove("open");
  $("#cartBackdrop")?.classList.remove("open");
}

// FAQ toggles
function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    if (!btn) return;
    btn.addEventListener("click", () => {
      item.classList.toggle("open");
    });
  });
}

// Modal logic
let modalProductId = null;

function openProductModal(product) {
  const backdrop = $("#modalBackdrop");
  if (!backdrop) return;

  modalProductId = product.id;

  const titleEl = $("#modalTitle");
  const imgEl = $("#modalImg");
  const descEl = $("#modalDesc");
  const specsEl = $("#modalSpecs");
  const catEl = $("#modalCategory");
  const tagEl = $("#modalTag");

  if (titleEl) titleEl.textContent = product.name;
  if (imgEl) {
    imgEl.src = product.image;
    imgEl.alt = product.name;
  }
  if (descEl) descEl.textContent = product.description;
  if (catEl) catEl.textContent = product.category.toUpperCase();
  if (tagEl) tagEl.textContent = product.tag;

  if (specsEl) {
    specsEl.innerHTML = "";
    (product.specs || []).forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s;
      specsEl.appendChild(li);
    });
  }

  backdrop.classList.add("open");
}

function closeProductModal() {
  $("#modalBackdrop")?.classList.remove("open");
}

// Shared init
document.addEventListener("DOMContentLoaded", () => {
  // Render products if on index
  renderProducts();

  // Filters
  const searchInput = $("#searchInput");
  const categoryFilter = $("#categoryFilter");
  const sortSelect = $("#sortSelect");

  searchInput?.addEventListener("input", renderProducts);
  categoryFilter?.addEventListener("change", renderProducts);
  sortSelect?.addEventListener("change", renderProducts);

  // Cart buttons
  const cartButton = $("#cartButton");
  const closeCartBtn = $("#closeCart");
  const cartBackdrop = $("#cartBackdrop");
  const checkoutButton = $("#checkoutButton");

  cartButton?.addEventListener("click", openCart);
  closeCartBtn?.addEventListener("click", closeCart);
  cartBackdrop?.addEventListener("click", closeCart);

  checkoutButton?.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Add a fidget first.");
      return;
    }
    alert(
      "Demo checkout only.\n\nIn a real build, this would hand off to a payment provider.\n\nCart total: $" +
        getCartTotal().toFixed(2)
    );
  });

  // FAQ
  initFAQ();

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Modal events
  const modalClose = $("#modalClose");
  const modalBackdrop = $("#modalBackdrop");
  const modalAdd = $("#modalAdd");

  modalClose?.addEventListener("click", closeProductModal);
  modalBackdrop?.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeProductModal();
  });
  modalAdd?.addEventListener("click", () => {
    if (modalProductId) {
      addToCart(modalProductId);
      closeProductModal();
    }
  });

  // Initial cart UI
  updateCartUI();
});
