// 关键：使用 IIFE 封装，形成独立作用域，绝不污染全局
(function NovelModule() {
    // 等待 DOM 完全加载后再执行
    document.addEventListener('DOMContentLoaded', function() {
        // ===== 内部变量定义（全部是局部变量，不会冲突） =====
        const prevBtn = document.getElementById('prev');
        const nextBtn = document.getElementById('next');
        const slider = document.getElementById('slider');
        const chapters = document.querySelectorAll('.chapter');
        const draggable = document.getElementById('draggable');
        
        if (!prevBtn || !draggable) return; // 防止节点不存在报错
        let currentIndex = 1;
        const totalChapters = chapters.length;
        
        let isDragging = false;
        let startX, startY;
        let initialX = 0, initialY = 0;
        // ===== 核心函数 =====
        function updateUI() {
            chapters.forEach(ch => ch.classList.remove('active'));
            const activeChap = document.querySelector(`.chapter[data-index="${currentIndex}"]`);
            if (activeChap) {
                activeChap.classList.add('active');
                activeChap.scrollTop = 0;
            }
            // 已删除：章节页数显示代码
            prevBtn.disabled = currentIndex <= 1;
            nextBtn.disabled = currentIndex >= totalChapters;
        }
        // ===== 按钮事件 =====
        prevBtn.onclick = () => { if (currentIndex > 1) currentIndex--; updateUI(); };
        nextBtn.onclick = () => { if (currentIndex < totalChapters) currentIndex++; updateUI(); };
        // ===== 滑动切章（修复：只在 slider 上监听，不阻止全局） =====
        let touchStartX = 0;
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });
        slider.addEventListener('touchend', (e) => {
            const diffX = touchStartX - e.changedTouches[0].clientX;
            if (diffX > 50 && currentIndex < totalChapters) currentIndex++;
            else if (diffX < -50 && currentIndex > 1) currentIndex--;
            updateUI();
        });
        function drag(e) {
            if (!isDragging) return;
            // 关键修复：删除了 e.preventDefault(); 
            // 这行代码是导致消消乐点击无效的元凶！
            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            
            initialX = clientX - startX;
            initialY = clientY - startY;
            draggable.style.transform = `translate(${initialX}px, ${initialY}px)`;
        }
        function endDrag() {
            isDragging = false;
            draggable.style.cursor = 'move';
        }
        // ===== 初始化 =====
        updateUI();
    });
})(); // 立即执行，隔离作用域