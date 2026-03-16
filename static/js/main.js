// 株式会社 関造園サイト - メインJavaScript

document.addEventListener('DOMContentLoaded', function() {
    // モバイルメニュートグル
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // スクロールアニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // アニメーション対象要素の設定
    const animateElements = document.querySelectorAll('.service-card, .work-card, .news-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ライトボックス機能
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const beforeAfterImages = document.querySelectorAll('.before-after-item img');

    if (galleryImages.length > 0 || beforeAfterImages.length > 0) {
        // ライトボックスのHTML要素を作成
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="閉じる">×</button>
            <button class="lightbox-nav lightbox-prev" aria-label="前の画像">‹</button>
            <button class="lightbox-nav lightbox-next" aria-label="次の画像">›</button>
            <div class="lightbox-content">
                <img class="lightbox-image" src="" alt="">
            </div>
            <div class="lightbox-counter"></div>
        `;
        document.body.appendChild(lightbox);

        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const counter = lightbox.querySelector('.lightbox-counter');

        let currentIndex = 0;
        const images = Array.from(galleryImages);

        // ズーム機能の変数
        let isZoomed = false;
        let scale = 1;
        let translateX = 0;
        let translateY = 0;
        let isDragging = false;
        let startX = 0;
        let startY = 0;

        // 画像を開く関数
        function openLightbox(index) {
            currentIndex = index;
            lightboxImage.src = images[currentIndex].src;
            lightboxImage.alt = images[currentIndex].alt;
            counter.textContent = `${currentIndex + 1} / ${images.length}`;

            // ズーム状態をリセット
            resetZoom();

            // ナビゲーションボタンの表示制御
            if (images.length <= 1) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                counter.style.display = 'none';
            } else {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
                counter.style.display = 'block';
            }

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // ズームをリセット
        function resetZoom() {
            isZoomed = false;
            scale = 1;
            translateX = 0;
            translateY = 0;
            updateImageTransform();
            lightboxImage.style.cursor = 'zoom-in';
        }

        // 画像のトランスフォームを更新
        function updateImageTransform() {
            lightboxImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
            lightboxImage.style.transition = isDragging ? 'none' : 'transform 0.3s ease';
        }

        // ライトボックスを閉じる関数
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        // 前の画像へ
        function showPrevImage() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            openLightbox(currentIndex);
        }

        // 次の画像へ
        function showNextImage() {
            currentIndex = (currentIndex + 1) % images.length;
            openLightbox(currentIndex);
        }

        // ダブルクリックでズーム
        lightboxImage.addEventListener('dblclick', (e) => {
            e.stopPropagation();

            if (!isZoomed) {
                // ズームイン
                scale = 2.5;
                isZoomed = true;
                lightboxImage.style.cursor = 'zoom-out';

                // クリック位置を中心にズーム
                const rect = lightboxImage.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                translateX = -x * 0.3;
                translateY = -y * 0.3;
            } else {
                // ズームアウト
                resetZoom();
            }

            updateImageTransform();
        });

        // マウスドラッグでパン（ズーム時のみ）
        lightboxImage.addEventListener('mousedown', (e) => {
            if (!isZoomed) return;
            e.preventDefault();
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            lightboxImage.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateImageTransform();
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            lightboxImage.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
        });

        // タッチドラッグでパン（モバイル、ズーム時のみ）
        let touchDragStartX = 0;
        let touchDragStartY = 0;

        lightboxImage.addEventListener('touchstart', (e) => {
            if (!isZoomed || e.touches.length !== 1) return;
            const touch = e.touches[0];
            touchDragStartX = touch.clientX - translateX;
            touchDragStartY = touch.clientY - translateY;
        });

        lightboxImage.addEventListener('touchmove', (e) => {
            if (!isZoomed || e.touches.length !== 1) return;
            e.preventDefault();
            const touch = e.touches[0];
            translateX = touch.clientX - touchDragStartX;
            translateY = touch.clientY - touchDragStartY;
            isDragging = true;
            updateImageTransform();
        });

        lightboxImage.addEventListener('touchend', () => {
            isDragging = false;
        });

        // ギャラリー画像にクリックイベントを設定
        galleryImages.forEach((img, index) => {
            img.parentElement.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        // 閉じるボタン
        closeBtn.addEventListener('click', closeLightbox);

        // 背景クリックで閉じる
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // ナビゲーションボタン
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrevImage();
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextImage();
        });

        // キーボード操作
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    if (images.length > 1) showPrevImage();
                    break;
                case 'ArrowRight':
                    if (images.length > 1) showNextImage();
                    break;
            }
        });

        // タッチスワイプ対応（モバイル）
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            // ズーム中はスワイプを無効
            if (isZoomed) return;

            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0 && images.length > 1) {
                    // 左スワイプ：次の画像
                    showNextImage();
                } else if (diff < 0 && images.length > 1) {
                    // 右スワイプ：前の画像
                    showPrevImage();
                }
            }
        }

        // ビフォーアフター画像用のライトボックス（横移動なし）
        beforeAfterImages.forEach((img) => {
            img.parentElement.addEventListener('click', (e) => {
                e.preventDefault();

                // 元のギャラリー画像配列を保存
                const originalImages = [...images];

                // 画像配列を一時的にこの1枚だけに置き換え
                images.length = 0;
                images.push(img);

                // ライトボックスを開く（images.length=1でナビゲーション自動非表示）
                openLightbox(0);

                // ライトボックスが閉じられたら元の配列に戻す
                const restoreOriginalImages = () => {
                    setTimeout(() => {
                        images.length = 0;
                        images.push(...originalImages);
                    }, 100);
                };

                // 閉じるイベントをリッスン
                lightbox.addEventListener('transitionend', function onClose() {
                    if (!lightbox.classList.contains('active')) {
                        restoreOriginalImages();
                        lightbox.removeEventListener('transitionend', onClose);
                    }
                });
            });
        });
    }
});
