// 登出功能
function logout() {
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('adminLogin');
  window.location.href = 'login.html';
}

function getResources() {
  return JSON.parse(localStorage.getItem('resources') || '[]');
}
function setResources(data) {
  localStorage.setItem('resources', JSON.stringify(data));
}

// 載入資源列表
function loadResources() {
  const cat = document.getElementById('filterCategory').value;
  let data = getResources();
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

document.getElementById('addForm').onsubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  const data = getResources();
  const id = Date.now().toString();
  data.push({
    id,
    title: form.title.value,
    url: form.url.value,
    category: form.category.value,
    description: form.description.value
  });
  setResources(data);
  form.reset();
  loadResources();
}

document.getElementById('filterCategory').onchange = loadResources;

function editResource(id, field, value) {
  const data = getResources();
  const idx = data.findIndex(r => r.id === id);
  if(idx !== -1) {
    data[idx][field] = value;
    setResources(data);
    loadResources();
  }
}

function deleteResource(id) {
  if(confirm('確定要刪除嗎？')) {
    let data = getResources();
    data = data.filter(r => r.id !== id);
    setResources(data);
    loadResources();
  }
}

// 初始載入
loadResources(); 