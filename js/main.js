document.addEventListener('DOMContentLoaded', () => {
    const upload = document.getElementById('upload');
    const userPhoto = document.getElementById('userPhoto');
    const placeholder = document.getElementById('placeholder');
    const controls = document.getElementById('controls');
    const downloadBtn = document.getElementById('downloadBtn');
    const captureArea = document.getElementById('captureArea');

    const zoomRange = document.getElementById('zoomRange');
    const zoomValue = document.getElementById('zoomValue');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const resetBtn = document.getElementById('resetBtn');

    let isDragging = false;
    let startX, startY;
    let posX = 0, posY = 0;
    let scale = 1;

    upload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                userPhoto.src = event.target.result;
                userPhoto.classList.remove('hidden');
                placeholder.classList.add('hidden');
                controls.classList.remove('hidden');
                downloadBtn.classList.remove('hidden');

                resetTransform();
            }
            reader.readAsDataURL(file);
        }
    });

    function updateTransform() {
        userPhoto.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
        zoomRange.value = scale;
        zoomValue.innerText = `${Math.round(scale * 100)}%`;
    }

    function resetTransform() {
        posX = 0;
        posY = 0;
        scale = 1;
        updateTransform();
    }

    zoomRange.addEventListener('input', (e) => {
        scale = parseFloat(e.target.value);
        updateTransform();
    });

    zoomInBtn.addEventListener('click', () => {
        if (scale < 3) {
            scale = Math.min(3, scale + 0.15);
            updateTransform();
        }
    });

    zoomOutBtn.addEventListener('click', () => {
        if (scale > 0.3) {
            scale = Math.max(0.3, scale - 0.15);
            updateTransform();
        }
    });

    resetBtn.addEventListener('click', resetTransform);

    captureArea.addEventListener('wheel', (e) => {
        if (userPhoto.classList.contains('hidden')) return;
        e.preventDefault();
        if (e.deltaY < 0) {
            scale = Math.min(3, scale + 0.05);
        } else {
            scale = Math.max(0.3, scale - 0.05);
        }
        updateTransform();
    }, { passive: false });

    captureArea.addEventListener('mousedown', (e) => {
        if (userPhoto.classList.contains('hidden')) return;
        isDragging = true;
        startX = e.clientX - posX;
        startY = e.clientY - posY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        posX = e.clientX - startX;
        posY = e.clientY - startY;
        updateTransform();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    captureArea.addEventListener('touchstart', (e) => {
        if (userPhoto.classList.contains('hidden')) return;
        isDragging = true;
        startX = e.touches[0].clientX - posX;
        startY = e.touches[0].clientY - posY;
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        posX = e.touches[0].clientX - startX;
        posY = e.touches[0].clientY - startY;
        updateTransform();
    });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    downloadBtn.addEventListener('click', function() {
        downloadBtn.innerText = "⏳ Memproses...";
        downloadBtn.disabled = true;

        html2canvas(captureArea, {
            useCORS: true,
            scale: 3 // Kualitas HD
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'twibbon-created-by-adam.png';
            link.href = canvas.toDataURL('image/png');
            link.click();

            downloadBtn.innerText = "⬇️ Unduh Twibbon";
            downloadBtn.disabled = false;
        }).catch(err => {
            console.error(err);
            alert("Gagal mengunduh twibbon.");
            downloadBtn.innerText = "⬇️ Unduh Twibbon";
            downloadBtn.disabled = false;
        });
    });
});