const WORKER_URL = "https://your-worker-name.your-subdomain.workers.dev"; // 替换为您的 Worker URL

// 上传文件
async function uploadFile() {
    const input = document.getElementById('fileInput');
    const file = input.files[0];
    
    if (!file) {
        alert('请选择一个文件');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${WORKER_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            alert('上传成功');
            loadFiles();
        }
    } catch (error) {
        alert('上传失败');
    }
}

// 加载文件列表
async function loadFiles() {
    try {
        const response = await fetch(`${WORKER_URL}/files`);
        const files = await response.json();
        const list = document.getElementById('fileList');
        list.innerHTML = '';

        files.forEach(file => {
            const div = document.createElement('div');
            div.className = 'file-item';
            
            div.innerHTML = `
                <span class="file-name">${file}</span>
                <input type="text" id="newName-${file}" placeholder="新文件名">
                <button class="rename-btn" onclick="renameFile('${file}')">重命名</button>
                <button class="download-btn" onclick="downloadFile('${file}')">下载</button>
            `;
            list.appendChild(div);
        });
    } catch (error) {
        alert('加载文件列表失败');
    }
}

// 重命名文件
async function renameFile(oldName) {
    const newName = document.getElementById(`newName-${oldName}`).value;
    if (!newName) {
        alert('请输入新文件名');
        return;
    }

    try {
        const response = await fetch(`${WORKER_URL}/rename`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ oldName, newName })
        });
        
        if (response.ok) {
            alert('重命名成功');
            loadFiles();
        }
    } catch (error) {
        alert('重命名失败');
    }
}

// 下载文件
function downloadFile(filename) {
    window.open(`${WORKER_URL}/download?filename=${encodeURIComponent(filename)}`, '_blank');
}

// 初始化加载文件列表
loadFiles();

// 绑定上传按钮事件
document.querySelector('.upload-section label').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', uploadFile);
