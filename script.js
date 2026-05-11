// Basic product data
const PRODUCTS = [
  {
    id: "rf-spin-vortex",
    name: "Vortex Spinner",
    price: 24.0,
    category: "spinner",
    tag: "Featured",
    description: "Tri‑arm spinner with aggressive knurling and a ceramic bearing core for ridiculous spin times."
  },
  {
    id: "rf-click-brick",
    name: "Click Brick Cube",
    price: 18.5,
    category: "cube",
    tag: "New",
    description: "Compact cube with clicky sliders, ridges, and a brutal corner profile for restless thumbs."
  },
  {
    id: "rf-orbit-ring",
    name: "Orbit Ring",
    price: 16.0,
    category: "ring",
    tag: "Minimal",
    description: "Low‑profile ring with rotating outer track—subtle enough for meetings, loud enough for your brain."
  },
  {
    id: "rf-rail-slider",
    name: "Rail Slider",
    price: 21.0,
    category: "slider",
    tag: "Tactile",
    description: "Dual‑rail slider with magnetic snap points and textured channels for satisfying, repeatable motion."
  },
  {
    id: "rf-spine-spinner",
    name: "Spine Spinner",
    price: 27.0,
    category: "spinner",
    tag: "Limited",
    description: "Spine‑inspired profile with raised ridges and a heavy core for aggressive, weighty spins."
  },
  {
    id: "rf-grid-cube",
    name: "Gridlock Cube",
    price: 19.5,
    category: "cube",
    tag: "Classic",
    description: "Grid‑pattern cube with pressable tiles and micro‑texture edges for constant micro‑movements."
  }
{
  id: "rf-spin-vortex",
  name: "Vortex Spinner",
  price: 24.0,
  category: "spinner",
  tag: "Featured",
  description: "Tri‑arm spinner with aggressive knurling and a ceramic bearing core.",
  image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=600&q=80",
  specs: [
    "Material: PLA+ reinforced",
    "Bearing: Hybrid ceramic",
    "Weight: 42g",
    "Spin time: 2–4 minutes"
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

    const img = createEl("div", "product-image");
    const geom = createEl("div", "product-geometry");
    img.appendChild(geom);
    card.appendChild(img);

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
    detailsBtn.addEventListener("click", () => {
      alert(
        `${product.name}\n\n${product.description}\n\nCategory: ${product.category.toUpperCase()}\nPrice: $${product.price.toFixed(
          2
        )}\n\nIn a real build, this would be a dedicated product page or modal.`
      );
    });

    const addBtn = createEl(
      "button",
      "btn-primary btn-add",
      "Add to Cart"
    );
    addBtn.addEventListener("click", () => {
      addToCart(product.id);
    });

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

// Shared init
document.addEventListener("DOMContentLoaded", () => {
  // Render products if on index
  renderProducts();

  // Filters
  const searchInput = $("#searchInput");
  const categoryFilter = $("#categoryFilter");
  const sortSelect = $("#sortSelect");

  if (searchInput) {
    searchInput.addEventListener("input", renderProducts);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener("change", renderProducts);
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", renderProducts);
  }

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
      alert("Your cart is empty. Add something reckless first.");
      return;
    }
    alert(
      "This is a demo checkout.\n\nIn a real build, this would hand off to a payment provider.\n\nCart total: $" +
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

  // Initial cart UI
  updateCartUI();
});
