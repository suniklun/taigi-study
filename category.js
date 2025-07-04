const API_URL = 'https://script.google.com/macros/s/AKfycbyIcRxCjb9kckKS_bjCJwhEmnlWYzKX1muXNajOo13_x8WRzYLZqesW3vDm-ZQRRHO2Hg/exec';

const params = new URLSearchParams(window.location.search);
const type = params.get('type');
const typeMap = { listen: '聽', speak: '講', read: '讀', write: '寫' };
document.getElementById('categoryTitle').innerText = typeMap[type] + '資源';

async function loadResources() {
  const res = await fetch(API_URL);
  const data = await res.json();
  const list = document.getElementById('resourceList');
  list.innerHTML = '';
  data.filter(r => r.category === type).forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${r.url}" target="_blank">${r.title}</a> <span style="color:#888;">${r.description||''}</span>`;
    list.appendChild(li);
  });
}
loadResources(); 
