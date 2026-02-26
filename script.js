document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('crosshairCanvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('canvasContainer');

    // Configuration State
    const config = {
        color: '#00ff00',
        centerDot: {
            enabled: true,
            opacity: 1.0,
            thickness: 2
        },
        outline: {
            enabled: true,
            opacity: 0.5,
            thickness: 1
        },
        inner: {
            enabled: true,
            opacity: 1.0,
            length: 6,
            thickness: 2,
            offset: 3,
            rotation: 0
        },
        outer: {
            enabled: true,
            opacity: 0.35,
            length: 2,
            thickness: 2,
            offset: 10,
            rotation: 0
        }
    };

    // DOM Elements Mapping
    const inputs = {
        color: document.getElementById('crosshairColor'),
        colorHex: document.getElementById('colorHex'),
        
        centerDot: {
            enabled: document.getElementById('showCenterDot'),
            opacity: document.getElementById('centerDotOpacity'),
            opacityNum: document.getElementById('centerDotOpacityNum'),
            thickness: document.getElementById('centerDotThickness'),
            thicknessNum: document.getElementById('centerDotThicknessNum')
        },
        outline: {
            enabled: document.getElementById('showOutline'),
            opacity: document.getElementById('outlineOpacity'),
            opacityNum: document.getElementById('outlineOpacityNum'),
            thickness: document.getElementById('outlineThickness'),
            thicknessNum: document.getElementById('outlineThicknessNum')
        },
        inner: {
            enabled: document.getElementById('showInnerLines'),
            opacity: document.getElementById('innerOpacity'),
            opacityNum: document.getElementById('innerOpacityNum'),
            length: document.getElementById('innerLength'),
            lengthNum: document.getElementById('innerLengthNum'),
            thickness: document.getElementById('innerThickness'),
            thicknessNum: document.getElementById('innerThicknessNum'),
            offset: document.getElementById('innerOffset'),
            offsetNum: document.getElementById('innerOffsetNum'),
            rotation: document.getElementById('innerRotation'),
            rotationNum: document.getElementById('innerRotationNum')
        },
        outer: {
            enabled: document.getElementById('showOuterLines'),
            opacity: document.getElementById('outerOpacity'),
            opacityNum: document.getElementById('outerOpacityNum'),
            length: document.getElementById('outerLength'),
            lengthNum: document.getElementById('outerLengthNum'),
            thickness: document.getElementById('outerThickness'),
            thicknessNum: document.getElementById('outerThicknessNum'),
            offset: document.getElementById('outerOffset'),
            offsetNum: document.getElementById('outerOffsetNum'),
            rotation: document.getElementById('outerRotation'),
            rotationNum: document.getElementById('outerRotationNum')
        }
    };

    // Initialize Event Listeners
    function initListeners() {
        // Color
        inputs.color.addEventListener('input', (e) => {
            config.color = e.target.value;
            inputs.colorHex.textContent = e.target.value;
            draw();
        });

        // Center Dot
        bindCheckbox(inputs.centerDot.enabled, config.centerDot, 'enabled');
        bindSlider(inputs.centerDot.opacity, inputs.centerDot.opacityNum, config.centerDot, 'opacity');
        bindSlider(inputs.centerDot.thickness, inputs.centerDot.thicknessNum, config.centerDot, 'thickness');

        // Outline
        bindCheckbox(inputs.outline.enabled, config.outline, 'enabled');
        bindSlider(inputs.outline.opacity, inputs.outline.opacityNum, config.outline, 'opacity');
        bindSlider(inputs.outline.thickness, inputs.outline.thicknessNum, config.outline, 'thickness');

        // Inner Lines
        bindCheckbox(inputs.inner.enabled, config.inner, 'enabled');
        bindSlider(inputs.inner.opacity, inputs.inner.opacityNum, config.inner, 'opacity');
        bindSlider(inputs.inner.length, inputs.inner.lengthNum, config.inner, 'length');
        bindSlider(inputs.inner.thickness, inputs.inner.thicknessNum, config.inner, 'thickness');
        bindSlider(inputs.inner.offset, inputs.inner.offsetNum, config.inner, 'offset');
        bindSlider(inputs.inner.rotation, inputs.inner.rotationNum, config.inner, 'rotation');

        // Outer Lines
        bindCheckbox(inputs.outer.enabled, config.outer, 'enabled');
        bindSlider(inputs.outer.opacity, inputs.outer.opacityNum, config.outer, 'opacity');
        bindSlider(inputs.outer.length, inputs.outer.lengthNum, config.outer, 'length');
        bindSlider(inputs.outer.thickness, inputs.outer.thicknessNum, config.outer, 'thickness');
        bindSlider(inputs.outer.offset, inputs.outer.offsetNum, config.outer, 'offset');
        bindSlider(inputs.outer.rotation, inputs.outer.rotationNum, config.outer, 'rotation');

        // Accordion
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('active');
            });
        });

        // Background Controls
        document.querySelectorAll('.bg-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                const type = e.target.dataset.bg;
                if (type === 'image') {
                    document.getElementById('bgImageInput').click();
                } else {
                    setCanvasBackground(type);
                }
            });
        });

        document.getElementById('bgImageInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    container.style.background = `url(${event.target.result}) center/cover no-repeat`;
                };
                reader.readAsDataURL(file);
            }
        });

        // Export & Import
        document.getElementById('downloadBtn').addEventListener('click', downloadPNG);
        document.getElementById('copyCodeBtn').addEventListener('click', copyConfig);
        document.getElementById('importCodeBtn').addEventListener('click', importConfig);
    }

    function bindSlider(rangeInput, numInput, obj, key) {
        // Range -> State & Num
        rangeInput.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            obj[key] = val;
            if (numInput) numInput.value = val;
            draw();
        });

        // Num -> State & Range
        if (numInput) {
            numInput.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                obj[key] = val;
                rangeInput.value = val;
                draw();
            });
        }
    }

    function bindCheckbox(element, obj, key) {
        element.addEventListener('change', (e) => {
            obj[key] = e.target.checked;
            draw();
        });
    }

    function setCanvasBackground(type) {
        container.style.backgroundImage = '';
        container.style.backgroundColor = '';
        container.className = 'canvas-container'; 

        switch(type) {
            case 'grid':
                container.classList.add('bg-grid');
                break;
            case 'dark':
                container.classList.add('bg-dark');
                break;
            case 'light':
                container.classList.add('bg-light');
                break;
        }
    }

    function draw() {
        renderScene(ctx, canvas.width, canvas.height, 1);
    }

    function renderScene(targetCtx, w, h, scale = 1) {
        targetCtx.clearRect(0, 0, w, h);
        const cx = w / 2;
        const cy = h / 2;

        const getRGBA = (hex, alpha) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        // 1. Draw Outlines
        if (config.outline.enabled) {
            const outlineColor = `rgba(0, 0, 0, ${config.outline.opacity})`;
            const oThick = config.outline.thickness * scale;

            if (config.centerDot.enabled) {
                const size = config.centerDot.thickness * scale;
                targetCtx.fillStyle = outlineColor;
                targetCtx.fillRect(cx - size/2 - oThick, cy - size/2 - oThick, size + oThick*2, size + oThick*2);
            }
            if (config.inner.enabled) drawGroupOutline(targetCtx, cx, cy, config.inner, outlineColor, oThick, scale);
            if (config.outer.enabled) drawGroupOutline(targetCtx, cx, cy, config.outer, outlineColor, oThick, scale);
        }

        // 2. Draw Fills
        const fillColor = config.color;
        if (config.centerDot.enabled) {
            const size = config.centerDot.thickness * scale;
            targetCtx.fillStyle = getRGBA(fillColor, config.centerDot.opacity);
            targetCtx.fillRect(cx - size/2, cy - size/2, size, size);
        }
        if (config.inner.enabled) drawGroupFill(targetCtx, cx, cy, config.inner, fillColor, scale);
        if (config.outer.enabled) drawGroupFill(targetCtx, cx, cy, config.outer, fillColor, scale);
    }

    function drawGroupOutline(ctx, cx, cy, group, color, oThick, scale) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(group.rotation * Math.PI / 180);
        ctx.fillStyle = color;
        for (let i = 0; i < 4; i++) {
            ctx.rotate(90 * Math.PI / 180);
            const offset = group.offset * scale;
            const length = group.length * scale;
            const thickness = group.thickness * scale;
            ctx.fillRect(offset - oThick, -thickness / 2 - oThick, length + oThick * 2, thickness + oThick * 2);
        }
        ctx.restore();
    }

    function drawGroupFill(ctx, cx, cy, group, hexColor, scale) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(group.rotation * Math.PI / 180);
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${group.opacity})`;
        for (let i = 0; i < 4; i++) {
            ctx.rotate(90 * Math.PI / 180);
            const offset = group.offset * scale;
            const length = group.length * scale;
            const thickness = group.thickness * scale;
            ctx.fillRect(offset, -thickness / 2, length, thickness);
        }
        ctx.restore();
    }

    // History Management
    const historyPanel = document.getElementById('historyPanel');
    const historyBtn = document.getElementById('historyBtn');
    const closeHistoryBtn = document.getElementById('closeHistoryBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const historyGrid = document.getElementById('historyGrid');
    const STORAGE_KEY = 'crosshair_history';

    function initHistory() {
        historyBtn.addEventListener('click', () => {
            historyPanel.classList.toggle('active');
            renderHistory();
        });

        closeHistoryBtn.addEventListener('click', () => {
            historyPanel.classList.remove('active');
        });

        clearHistoryBtn.addEventListener('click', () => {
            if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
                localStorage.removeItem(STORAGE_KEY);
                renderHistory();
            }
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!historyPanel.contains(e.target) && !historyBtn.contains(e.target)) {
                historyPanel.classList.remove('active');
            }
        });
    }

    function saveToHistory(currentConfig) {
        let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        
        // Avoid duplicates (simple check)
        const currentStr = JSON.stringify(currentConfig);
        if (history.length > 0 && JSON.stringify(history[0].config) === currentStr) {
            return; // Don't save if identical to latest
        }

        // Generate thumbnail
        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = 100;
        thumbCanvas.height = 100;
        const thumbCtx = thumbCanvas.getContext('2d');
        
        // Render crosshair for thumbnail (scaled to fit)
        // We use a small scale to make it visible
        // Assuming default view is 800x600, scaling to 100x100
        // But we want the crosshair to fill the thumbnail properly
        // Let's render it centered with scale=1 (or slightly adjusted if needed)
        renderScene(thumbCtx, 100, 100, 1);

        const thumbData = thumbCanvas.toDataURL('image/png');

        history.unshift({
            timestamp: Date.now(),
            config: JSON.parse(currentStr),
            thumbnail: thumbData
        });

        // Limit to 10 items
        if (history.length > 10) history = history.slice(0, 10);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        renderHistory();
    }

    function deleteFromHistory(index) {
        let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        history.splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        historyGrid.innerHTML = '';

        if (history.length === 0) {
            historyGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 20px;">暂无历史记录</p>';
            return;
        }

        history.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            
            const img = document.createElement('img');
            img.src = item.thumbnail;
            img.alt = `History ${index}`;
            
            const delBtn = document.createElement('button');
            delBtn.className = 'history-delete';
            delBtn.innerHTML = '<i class="fas fa-trash"></i>';
            delBtn.onclick = (e) => {
                e.stopPropagation();
                if(confirm('确定删除此记录吗？')) {
                    deleteFromHistory(index);
                }
            };

            div.onclick = () => {
                loadConfig(item.config);
                historyPanel.classList.remove('active');
            };

            div.appendChild(img);
            div.appendChild(delBtn);
            historyGrid.appendChild(div);
        });
    }

    function updateUI() {
        // Color
        if (inputs.color) inputs.color.value = config.color;
        if (inputs.colorHex) inputs.colorHex.textContent = config.color;

        // Center Dot
        if (inputs.centerDot.enabled) inputs.centerDot.enabled.checked = config.centerDot.enabled;
        if (inputs.centerDot.opacity) inputs.centerDot.opacity.value = config.centerDot.opacity;
        if (inputs.centerDot.opacityNum) inputs.centerDot.opacityNum.value = config.centerDot.opacity;
        if (inputs.centerDot.thickness) inputs.centerDot.thickness.value = config.centerDot.thickness;
        if (inputs.centerDot.thicknessNum) inputs.centerDot.thicknessNum.value = config.centerDot.thickness;

        // Outline
        if (inputs.outline.enabled) inputs.outline.enabled.checked = config.outline.enabled;
        if (inputs.outline.opacity) inputs.outline.opacity.value = config.outline.opacity;
        if (inputs.outline.opacityNum) inputs.outline.opacityNum.value = config.outline.opacity;
        if (inputs.outline.thickness) inputs.outline.thickness.value = config.outline.thickness;
        if (inputs.outline.thicknessNum) inputs.outline.thicknessNum.value = config.outline.thickness;

        // Inner Lines
        if (inputs.inner.enabled) inputs.inner.enabled.checked = config.inner.enabled;
        if (inputs.inner.opacity) inputs.inner.opacity.value = config.inner.opacity;
        if (inputs.inner.opacityNum) inputs.inner.opacityNum.value = config.inner.opacity;
        if (inputs.inner.length) inputs.inner.length.value = config.inner.length;
        if (inputs.inner.lengthNum) inputs.inner.lengthNum.value = config.inner.length;
        if (inputs.inner.thickness) inputs.inner.thickness.value = config.inner.thickness;
        if (inputs.inner.thicknessNum) inputs.inner.thicknessNum.value = config.inner.thickness;
        if (inputs.inner.offset) inputs.inner.offset.value = config.inner.offset;
        if (inputs.inner.offsetNum) inputs.inner.offsetNum.value = config.inner.offset;
        if (inputs.inner.rotation) inputs.inner.rotation.value = config.inner.rotation;
        if (inputs.inner.rotationNum) inputs.inner.rotationNum.value = config.inner.rotation;

        // Outer Lines
        if (inputs.outer.enabled) inputs.outer.enabled.checked = config.outer.enabled;
        if (inputs.outer.opacity) inputs.outer.opacity.value = config.outer.opacity;
        if (inputs.outer.opacityNum) inputs.outer.opacityNum.value = config.outer.opacity;
        if (inputs.outer.length) inputs.outer.length.value = config.outer.length;
        if (inputs.outer.lengthNum) inputs.outer.lengthNum.value = config.outer.length;
        if (inputs.outer.thickness) inputs.outer.thickness.value = config.outer.thickness;
        if (inputs.outer.thicknessNum) inputs.outer.thicknessNum.value = config.outer.thickness;
        if (inputs.outer.offset) inputs.outer.offset.value = config.outer.offset;
        if (inputs.outer.offsetNum) inputs.outer.offsetNum.value = config.outer.offset;
        if (inputs.outer.rotation) inputs.outer.rotation.value = config.outer.rotation;
        if (inputs.outer.rotationNum) inputs.outer.rotationNum.value = config.outer.rotation;
    }

    function loadConfig(newConfig) {
        // Deep merge safely
        if (newConfig.color) config.color = newConfig.color;
        if (newConfig.centerDot) Object.assign(config.centerDot, newConfig.centerDot);
        if (newConfig.outline) Object.assign(config.outline, newConfig.outline);
        if (newConfig.inner) Object.assign(config.inner, newConfig.inner);
        if (newConfig.outer) Object.assign(config.outer, newConfig.outer);
        
        updateUI();
        draw();
    }

    function downloadPNG() {
        const sizeInput = document.getElementById('exportSize');
        const scaleInput = document.getElementById('exportScale');
        
        let size = 100;
        let scale = 1;

        if (sizeInput) {
            size = parseInt(sizeInput.value) || 100;
            if (size < 16) size = 16;
        }
        
        if (scaleInput) {
            scale = parseFloat(scaleInput.value) || 1;
            if (scale < 0.1) scale = 0.1;
        }

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = size;
        tempCanvas.height = size;
        const tCtx = tempCanvas.getContext('2d');
        
        renderScene(tCtx, size, size, scale);
        
        // Save to history when exporting
        saveToHistory(config);
        
        const link = document.createElement('a');
        link.download = `crosshair_${size}x${size}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    }

    function copyConfig() {
        const code = JSON.stringify(config, null, 2);
        navigator.clipboard.writeText(code).then(() => {
            alert('配置代码已复制到剪贴板！');
        });
        saveToHistory(config); // Save on copy too
    }

    function importConfig() {
        const code = prompt("请输入配置代码 (JSON格式):");
        if (!code) return;
        
        try {
            const newConfig = JSON.parse(code);
            
            // Deep merge safely
            if (newConfig.color) config.color = newConfig.color;
            if (newConfig.centerDot) Object.assign(config.centerDot, newConfig.centerDot);
            if (newConfig.outline) Object.assign(config.outline, newConfig.outline);
            if (newConfig.inner) Object.assign(config.inner, newConfig.inner);
            if (newConfig.outer) Object.assign(config.outer, newConfig.outer);
            
            updateUI();
            draw();
            saveToHistory(config); // Save on import
            alert("配置已导入！");
        } catch (e) {
            alert("配置代码无效，请确保格式正确！");
            console.error(e);
        }
    }

    // Initial draw
    setCanvasBackground('grid');
    draw();
    initListeners();
    initHistory();

    // Save history on page unload
    window.addEventListener('beforeunload', () => {
        saveToHistory(config);
    });
});
