// 台語學習資源資料
let resources = [];
let currentCategory = '';
let loginTime = null;
const LOGIN_DURATION = 10 * 60 * 1000; // 10分鐘

// 從遠端載入資料
async function loadResources() {
    try {
        const response = await fetch('data.json');
        const remoteData = await response.json();
        resources = remoteData.resources || [];
        localStorage.setItem('resources', JSON.stringify(resources));
    } catch (error) {
        console.log('無法載入遠端資料，使用本地資料');
        const localData = localStorage.getItem('resources');
        resources = localData ? JSON.parse(localData) : [];
    }
}

// 儲存資料
function saveResources() {
    localStorage.setItem('resources', JSON.stringify(resources));
    updateAllPages();
}

// 更新所有頁面
function updateAllPages() {
    updateIndexPage();
    updateCategoryPage();
    updateAdminPage();
}

// 更新首頁
function updateIndexPage() {
    // 首頁不需要特別更新，因為是靜態的四大區塊
}

// 更新分類頁面
function updateCategoryPage() {
    if (!document.getElementById('resourceGrid')) return;

    const urlParams = new URLSearchParams(window.location.search);
    currentCategory = urlParams.get('type') || '';
    
    const categoryNames = {
        'listen': '聽力練習資源',
        'speak': '口說練習資源', 
        'read': '閱讀練習資源',
        'write': '書寫練習資源'
    };

    const title = document.getElementById('categoryTitle');
    if (title) {
        title.textContent = categoryNames[currentCategory] || '台語學習資源';
    }

    const grid = document.getElementById('resourceGrid');
    const noResources = document.getElementById('noResources');
    
    if (!grid) return;

    grid.innerHTML = '';
    
    const filteredResources = currentCategory 
        ? resources.filter(r => r.category === currentCategory)
        : resources;

    if (filteredResources.length === 0) {
        if (noResources) noResources.style.display = 'block';
        return;
    }

    if (noResources) noResources.style.display = 'none';

    filteredResources.forEach(resource => {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.innerHTML = `
            <h3>${resource.title}</h3>
            <p><strong>分類：</strong>${getCategoryName(resource.category)}</p>
            <p><strong>描述：</strong>${resource.description}</p>
            ${resource.url ? `<p><strong>連結：</strong><a href="${resource.url}" target="_blank">點擊查看</a></p>` : ''}
            <div class="resource-meta">
                <span>建立時間：${resource.createdAt || '未知'}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 更新管理後台頁面
function updateAdminPage() {
    if (!document.getElementById('adminResourceTable')) return;

    const tableBody = document.getElementById('adminResourceTable');
    tableBody.innerHTML = '';

    resources.forEach((resource, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${resource.title}</td>
            <td>${getCategoryName(resource.category)}</td>
            <td>${resource.description}</td>
            <td>${resource.url ? `<a href="${resource.url}" target="_blank">連結</a>` : '無'}</td>
            <td>
                <button onclick="editResource(${index})">編輯</button>
                <button onclick="deleteResource(${index})">刪除</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 取得分類名稱
function getCategoryName(category) {
    const names = {
        'listen': '聽',
        'speak': '講',
        'read': '讀',
        'write': '寫'
    };
    return names[category] || category;
}

// 新增資源
function addResource() {
    const title = document.getElementById('titleInput').value.trim();
    const category = document.getElementById('categoryInput').value;
    const description = document.getElementById('descriptionInput').value.trim();
    const url = document.getElementById('urlInput').value.trim();

    if (!title || !category) {
        alert('請填寫標題和分類');
        return;
    }

    const newResource = {
        title,
        category,
        description,
        url,
        createdAt: new Date().toLocaleDateString('zh-TW')
    };

    resources.push(newResource);
    saveResources();
    
    // 清空輸入框
    document.getElementById('titleInput').value = '';
    document.getElementById('categoryInput').value = 'listen';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('urlInput').value = '';
}

// 編輯資源
function editResource(index) {
    const resource = resources[index];
    document.getElementById('titleInput').value = resource.title;
    document.getElementById('categoryInput').value = resource.category;
    document.getElementById('descriptionInput').value = resource.description;
    document.getElementById('urlInput').value = resource.url || '';
    
    // 更改按鈕功能
    const addButton = document.querySelector('button[onclick="addResource()"]');
    addButton.onclick = () => confirmEdit(index);
    addButton.textContent = '確認編輯';
}

// 確認編輯
function confirmEdit(index) {
    if (confirm('確定要更新這個資源嗎？')) {
        const title = document.getElementById('titleInput').value.trim();
        const category = document.getElementById('categoryInput').value;
        const description = document.getElementById('descriptionInput').value.trim();
        const url = document.getElementById('urlInput').value.trim();

        if (!title || !category) {
            alert('請填寫標題和分類');
            return;
        }

        resources[index] = {
            ...resources[index],
            title,
            category,
            description,
            url
        };

        saveResources();
        
        // 恢復新增功能
        const addButton = document.querySelector('button[onclick="confirmEdit(' + index + ')"]');
        addButton.onclick = addResource;
        addButton.textContent = '新增資源';
        
        // 清空輸入框
        document.getElementById('titleInput').value = '';
        document.getElementById('categoryInput').value = 'listen';
        document.getElementById('descriptionInput').value = '';
        document.getElementById('urlInput').value = '';
    }
}

// 刪除資源
function deleteResource(index) {
    if (confirm('確定要刪除這個資源嗎？')) {
        resources.splice(index, 1);
        saveResources();
    }
}

// 篩選資源
function filterResources() {
    const filterValue = document.getElementById('filterCategory').value;
    const tableBody = document.getElementById('adminResourceTable');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    const filteredResources = filterValue 
        ? resources.filter(r => r.category === filterValue)
        : resources;

    filteredResources.forEach((resource, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${resource.title}</td>
            <td>${getCategoryName(resource.category)}</td>
            <td>${resource.description}</td>
            <td>${resource.url ? `<a href="${resource.url}" target="_blank">連結</a>` : '無'}</td>
            <td>
                <button onclick="editResource(${resources.indexOf(resource)})">編輯</button>
                <button onclick="deleteResource(${resources.indexOf(resource)})">刪除</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 登入功能
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 支援兩組帳號密碼
    if ((username === 'admin' && password === '1234') || 
        (username === 'test' && password === '5678')) {
        
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminSection').style.display = 'block';
        
        // 記錄登入時間
        loginTime = Date.now();
        localStorage.setItem('loginTime', loginTime.toString());
        localStorage.setItem('isLoggedIn', 'true');
        
    } else {
        alert('帳號或密碼錯誤');
    }
}

// 登出功能
function logout() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('adminSection').style.display = 'none';
    
    // 清除登入狀態
    loginTime = null;
    localStorage.removeItem('loginTime');
    localStorage.removeItem('isLoggedIn');
    
    // 清空輸入框
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// 檢查登入狀態
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const savedLoginTime = localStorage.getItem('loginTime');
    
    if (isLoggedIn && savedLoginTime) {
        const timeDiff = Date.now() - parseInt(savedLoginTime);
        
        if (timeDiff < LOGIN_DURATION) {
            // 10分鐘內，自動登入
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('adminSection').style.display = 'block';
            loginTime = parseInt(savedLoginTime);
        } else {
            // 超過10分鐘，清除登入狀態
            logout();
        }
    }
}

// 初始化
window.onload = async () => {
    await loadResources();
    updateAllPages();
    checkLoginStatus();
};
