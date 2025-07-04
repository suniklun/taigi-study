const API_URL = 'https://script.google.com/macros/s/AKfycbyIcRxCjb9kckKS_bjCJwhEmnlWYzKX1muXNajOo13_x8WRzYLZqesW3vDm-ZQRRHO2Hg/exec';

// 登出功能
function logout() {
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('adminLogin');
  window.location.href = 'login.html';
}

async function getResources() {
  const res = await fetch(API_URL);
  return await res.json();
}
async function addResource(data) {
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

// 載入資源列表
async function loadResources() {
  const cat = document.getElementById('filterCategory').value;
  let data = await getResources();
  if(cat !== 'all') data = data.filter(r => r.category === cat);
  const tbody = document.querySelector('#resourceTable tbody');
  tbody.innerHTML = '';
  data.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input value="${r.title}" onchange="editResource('${r.id}', 'title', this.value)"></td>
      <td><input value="${r.url}" onchange="editResource('${r.id}', 'url', this.value)"></td>
      <td>
        <select onchange="editResource('${r.id}', 'category', this.value)">
          <option value="listen" ${r.category==='listen'?'selected':''}>聽</option>
          <option value="speak" ${r.category==='speak'?'selected':''}>講</option>
          <option value="read" ${r.category==='read'?'selected':''}>讀</option>
          <option value="write" ${r.category==='write'?'selected':''}>寫</option>
        </select>
      </td>
      <td><input value="${r.description||''}" onchange="editResource('${r.id}', 'description', this.value)"></td>
      <td><button onclick="deleteResource('${r.id}')">刪除</button></td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('addForm').onsubmit = async function(e) {
  e.preventDefault();
  const form = e.target;
  const id = Date.now().toString();
  const data = {
    id,
    title: form.title.value,
    url: form.url.value,
    category: form.category.value,
    description: form.description.value
  };
  await addResource(data);
  form.reset();
  loadResources();
}

document.getElementById('filterCategory').onchange = loadResources;

// 編輯與刪除功能暫時無法直接操作 Google Sheets，僅支援新增
function editResource(id, field, value) {
  alert('Google Sheets 版本目前僅支援新增，編輯/刪除請直接到 Google 試算表操作。');
}
function deleteResource(id) {
  alert('Google Sheets 版本目前僅支援新增，刪除請直接到 Google 試算表操作。');
}

// 初始載入
loadResources(); 
