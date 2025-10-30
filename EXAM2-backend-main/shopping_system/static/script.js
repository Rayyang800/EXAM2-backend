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
  const userDisplay = document.getElementById('user-display');
  const loginForm = document.getElementById('login-form');

  if (!userDisplay || !loginForm) return;

  if (username) {
    // 登入狀態：顯示使用者名稱和登出按鈕
    userDisplay.innerHTML = `
      <span>哈囉, **${username}**</span>
      <button id="logout-btn" style="margin-left: 10px; padding: 5px 10px; border: 1px solid #ccc; background: #f0f0f0; cursor: pointer; border-radius: 4px;">登出</button>
    `;
    userDisplay.style.display = 'block';
    loginForm.style.display = 'none';

    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem('username');
      // 這裡應該導向登入頁面，但如果沒有實際頁面，就刷新當前顯示
      // window.location.href = '/login'; // 假設登入頁是 /login
      showUsername(); // 重新執行，切換顯示
    });
  } else {
    // 未登入狀態：顯示登入表單
    userDisplay.innerHTML = '';
    userDisplay.style.display = 'none';
    loginForm.style.display = 'block';
  }
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
    // 初始狀態由 refreshSummary 決定，故移除此處的 disabled=true
    // btn.disabled = true;
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
    const isQtyZero = state.qty === 0;

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
            <button type="button" class="btn-dec" style="padding:2px 8px;" ${isQtyZero ? 'disabled' : ''}>-</button>
            <input type="number" class="qty-input" min="0" value="${state.qty}" style="width:64px;">
            <button type="button" class="btn-inc" style="padding:2px 8px;">+</button>
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
  const category_pants  = document.getElementById('pants')?.checked ?? false;
  const category_shoes  = document.getElementById('shoes')?.checked ?? false;
  const category_cap    = document.getElementById('cap')?.checked ?? false;

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
    if (category_pants)  selectedCats.push('褲/裙子');
    if (category_shoes)  selectedCats.push('鞋子');
    if (category_cap)    selectedCats.push('帽子');

    const fit_category = (selectedCats.length === 0) ||
                         selectedCats.includes(products_to_filter[i].category);

    if (fit_price && fit_gender && fit_category) {
      result.push(products_to_filter[i]); // 修正這一行
    }
  }
  // 重新渲染（保留既有 rowState 的勾選/數量，如需清空可在此重置 rowState）
  display_products(result);
}

// *** 新增/修正：更新單列的總金額和按鈕狀態 ***
function updateRow(tr) {
  const key = tr.getAttribute('data-key');
  const st = rowState.get(key) || { checked: false, qty: 0 };
  const price = Number(tr.querySelector('[data-price]')?.dataset?.price || 0);
  const chk = tr.querySelector('.row-check');
  const input = tr.querySelector('.qty-input');
  const btnDec = tr.querySelector('.btn-dec');
  const totalCell = tr.querySelector('.row-total');

  // 狀態同步到 DOM
  input.value = st.qty;
  chk.checked = st.checked;

  // 更新單列總金額
  totalCell.textContent = (price * st.qty).toLocaleString();

  // 更新減號按鈕狀態 (數量 > 0 才能按)
  if (btnDec) btnDec.disabled = st.qty === 0;

  // 更新整體下單狀態
  refreshSummary();
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
      const isChecked = e.target.checked;
      st.checked = isChecked;

      if (isChecked) {
        // 勾選時：如果數量為 0，則設為 1
        if (st.qty === 0) st.qty = 1;
      } else {
        // 取消勾選時：將數量設為 0
        st.qty = 0;
      }
      rowState.set(key, st);
      updateRow(tr); // 更新整列狀態
      return;
    }

    // 減少數量
    if (e.target.classList.contains('btn-dec') && !e.target.disabled) {
      st.qty = Math.max(0, st.qty - 1);
      // 數量減到 0 時，自動取消勾選
      if (st.qty === 0) st.checked = false;

      rowState.set(key, st);
      updateRow(tr); // 更新整列狀態
      return;
    }

    // 增加數量
    if (e.target.classList.contains('btn-inc')) {
      st.qty = st.qty + 1;
      // 數量 > 0 時，自動勾選
      if (st.qty > 0) st.checked = true;

      rowState.set(key, st);
      updateRow(tr); // 更新整列狀態
      return;
    }
  });

  tbody.addEventListener('input', (e) => {
    if (!e.target.classList.contains('qty-input')) return;
    const tr = e.target.closest('tr');
    const key = tr.getAttribute('data-key');
    const st = rowState.get(key) || { checked: false, qty: 0 };

    const v = Math.max(0, Number(e.target.value || 0));
    
    st.qty = v;

    // 數量 > 0 時，自動勾選；數量 = 0 時，自動取消勾選
    st.checked = v > 0;

    rowState.set(key, st);
    updateRow(tr); // 更新整列狀態
  });
})();

// function updateRowTotal(tr) { // 被 updateRow 取代
//   const price = Number(tr.querySelector('[data-price]')?.dataset?.price || 0);
//   const qty = Number(tr.querySelector('.qty-input')?.value || 0);
//   const totalCell = tr.querySelector('.row-total');
//   if (totalCell) totalCell.textContent = (price * qty).toLocaleString();
// }

// === 合計 & 下單 ===
function refreshSummary() {
  const tbody = document.querySelector('#products table tbody');
  if (!tbody) return;

  let selectedCount = 0;
  let totalQty = 0;
  let totalPrice = 0;

  // 遍歷 rowState 而不是 DOM，因為 rowState 是最真實的狀態來源
  rowState.forEach((state, key) => {
    if (state.checked && state.qty > 0) {
      // 必須從 products 陣列中找到價格
      // 這裡採用簡單方法：從 DOM 取得價格 (price)
      const tr = tbody.querySelector(`tr[data-key="${key}"]`);
      if (tr) {
        const price = Number(tr.querySelector('[data-price]')?.dataset?.price || 0);
        selectedCount += 1;
        totalQty += state.qty;
        totalPrice += state.qty * price;
      }
    }
  });

  const btnOrder = document.getElementById('place-order');
  // 下單按鍵反白（不可按）：未勾選任何品項 (selectedCount > 0)
  const canOrder = selectedCount > 0 && totalQty > 0;
  if (btnOrder) btnOrder.disabled = !canOrder;

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
    // 應從 rowState 獲取已勾選項目，然後再從 DOM 取得名稱和價格
    rowState.forEach((state, key) => {
      if (!state.checked || state.qty <= 0) return;

      const tr = tbody.querySelector(`tr[data-key="${key}"]`);
      if (!tr) return;

      const qty = state.qty;
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

  // 將 fetch 目標指向後端處理登入的路由 /page_login
  const response = await fetch('/page_login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }).catch(error => {
    console.error('Fetch error:', error);
    alert('登入請求失敗，請檢查伺服器狀態。');
    return { ok: false, json: async () => ({ status: 'error', message: '網路錯誤' }) };
  });

  // 必須先解析 JSON 響應
  const result = await response.json();

  // 依後端邏輯處理導向
  if (result.status === 'success') {
    // 登入成功時，實際進行頁面跳轉到後端提供的 URL (/shopping)
    if (result.redirect_url) {
        window.location.href = result.redirect_url;
    } else {
        // 如果沒有跳轉 URL，則使用 showUsername 更新 DOM (主要用於測試或無導向頁面)
        showUsername(); 
    }
  } else {
    // 登入失敗時
    localStorage.removeItem('username'); 
    alert(result.message);
  }
}

// 確保登入表單綁定事件
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});


// === 首次渲染 ===
display_products(products);