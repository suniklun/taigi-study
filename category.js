const params = new URLSearchParams(window.location.search);
const type = params.get('type');
const typeMap = { listen: '聽', speak: '講', read: '讀', write: '寫' };
document.getElementById('categoryTitle').innerText = typeMap[type] + '資源';

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

async function loadResources() {
  try {
    const data = await getResources();
    const list = document.getElementById('resourceList');
    list.innerHTML = '';
    data.filter(r => r.category === type).forEach(r => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${r.url}" target="_blank">${r.title}</a> <span style="color:#888;">${r.description||''}</span>`;
      list.appendChild(li);
    });
  } catch (error) {
    console.error('無法載入資源:', error);
    const list = document.getElementById('resourceList');
    list.innerHTML = '<li style="color:red;">無法載入資源，請檢查網路連線</li>';
  }
}
loadResources(); 