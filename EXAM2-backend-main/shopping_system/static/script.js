// === 產品資料（保留你的資料；會在渲染時自動規整 image_url 路徑） ===
const products = [
 {'name': 'T-Shirt',       'price': 25, 'gender': '男裝', 'category': '上衣',   'image_url': '.../static/img/T-Shirt.png'},  /* 改善路徑註解 */
  {'name': 'Blouse',        'price': 30, 'gender': '女裝', 'category': '上衣',   'image_url': '.../static/img/Blouse.png'},
  {'name': 'Jeans',         'price': 50, 'gender': '通用', 'category': '褲/裙子', 'image_url': '.../static/img/Jeans.png'},
  {'name': 'Skirt',         'price': 40, 'gender': '女裝', 'category': '褲/裙子', 'image_url': '.../static/img/Skirt.png'},
  {'name': 'Sneakers',      'price': 60, 'gender': '通用', 'category': '鞋子',   'image_url': '.../static/img/Sneakers.png'},
  {'name': 'Leather Shoes', 'price': 80, 'gender': '男裝', 'category': '鞋子',   'image_url': '.../static//img/LeatherShoes.png'},
  {'name': 'Baseball Cap',  'price': 20, 'gender': '通用', 'category': '帽子',   'image_url': '.../static/img/BaseballCap.png'},
  {'name': 'Sun Hat',       'price': 25, 'gender': '女裝', 'category': '帽子',   'image_url': '.../static/img/SunHat.png'},
  {'name': 'Running Shoes', 'price': 85, 'gender': '通用', 'category': '鞋子',   'image_url': '.../static/img/RunningShoes.png'},
  {'name': 'Dress',         'price': 75, 'gender': '女裝', 'category': '上衣',   'image_url': '.../static/img/Dress.png'}
];


(function showUsername() {
// === 顯示登入使用者於導行列，補齊程式碼 ===
  const username = localStorage.getItem('username');
  const nav = document.querySelector('nav') || document.createElement('nav');
  nav.style.display = 'flex';
  nav.style.justifyContent = 'space-between';
  nav.style.alignItems = 'center';
  nav.style.padding = '10px 16px';
  nav.style.background = '#f8fafc';
  nav.style.borderBottom = '1px solid #e2e8f0';
  nav.style.fontFamily = 'sans-serif';
  nav.style.position = 'sticky';
  nav.style.top = '0';
  nav.style.zIndex = '30';

  const left = document.createElement('div');
  left.innerHTML = `👤 目前登入使用者：<strong>${username || '未登入'}</strong>`;

  const right = document.createElement('button');
  right.textContent = '登出';
  right.style.background = '#ef4444';
  right.style.color = '#fff';
  right.style.border = 'none';
  right.style.padding = '6px 12px';
  right.style.borderRadius = '6px';
  right.style.cursor = 'pointer';
  right.addEventListener('click', () => {
    localStorage.removeItem('username');
    window.location.href = './login.html'; // ← 改成你的登入頁路徑
  });

  nav.appendChild(left);
  nav.appendChild(right);
  document.body.prepend(nav);
})();


//以下請自行新增或修改程式碼

(function ensureOrderButton() {
  if (!document.getElementById('place-order')) {
    const wrap = document.createElement('div');
    wrap.className = 'footer-actions';
    wrap.style.position = 'fixed';
    wrap.style.left = '12px';
    wrap.style.bottom = '12px';
    wrap.style.background = '#fff';
    wrap.style.border = '1px solid #e5e7eb';
    wrap.style.borderRadius = '8px';
    wrap.style.padding = '10px 12px';
    wrap.style.boxShadow = '0 6px 18px rgba(0,0,0,.06)';
    wrap.style.zIndex = '20';

    const btn = document.createElement('button');
    btn.id = 'place-order';
    btn.textContent = '下單';
    btn.disabled = true;
    btn.style.background = '#2563eb';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.padding = '8px 14px';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';

    const span = document.createElement('span');
    span.id = 'cart-summary';
    span.style.marginLeft = '12px';
    span.style.color = '#475569';

    wrap.appendChild(btn);
    wrap.appendChild(span);
    document.body.appendChild(wrap);
  }
})();

// === 狀態：每列的勾選與數量 ===
const rowState = new Map(); 

// === 工具：規整圖片路徑 ../static/... -> ./static/... 且移除多餘斜線 ===
function normalizeImg(url = '') {
  return url.replace(/\/{2,}/g, '/').replace('../static', './static');
}

// === 渲染產品表格（含 checkbox、± 數量、單列總金額） ===
function display_products(products_to_display) {
  const tbody = document.querySelector('#products table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  for (let i = 0; i < products_to_display.length; i++) {
    const p = products_to_display[i];
    const key = `${p.name}-${i}`; // 簡單唯一鍵（也可用 id）
    if (!rowState.has(key)) rowState.set(key, { checked: false, qty: 0 });

    const state = rowState.get(key);
    const price = Number(p.price) || 0;
    const total = price * (state.qty || 0);
    const decDisabled = (!state.checked || state.qty <= 0) ? 'disabled' : '';
    const incDisabled = (!state.checked) ? 'disabled' : '';

    const product_info = `
      <tr data-key="${key}">
        <td><input type="checkbox" class="row-check" ${state.checked ? 'checked' : ''}></td>
        <td><img src="${normalizeImg(p.image_url)}" alt="${p.name}" style="width:56px;height:56px;object-fit:cover;border:1px solid #e5e7eb;border-radius:6px;"></td>
        <td>${p.name}</td>
        <td data-price="${price}">${price.toLocaleString()}</td>
        <td>${p.gender}</td>
        <td>${p.category}</td>
        <td>
          <div class="qty" style="display:inline-flex;align-items:center;gap:6px;">
            <button type="button" class="btn-dec" ${decDisabled} style="padding:2px 8px;">-</button>
            <input type="number" class="qty-input" min="0" value="${state.qty}" style="width:64px;" ${!state.checked ? 'disabled' : ''}>
            <button type="button" class="btn-inc" ${incDisabled} style="padding:2px 8px;">+</button>
          </div>
        </td>
        <td class="row-total">${total.toLocaleString()}</td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', product_info);
  }

  refreshSummary();
}

// === 篩選（修正 push 的目標） ===
function apply_filter(products_to_filter) {
  const max_price = document.getElementById('max_price')?.value ?? '';
  const min_price = document.getElementById('min_price')?.value ?? '';
  const gender = document.getElementById('gender')?.value ?? 'All';

  const category_shirts = document.getElementById('shirts')?.checked ?? false;
  const category_pants  = document.getElementById('pants')?.checked ?? false;
  const category_shoes  = document.getElementById('shoes')?.checked ?? false;
  const category_cap    = document.getElementById('cap')?.checked ?? false;

  const result = [];
  for (let i = 0; i < products_to_filter.length; i++) {
    // 價格條件
    const price = Number(products_to_filter[i].price);
    const hasMin = (min_price !== '' && !isNaN(Number(min_price)));
    const hasMax = (max_price !== '' && !isNaN(Number(max_price)));
    let fit_price = true;
    if (hasMin && hasMax) {
      fit_price = price >= Number(min_price) && price <= Number(max_price);
    } else if (hasMin) {
      fit_price = price >= Number(min_price);
    } else if (hasMax) {
      fit_price = price <= Number(max_price);
    }

    // 性別條件（Male/Female 對應 男裝/女裝/通用）
    const g = products_to_filter[i].gender; // '男裝' | '女裝' | '通用'
    let fit_gender = true;
    if (gender === 'Male') {
      fit_gender = (g === '男裝' || g === '通用');
    } else if (gender === 'Female') {
      fit_gender = (g === '女裝' || g === '通用');
    } // 'All' → 全通過

    // 類別條件（多選 OR；未選視為全通過）
    const selectedCats = [];
    if (category_shirts) selectedCats.push('上衣');
    if (category_pants)  selectedCats.push('褲/裙子');
    if (category_shoes)  selectedCats.push('鞋子');
    if (category_cap)    selectedCats.push('帽子');

    const fit_category = (selectedCats.length === 0) ||
                         selectedCats.includes(products_to_filter[i].category);

    if (fit_price && fit_gender && fit_category) {
      result.push(products_to_filter[i]); // 修正這一行
    }
  }
  // 重新渲染（保留既有 rowState 的勾選/數量，如需清空可在此重置 rowState）
  display_products(result);
}

// === 事件委派：處理 checkbox、± 按鈕、數量輸入 ===
(function bindTableEvents() {
  const tbody = document.querySelector('#products table tbody');
  if (!tbody) return;

  tbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const key = tr.getAttribute('data-key');
    const st = rowState.get(key) || { checked: false, qty: 0 };

    // 列 checkbox
    if (e.target.classList.contains('row-check')) {
      st.checked = e.target.checked;

      const input = tr.querySelector('.qty-input');
      const btnDec = tr.querySelector('.btn-dec');
      const btnInc = tr.querySelector('.btn-inc');

      if (st.checked) {
        st.qty = 1;
        input.value = 1;
        btnDec.disabled = true;
        btnInc.disabled = false;
        input.disabled = false;
      } else {
        st.qty = 0;
        input.value = 0;
        btnDec.disabled = true;
        btnInc.disabled = true;
        input.disabled = true;
      }

      rowState.set(key, st);
      updateRowTotal(tr);
      refreshSummary();
      return;
    }


    // 減少數量
    if (e.target.classList.contains('btn-dec')) {
      const input = tr.querySelector('.qty-input');
      const v = Math.max(0, Number(input.value || 0) - 1);
      input.value = v;
      st.qty = v;
      // 若未勾選且 qty>0，自動勾選
      const chk = tr.querySelector('.row-check');
      if (!chk.checked && v > 0) {
        chk.checked = true; st.checked = true;
      }
      rowState.set(key, st);
      updateRowTotal(tr);
      refreshSummary();
      return;
    }

    // 增加數量
    if (e.target.classList.contains('btn-inc')) {
      const input = tr.querySelector('.qty-input');
      const v = Math.max(0, Number(input.value || 0) + 1);
      input.value = v;
      st.qty = v;
      const chk = tr.querySelector('.row-check');
      if (!chk.checked && v > 0) {
        chk.checked = true; st.checked = true;
      }
      rowState.set(key, st);
      updateRowTotal(tr);
      refreshSummary();
      return;
    }
  });

  tbody.addEventListener('input', (e) => {
    if (!e.target.classList.contains('qty-input')) return;
    const tr = e.target.closest('tr');
    const key = tr.getAttribute('data-key');
    const st = rowState.get(key) || { checked: false, qty: 0 };

    const v = Math.max(0, Number(e.target.value || 0));
    e.target.value = v;
    st.qty = v;

    const chk = tr.querySelector('.row-check');
    if (!chk.checked && v > 0) {
      chk.checked = true; st.checked = true;
    }
    rowState.set(key, st);
    updateRowTotal(tr);
    refreshSummary();
  });
})();

function updateRowTotal(tr) {
  const price = Number(tr.querySelector('[data-price]')?.dataset?.price || 0);
  const qty = Number(tr.querySelector('.qty-input')?.value || 0);
  const totalCell = tr.querySelector('.row-total');
  if (totalCell) totalCell.textContent = (price * qty).toLocaleString();
}

// === 合計 & 下單 ===
function refreshSummary() {
  const tbody = document.querySelector('#products table tbody');
  if (!tbody) return;

  let selectedCount = 0;
  let totalQty = 0;
  let totalPrice = 0;

  tbody.querySelectorAll('tr').forEach(tr => {
    const chk = tr.querySelector('.row-check');
    const qty = Number(tr.querySelector('.qty-input')?.value || 0);
    const price = Number(tr.querySelector('[data-price]')?.dataset?.price || 0);
    if (chk?.checked && qty > 0) {
      selectedCount += 1;
      totalQty += qty;
      totalPrice += qty * price;
    const btnDec = tr.querySelector('.btn-dec');
    const btnInc = tr.querySelector('.btn-inc');
    const input = tr.querySelector('.qty-input');
    if (chk.checked) {
      btnInc.disabled = false;
      input.disabled = false;
      btnDec.disabled = (qty <= 1);
    } else {
      btnInc.disabled = true;
      btnDec.disabled = true;
      input.disabled = true;
    }
    }
  });

  const btnOrder = document.getElementById('place-order');
  if (btnOrder) btnOrder.disabled = !(selectedCount > 0 && totalQty > 0);

  const summaryEl = document.getElementById('cart-summary');
  if (summaryEl) summaryEl.textContent =
    `已選 ${selectedCount} 項、總數量 ${totalQty}、總金額 $${totalPrice.toLocaleString()}`;
}

// 綁定下單按鈕
(function bindOrderButton() {
  const btnOrder = document.getElementById('place-order');
  if (!btnOrder) return;
  btnOrder.addEventListener('click', () => {
    const tbody = document.querySelector('#products table tbody');
    if (!tbody) return;

    const orderItems = [];
    tbody.querySelectorAll('tr').forEach(tr => {
      const chk = tr.querySelector('.row-check');
      if (!chk?.checked) return;

      const qty = Number(tr.querySelector('.qty-input')?.value || 0);
      if (qty <= 0) return;

      const name = tr.children[2]?.textContent?.trim() || '';
      const price = Number(tr.querySelector('[data-price]')?.dataset?.price || 0);

      orderItems.push({ name, price, qty, total: price * qty });
    });

    if (!orderItems.length) return;

    console.log('下單內容：', orderItems);
    alert('下單成功！詳情請見主控台 (Console)。');
  });
})();

// === 登入：儲存使用者名稱到 localStorage，並可在導行列顯示 ===
async function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username')?.value ?? '';
  const password = document.getElementById('password')?.value ?? '';

  // 先把使用者名稱記起來供前端顯示
  if (username) localStorage.setItem('username', username);

  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  // 依你後端邏輯處理導向
  if (response.ok) {
    // location.href = '/'; // 例如登入成功返回首頁
  } else {
    alert('登入失敗');
  }
}

// === 首次渲染 ===
display_products(products);
