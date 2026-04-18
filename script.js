// 天行数据API密钥（请替换为您自己的密钥）
// 注意：这个密钥可能已经过期或无效，请替换为您自己的有效密钥
const API_KEY = 'd251ab5ddf52d4480052fa2e5fb1781b';

// API端点配置
const API_CONFIG = {
    guonei: {
        url: 'https://apis.tianapi.com/guonei/index',
        type: 'newslist'
    },
    ai: {
        url: 'https://apis.tianapi.com/ai/index',
        type: 'newslist'
    }
};

let currentCategory = 'guonei';
let isLoading = false;

// DOM元素
const newsContainer = document.getElementById('news-container');
const loadingElement = document.getElementById('loading');
const categoryBtns = document.querySelectorAll('.category-btn');

// 初始化
function init() {
    // 绑定分类按钮点击事件
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            console.log('点击分类按钮:', category);
            console.log('当前分类:', currentCategory);
            if (category !== currentCategory) {
                console.log('更新分类为:', category);
                currentCategory = category;
                updateCategoryButtons(this);
                console.log('更新后分类:', currentCategory);
                fetchNews();
            }
        });
    });
    
    // 初始加载头条新闻
    fetchNews();
}

// 更新分类按钮状态
function updateCategoryButtons(activeBtn) {
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// 获取新闻数据
async function fetchNews() {
    if (isLoading) return;
    
    isLoading = true;
    loadingElement.style.display = 'block';
    newsContainer.innerHTML = '';
    
    console.log('当前分类:', currentCategory);
    console.log('API_CONFIG:', API_CONFIG);
    console.log('API_CONFIG[currentCategory]:', API_CONFIG[currentCategory]);
    
    const config = API_CONFIG[currentCategory];
    if (!config) {
        showError('无效的分类');
        isLoading = false;
        loadingElement.style.display = 'none';
        return;
    }
    
    try {
        console.log('开始请求API:', config.url);
        console.log('API密钥:', API_KEY);
        console.log('分类:', currentCategory);
        
        const response = await axios({
            method: 'post',
            url: config.url,
            data: `key=${API_KEY}&num=30`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        console.log('API响应:', response.data);
        
        if (response.data.code === 200 && response.data.result) {
            console.log('使用API数据');
            if (config.type === 'newslist') {
                console.log('渲染新闻列表数据');
                if (response.data.result.newslist) {
                    renderNews(response.data.result.newslist);
                } else {
                    showError('新闻数据格式错误');
                    renderNews(testDataGuonei);
                }
            }
        } else {
            console.error('API返回错误:', response.data);
            showError(`获取数据失败: ${response.data.msg || '未知错误'}`);
            console.log('使用测试数据');
            if (config.type === 'newslist') {
                console.log('渲染新闻列表测试数据');
                renderNews(testDataGuonei);
            }
        }
    } catch (error) {
        console.error('请求数据失败:', error);
        showError(`网络错误: ${error.message || '未知错误'}`);
        console.log('使用测试数据');
        if (config.type === 'newslist') {
            console.log('渲染新闻列表测试数据');
            renderNews(testDataGuonei);
        }
    } finally {
        isLoading = false;
        loadingElement.style.display = 'none';
    }
}

// 渲染新闻列表
function renderNews(newsList) {
    newsContainer.innerHTML = '';
    
    if (newsList.length === 0) {
        newsContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">暂无新闻数据</p>';
        return;
    }
    
    newsList.forEach(news => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        
        const defaultImage = 'https://via.placeholder.com/300x180?text=No+Image';
        const imageUrl = news.picUrl || defaultImage;
        
        console.log('图片URL:', imageUrl);
        
        const imageHtml = `<img src="${imageUrl}" alt="${news.title}" class="news-image" style="display:block;width:100%;height:180px;object-fit:cover;margin-bottom:10px;">`;
        
        newsItem.innerHTML = `
            <div class="news-content">
                ${imageHtml}
                <h3 class="news-title">${news.title}</h3>
                <div class="news-meta">
                    <span class="news-source">${news.source}</span>
                    <span class="news-time">${news.ctime}</span>
                </div>
                <p class="news-desc">${news.description || '暂无简介'}</p>
                <a href="${news.url}" class="news-link" target="_blank" rel="noopener noreferrer">查看原文</a>
            </div>
        `;
        
        newsContainer.appendChild(newsItem);
    });
}

// 测试数据 - 国内新闻
const testDataGuonei = [
    {
        "id": "aefca8c784c3486447e5ebda916ea6b0",
        "ctime": "2026-04-18 00:00",
        "title": "2025-2026学年全国青少年国防素养大赛开始报名啦",
        "description": "",
        "source": "中华国内",
        "picUrl": "https://img2.utuku.imgcdc.com/300x200/news/20260418/fa13f6e5-64d1-413c-866c-133c852a02ff.png",
        "url": "https://news.china.com/domestic/945/20260418/49427835.html"
    },
    {
        "id": "aa28c772b8bcd48a7f895e37fbc4080a",
        "ctime": "2026-04-18 00:00",
        "title": "中国开放红利，在消博会随处可见",
        "description": "",
        "source": "中华国内",
        "picUrl": "https://img2.utuku.imgcdc.com/300x200/news/20260418/36f73471-a316-46d6-bd29-b4ea2700dd13.jpg",
        "url": "https://news.china.com/domestic/945/20260418/49427072.html"
    },
    {
        "id": "ec5fdddd80cbf1d0ddd75404713c4d1a",
        "ctime": "2026-04-18 00:00",
        "title": "春耕沃野 消费焕新 活力中国向新行",
        "description": "",
        "source": "中华国内",
        "picUrl": "https://img3.utuku.imgcdc.com/300x200/news/20260418/b918ce49-bee9-404e-8666-ed9761a52188.jpg",
        "url": "https://news.china.com/domestic/945/20260418/49427084.html"
    }
];

// 测试数据 - AI资讯
const testDataAI = [
    {
        "id": "6b5f6248abad27721c0b4b1276a7a101",
        "url": "https://www.admin5.com/article/20210203/985641.shtml",
        "ctime": "2021-02-03 14:56",
        "title": "亮风台与蕴硕物联达成战略合作，共同打造AR+工业互联网解决方案",
        "picUrl": "https://a5img.pncdn.cn/2021/0203/1612335399721.png?x-oss-process=image/resize,m_fixed,w_220,h_120",
        "source": "A5智能",
        "description": "A5智能"
    },
    {
        "id": "ce30a5a644ae602668e4041c5b2e1cad",
        "url": "https://www.admin5.com/article/20210202/985464.shtml",
        "ctime": "2021-02-02 09:37",
        "title": "粤云互联烽火台：应用性能全面监控，AI智能告警",
        "picUrl": "https://a5img.pncdn.cn/2021/0202/1612229820668.png?x-oss-process=image/resize,m_fixed,w_220,h_120",
        "source": "A5智能",
        "description": "A5智能"
    },
    {
        "id": "8fd61458381d65afe7e1cc87cdffc316",
        "url": "https://www.admin5.com/article/20210127/984931.shtml",
        "ctime": "2021-01-27 14:14",
        "title": "普渡机器人入驻傣妹火锅！科技赋能品牌升级",
        "picUrl": "https://a5img.pncdn.cn/2021/0127/1611728068143.png?x-oss-process=image/resize,m_fixed,w_220,h_120",
        "source": "A5智能",
        "description": "A5智能"
    }
];

// 显示错误信息
function showError(message) {
    newsContainer.innerHTML = `<p style="text-align: center; grid-column: 1 / -1; color: #d32f2f;">${message}</p>`;
}

// 初始化应用
init();