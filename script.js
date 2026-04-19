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
    },
    huabian: {
        url: 'https://apis.tianapi.com/huabian/index',
        type: 'newslist'
    },
    internet: {
        url: 'https://apis.tianapi.com/internet/index',
        type: 'newslist'
    }
};

let currentCategory = 'internet';
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
            if (category !== currentCategory) {
                currentCategory = category;
                updateCategoryButtons(this);
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
    
    const config = API_CONFIG[currentCategory];
    if (!config) {
        showError('无效的分类');
        isLoading = false;
        loadingElement.style.display = 'none';
        return;
    }
    
    try {
        const response = await axios({
            method: 'post',
            url: config.url,
            data: `key=${API_KEY}&num=30`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        if (response.data.code === 200 && response.data.result) {
            if (config.type === 'newslist') {
                let newsList = response.data.result.newslist || response.data.result.list;
                if (newsList && newsList.length > 0) {
                    renderNews(newsList);
                } else {
                    showError('新闻数据格式错误');
                    if (currentCategory === 'ai') {
                        renderNews(testDataAI);
                    } else if (currentCategory === 'huabian') {
                        renderNews(testDataHuabian);
                    } else if (currentCategory === 'internet') {
                        renderNews(testDataInternet);
                    } else {
                        renderNews(testDataGuonei);
                    }
                }
            }
        } else {
            showError(`获取数据失败: ${response.data.msg || '未知错误'}`);
            if (config.type === 'newslist') {
                if (currentCategory === 'ai') {
                    renderNews(testDataAI);
                } else if (currentCategory === 'huabian') {
                    renderNews(testDataHuabian);
                } else if (currentCategory === 'internet') {
                    renderNews(testDataInternet);
                } else {
                    renderNews(testDataGuonei);
                }
            }
        }
    } catch (error) {
        showError(`网络错误: ${error.message || '未知错误'}`);
        if (config.type === 'newslist') {
            if (currentCategory === 'ai') {
                renderNews(testDataAI);
            } else if (currentCategory === 'huabian') {
                renderNews(testDataHuabian);
            } else if (currentCategory === 'internet') {
                renderNews(testDataInternet);
            } else {
                renderNews(testDataGuonei);
            }
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
        newsItem.style.cursor = 'pointer';
        newsItem.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        
        // 添加点击事件
        newsItem.addEventListener('click', function() {
            window.open(news.url, '_blank', 'noopener,noreferrer');
        });
        
        // 鼠标悬停效果
        newsItem.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });
        
        newsItem.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });
        
        const defaultImage = '';
        const imageUrl = news.picUrl || defaultImage;
        
        const imageHtml = `<img src="${imageUrl}" alt="${news.title}" class="news-image">`;
        
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

// 测试数据 - 娱乐新闻
const testDataHuabian = [
    {
        "id": "8b4fbf4a76de6b4625e6480e972b8a9d",
        "ctime": "2026-04-19 08:30",
        "title": "她没靠颜值没靠关系，39岁凭实力杀进央视春晚，打脸所有质疑者",
        "description": "",
        "source": "网易明星",
        "picUrl": "https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2026%2F0418%2Fbe2ef9a0j00tdoo9b002qd000mh00vim.jpg&thumbnail=130y90&quality=100&type=jpg",
        "url": "https://www.163.com/dy/article/KQQJRVH005529WGR.html"
    },
    {
        "id": "2819fe67688df8a5ba47374bc5e75921",
        "ctime": "2026-04-19 07:55",
        "title": "1995年，邓丽君去世，成龙未参加葬礼，巩俐送花圈：永远的歌迷",
        "description": "",
        "source": "网易明星",
        "picUrl": "https://nimg.ws.126.net/?url=http%3A%2F%2Fbjnewsrec-cv.ws.126.net%2Flittle777994fb19bj00tdbwkj002bd000r400xrp.jpg&thumbnail=130y90&quality=100&type=jpg",
        "url": "https://www.163.com/dy/article/KQ8ROAA00543E35G.html"
    },
    {
        "id": "b50eb83c728de89e795d571de9804bee",
        "ctime": "2026-04-19 01:04",
        "title": "热搜爆一！何润东再扮项羽鼓舞宿迁队碾压零封南京队",
        "description": "",
        "source": "网易明星",
        "picUrl": "https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2026%2F0419%2F13debef0j00tdp8qr001sd000s300byg.jpg&thumbnail=130y90&quality=100&type=jpg",
        "url": "https://www.163.com/dy/article/KQRD5OH30553BELO.html"
    }
];

// 测试数据 - 互联网资讯
const testDataInternet = [
    {
        "id": "534fb24871a32ceaf865040eb228e040",
        "ctime": "2026-04-19 11:29",
        "title": "36亿元巨额罚单 7大平台因幽灵外卖被罚",
        "description": "",
        "source": "网易互联网",
        "picUrl": "https://nimg.ws.126.net/?url=http%3A%2F%2Fbjnewsrec-cv.ws.126.net%2Flittle34094b4c1c4j00tdpv70001ad200u000aug014000eg.jpg&thumbnail=200y140&quality=100&type=jpg",
        "url": "https://www.163.com/dy/article/KQSGUH210514EGPO.html"
    },
    {
        "id": "40d5d1fb3e4527375feccba85ed9610a",
        "ctime": "2026-04-19 09:09",
        "title": "百万Token白烧？Claude官方下场：5招治好上下文",
        "description": "",
        "source": "网易互联网",
        "picUrl": "https://nimg.ws.126.net/?url=http%3A%2F%2Fbjnewsrec-cv.ws.126.net%2Flittle34094b4c1c4j00tdpv70001ad200u000aug014000eg.jpg&thumbnail=200y140&quality=100&type=jpg",
        "url": "https://www.163.com/dy/article/KQS8TSI60511ABV6.html"
    },
    {
        "id": "8a94368750252d164b8f6dfd685b953c",
        "ctime": "2026-04-18 23:26",
        "title": "57岁雷军拼了！从北京到上海直播近15个小时回击",
        "description": "",
        "source": "网易互联网",
        "picUrl": "https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2026%2F0418%2F554a492cj00tdp3xw0015d000j600asm.jpg&thumbnail=200y140&quality=100&type=jpg",
        "url": "https://www.163.com/dy/article/KQR722E20539ARRF.html"
    }
];

// 测试数据 - AI资讯
const testDataAI = [
    {
        "id": "418233fad22c81777ab41f4ced70095e",
        "ctime": "2026-04-18 11:00",
        "title": "消息称马斯克 xAI 进军 AI 智能编程领域，有望下周发布 Grok Build",
        "description": "科技媒体testingcatalog昨日（4月17日）发布博文，报道称埃隆·马斯克（ElonMusk）旗下xAI公司有望进军智能编程领域，会在近期推出GrokBuild与GrokCLI两款产品。",
        "source": "IT家人工智能",
        "picUrl": "https://img.ithome.com/newsuploadfiles/thumbnail/2026/4/940638_240.jpg?x-bce-process=image/format,f_auto",
        "url": "https://www.ithome.com/0/940/638.htm"
    },
    {
        "id": "4a7a869dc54f27e6cb728f4bd8c152ba",
        "ctime": "2026-04-18 10:00",
        "title": "Cloudflare 公测邮件服务，AI 智能体可原生收发邮件",
        "description": "Cloudflare于4月16日发布公告，宣布其邮件服务进入公开测试阶段，为AI智能体提供原生邮件收发能力。",
        "source": "IT家人工智能",
        "picUrl": "https://img.ithome.com/newsuploadfiles/thumbnail/2026/4/940627_240.jpg?x-bce-process=image/format,f_auto",
        "url": "https://www.ithome.com/0/940/627.htm"
    },
    {
        "id": "d9abf6b00648a80145eec1489228aab1",
        "ctime": "2026-04-18 10:00",
        "title": "消息称 Meta 下月启动首轮大裁员，10% 员工成 AI 发展“牺牲品”",
        "description": "其中一位知情人士表示，首轮裁员规模约为全球员工总数的10%，接近8000人。",
        "source": "IT家人工智能",
        "picUrl": "https://img.ithome.com/newsuploadfiles/thumbnail/2026/4/940628_240.jpg?x-bce-process=image/format,f_auto",
        "url": "https://www.ithome.com/0/940/628.htm"
    }
];

// 显示错误信息
function showError(message) {
    newsContainer.innerHTML = `<p style="text-align: center; grid-column: 1 / -1; color: #d32f2f;">${message}</p>`;
}

// 初始化应用
init();