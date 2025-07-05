const params = new URLSearchParams(window.location.search);
const type = params.get('type');
const typeMap = { listen: '聽', speak: '講', read: '讀', write: '寫' };

// 登出功能
function logout() {
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('adminLogin');
  window.location.href = 'login.html';
}

// 從遠端 data.json 讀取初始資料
async function getRemoteResources() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('無法讀取遠端資料，使用空陣列');
    return [];
  }
}

// 從 localStorage 讀取使用者新增的資料
function getLocalResources() {
  return JSON.parse(localStorage.getItem('resources') || '[]');
}

// 合併遠端資料和本地資料（看起來像同步）
async function getResources() {
  const remoteData = await getRemoteResources();
  const localData = getLocalResources();
  return [...remoteData, ...localData];
}

// 儲存到 localStorage
function setLocalResources(data) {
  localStorage.setItem('resources', JSON.stringify(data));
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

// 新增資源（只更新 localStorage）
document.getElementById('addForm').onsubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  const localData = getLocalResources();
  const id = Date.now().toString();
  localData.push({
    id,
    title: form.title.value,
    url: form.url.value,
    category: form.category.value,
    description: form.description.value
  });
  setLocalResources(localData);
  form.reset();
  loadResources();
}

document.getElementById('filterCategory').onchange = loadResources;

// 編輯資源（只更新 localStorage）
function editResource(id, field, value) {
  const localData = getLocalResources();
  const idx = localData.findIndex(r => r.id === id);
  if(idx !== -1) {
    localData[idx][field] = value;
    setLocalResources(localData);
    loadResources();
  }
}

// 刪除資源（只更新 localStorage）
function deleteResource(id) {
  if(confirm('確定要刪除嗎？')) {
    let localData = getLocalResources();
    localData = localData.filter(r => r.id !== id);
    setLocalResources(localData);
    loadResources();
  }
}

// 初始載入
loadResources();