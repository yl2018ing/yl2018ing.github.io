document.addEventListener('DOMContentLoaded', function () {
    const toggleSidebarButton = document.getElementById('toggle-sidebar');
    const toggleSearchButton = document.getElementById('toggle-search');
    const addBookmarkButton = document.getElementById('add-bookmark');
    const searchBox = document.getElementById('search-box');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const nightModeButton = document.getElementById('night-mode');
    const fontSizeSelect = document.getElementById('font-size');
    const chapterContent = document.getElementById('chapter-content');
    const bookmarkList = document.getElementById('bookmark-list');
    const loadMoreButton = document.getElementById('load-more');
    const chapterList = document.getElementById('chapter-list');

    let currentPage = 1;
    const pages = document.querySelectorAll('.page');

    // 初始化显示第一页
    showPage(currentPage);

    // 侧边栏切换
    toggleSidebarButton.addEventListener('click', function () {
        sidebar.classList.toggle('active');
        content.classList.toggle('sidebar-active');
    });

    // 搜索框切换
    toggleSearchButton.addEventListener('click', function () {
        searchBox.parentElement.classList.toggle('active');
    });

    // 夜间模式切换
    nightModeButton.addEventListener('click', function () {
        document.body.classList.toggle('night-mode');
    });

    // 字体大小调整
    fontSizeSelect.addEventListener('change', function () {
        const fontSize = this.value;
        document.querySelectorAll('.page p').forEach(p => {
            p.style.fontSize = fontSize;
        });
    });

    // 搜索功能
    searchBox.addEventListener('input', function () {
        const searchText = this.value.trim();
        if (searchText) {
            const regex = new RegExp(searchText, 'gi');
            chapterContent.innerHTML = chapterContent.innerHTML.replace(/<span class="highlight">(.*?)<\/span>/g, '$1');
            chapterContent.innerHTML = chapterContent.innerHTML.replace(regex, '<span class="highlight">$&</span>');
        } else {
            chapterContent.innerHTML = chapterContent.innerHTML.replace(/<span class="highlight">(.*?)<\/span>/g, '$1');
        }
    });

    // 添加书签
    addBookmarkButton.addEventListener('click', function () {
        const currentScrollPosition = window.scrollY;
        const bookmarkItem = document.createElement('li');
        bookmarkItem.innerHTML = `<a href="#" data-position="${currentScrollPosition}">书签 ${bookmarkList.children.length + 1}</a>`;
        bookmarkList.appendChild(bookmarkItem);

        // 点击书签跳转
        bookmarkItem.querySelector('a').addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo(0, parseInt(this.dataset.position));
        });
    });

    // 加载更多内容
    loadMoreButton.addEventListener('click', function () {
        currentPage++;
        if (currentPage <= pages.length) {
            showPage(currentPage);
        } else {
            loadMoreButton.disabled = true;
            loadMoreButton.textContent = '没有更多内容';
        }
    });

    // 显示指定分页
    function showPage(pageNumber) {
        pages.forEach(page => page.classList.remove('active'));
        pages[pageNumber - 1].classList.add('active');
    }

    // 保存阅读进度、侧边栏状态、书签和当前分页
    window.addEventListener('beforeunload', function () {
        localStorage.setItem('scrollPosition', window.scrollY);
        localStorage.setItem('sidebarState', sidebar.classList.contains('active') ? 'open' : 'closed');
        localStorage.setItem('bookmarks', bookmarkList.innerHTML);
        localStorage.setItem('currentPage', currentPage);
    });

    // 恢复阅读进度、侧边栏状态、书签和当前分页
    const savedPosition = localStorage.getItem('scrollPosition');
    const sidebarState = localStorage.getItem('sidebarState');
    const savedBookmarks = localStorage.getItem('bookmarks');
    const savedPage = localStorage.getItem('currentPage');
    if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition));
    }
    if (sidebarState === 'open') {
        sidebar.classList.add('active');
        content.classList.add('sidebar-active');
    }
    if (savedBookmarks) {
        bookmarkList.innerHTML = savedBookmarks;
        bookmarkList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                window.scrollTo(0, parseInt(this.dataset.position));
            });
        });
    }
    if (savedPage) {
        currentPage = parseInt(savedPage);
        showPage(currentPage);
    }
});