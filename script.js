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
            locked: true,
            length: 6,
            thickness: 2,
            offset: 3,
            rotation: 0,
            lengthTop: 6, lengthRight: 6, lengthBottom: 6, lengthLeft: 6,
            thicknessTop: 2, thicknessRight: 2, thicknessBottom: 2, thicknessLeft: 2,
            offsetTop: 3, offsetRight: 3, offsetBottom: 3, offsetLeft: 3
        },
        outer: {
            enabled: true,
            opacity: 0.35,
            locked: true,
            length: 2,
            thickness: 2,
            offset: 10,
            rotation: 0,
            lengthTop: 2, lengthRight: 2, lengthBottom: 2, lengthLeft: 2,
            thicknessTop: 2, thicknessRight: 2, thicknessBottom: 2, thicknessLeft: 2,
            offsetTop: 10, offsetRight: 10, offsetBottom: 10, offsetLeft: 10
        },
        frame: {
            enabled: false,
            opacity: 0.8,
            sides: 6,
            radius: 40,
            thickness: 2,
            rotation: 0
        },
        export: {
            size: 200,
            scale: 1.85
        }
    };
    
    // Store initial state to detect changes
    let lastSavedConfigStr = JSON.stringify(config);

    // DOM Elements Mapping
    const inputs = {
        color: document.getElementById('crosshairColor'),
        colorHex: document.getElementById('colorHex'),
        
        export: {
            size: document.getElementById('exportSize'),
            scale: document.getElementById('exportScale')
        },
        
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
            locked: document.getElementById('innerLock'),
            opacity: document.getElementById('innerOpacity'),
            opacityNum: document.getElementById('innerOpacityNum'),
            length: document.getElementById('innerLength'),
            lengthNum: document.getElementById('innerLengthNum'),
            thickness: document.getElementById('innerThickness'),
            thicknessNum: document.getElementById('innerThicknessNum'),
            offset: document.getElementById('innerOffset'),
            offsetNum: document.getElementById('innerOffsetNum'),
            rotation: document.getElementById('innerRotation'),
            rotationNum: document.getElementById('innerRotationNum'),
            lengthTop: document.getElementById('innerLengthTop'), lengthTopNum: document.getElementById('innerLengthTopNum'),
            lengthRight: document.getElementById('innerLengthRight'), lengthRightNum: document.getElementById('innerLengthRightNum'),
            lengthBottom: document.getElementById('innerLengthBottom'), lengthBottomNum: document.getElementById('innerLengthBottomNum'),
            lengthLeft: document.getElementById('innerLengthLeft'), lengthLeftNum: document.getElementById('innerLengthLeftNum'),
            thicknessTop: document.getElementById('innerThicknessTop'), thicknessTopNum: document.getElementById('innerThicknessTopNum'),
            thicknessRight: document.getElementById('innerThicknessRight'), thicknessRightNum: document.getElementById('innerThicknessRightNum'),
            thicknessBottom: document.getElementById('innerThicknessBottom'), thicknessBottomNum: document.getElementById('innerThicknessBottomNum'),
            thicknessLeft: document.getElementById('innerThicknessLeft'), thicknessLeftNum: document.getElementById('innerThicknessLeftNum'),
            offsetTop: document.getElementById('innerOffsetTop'), offsetTopNum: document.getElementById('innerOffsetTopNum'),
            offsetRight: document.getElementById('innerOffsetRight'), offsetRightNum: document.getElementById('innerOffsetRightNum'),
            offsetBottom: document.getElementById('innerOffsetBottom'), offsetBottomNum: document.getElementById('innerOffsetBottomNum'),
            offsetLeft: document.getElementById('innerOffsetLeft'), offsetLeftNum: document.getElementById('innerOffsetLeftNum')
        },
        outer: {
            enabled: document.getElementById('showOuterLines'),
            locked: document.getElementById('outerLock'),
            opacity: document.getElementById('outerOpacity'),
            opacityNum: document.getElementById('outerOpacityNum'),
            length: document.getElementById('outerLength'),
            lengthNum: document.getElementById('outerLengthNum'),
            thickness: document.getElementById('outerThickness'),
            thicknessNum: document.getElementById('outerThicknessNum'),
            offset: document.getElementById('outerOffset'),
            offsetNum: document.getElementById('outerOffsetNum'),
            rotation: document.getElementById('outerRotation'),
            rotationNum: document.getElementById('outerRotationNum'),
            lengthTop: document.getElementById('outerLengthTop'), lengthTopNum: document.getElementById('outerLengthTopNum'),
            lengthRight: document.getElementById('outerLengthRight'), lengthRightNum: document.getElementById('outerLengthRightNum'),
            lengthBottom: document.getElementById('outerLengthBottom'), lengthBottomNum: document.getElementById('outerLengthBottomNum'),
            lengthLeft: document.getElementById('outerLengthLeft'), lengthLeftNum: document.getElementById('outerLengthLeftNum'),
            thicknessTop: document.getElementById('outerThicknessTop'), thicknessTopNum: document.getElementById('outerThicknessTopNum'),
            thicknessRight: document.getElementById('outerThicknessRight'), thicknessRightNum: document.getElementById('outerThicknessRightNum'),
            thicknessBottom: document.getElementById('outerThicknessBottom'), thicknessBottomNum: document.getElementById('outerThicknessBottomNum'),
            thicknessLeft: document.getElementById('outerThicknessLeft'), thicknessLeftNum: document.getElementById('outerThicknessLeftNum'),
            offsetTop: document.getElementById('outerOffsetTop'), offsetTopNum: document.getElementById('outerOffsetTopNum'),
            offsetRight: document.getElementById('outerOffsetRight'), offsetRightNum: document.getElementById('outerOffsetRightNum'),
            offsetBottom: document.getElementById('outerOffsetBottom'), offsetBottomNum: document.getElementById('outerOffsetBottomNum'),
            offsetLeft: document.getElementById('outerOffsetLeft'), offsetLeftNum: document.getElementById('outerOffsetLeftNum')
        },
        frame: {
            enabled: document.getElementById('showFrame'),
            opacity: document.getElementById('frameOpacity'),
            opacityNum: document.getElementById('frameOpacityNum'),
            sides: document.getElementById('frameSides'),
            sidesNum: document.getElementById('frameSidesNum'),
            radius: document.getElementById('frameRadius'),
            radiusNum: document.getElementById('frameRadiusNum'),
            thickness: document.getElementById('frameThickness'),
            thicknessNum: document.getElementById('frameThicknessNum'),
            rotation: document.getElementById('frameRotation'),
            rotationNum: document.getElementById('frameRotationNum')
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
        bindLockToggle(inputs.inner.locked, config.inner, 'inner');
        bindSlider(inputs.inner.opacity, inputs.inner.opacityNum, config.inner, 'opacity');
        bindSlider(inputs.inner.length, inputs.inner.lengthNum, config.inner, 'length');
        bindSlider(inputs.inner.thickness, inputs.inner.thicknessNum, config.inner, 'thickness');
        bindSlider(inputs.inner.offset, inputs.inner.offsetNum, config.inner, 'offset');
        bindSlider(inputs.inner.rotation, inputs.inner.rotationNum, config.inner, 'rotation');
        bindInnerOuterPerDirection(inputs.inner, config.inner);

        // Outer Lines
        bindCheckbox(inputs.outer.enabled, config.outer, 'enabled');
        bindLockToggle(inputs.outer.locked, config.outer, 'outer');
        bindSlider(inputs.outer.opacity, inputs.outer.opacityNum, config.outer, 'opacity');
        bindSlider(inputs.outer.length, inputs.outer.lengthNum, config.outer, 'length');
        bindSlider(inputs.outer.thickness, inputs.outer.thicknessNum, config.outer, 'thickness');
        bindSlider(inputs.outer.offset, inputs.outer.offsetNum, config.outer, 'offset');
        bindSlider(inputs.outer.rotation, inputs.outer.rotationNum, config.outer, 'rotation');
        bindInnerOuterPerDirection(inputs.outer, config.outer);

        // Frame (outer polygon/circle)
        if (inputs.frame && inputs.frame.enabled) bindCheckbox(inputs.frame.enabled, config.frame, 'enabled');
        if (inputs.frame && inputs.frame.opacity) bindSlider(inputs.frame.opacity, inputs.frame.opacityNum, config.frame, 'opacity');
        if (inputs.frame && inputs.frame.sides) bindSlider(inputs.frame.sides, inputs.frame.sidesNum, config.frame, 'sides');
        if (inputs.frame && inputs.frame.radius) bindSlider(inputs.frame.radius, inputs.frame.radiusNum, config.frame, 'radius');
        if (inputs.frame && inputs.frame.thickness) bindSlider(inputs.frame.thickness, inputs.frame.thicknessNum, config.frame, 'thickness');
        if (inputs.frame && inputs.frame.rotation) bindSlider(inputs.frame.rotation, inputs.frame.rotationNum, config.frame, 'rotation');

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
        inputs.export.size.addEventListener('change', (e) => {
            config.export.size = parseInt(e.target.value) || 200;
        });
        inputs.export.scale.addEventListener('change', (e) => {
            config.export.scale = parseFloat(e.target.value) || 1.85;
            draw(); // Redraw because scale affects preview? No, scale is only for export. But maybe user wants to see? 
            // Actually, renderScene uses scale param. draw() uses scale=1. 
            // So changing export scale doesn't affect preview. That's fine.
        });

        document.getElementById('downloadBtn').addEventListener('click', downloadPNG);
        document.getElementById('copyCodeBtn').addEventListener('click', copyConfig);
        document.getElementById('importCodeBtn').addEventListener('click', importConfig);

        updateLockUI('inner');
        updateLockUI('outer');
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
        if (!element) return;
        element.addEventListener('change', (e) => {
            obj[key] = e.target.checked;
            draw();
        });
    }

    function bindLockToggle(btn, group, section) {
        if (!btn) return;
        btn.addEventListener('click', () => {
            group.locked = !group.locked;
            if (!group.locked) {
                group.lengthTop = group.length; group.lengthRight = group.length;
                group.lengthBottom = group.length; group.lengthLeft = group.length;
                group.thicknessTop = group.thickness; group.thicknessRight = group.thickness;
                group.thicknessBottom = group.thickness; group.thicknessLeft = group.thickness;
                group.offsetTop = group.offset; group.offsetRight = group.offset;
                group.offsetBottom = group.offset; group.offsetLeft = group.offset;
            }
            updateLockUI(section);
            syncLockInputs(group, section);
            draw();
        });
    }

    function updateLockUI(section) {
        const group = section === 'inner' ? config.inner : config.outer;
        const prefix = section === 'inner' ? 'inner' : 'outer';
        const unifiedEl = document.querySelector('.' + prefix + '-unified');
        const perDirEl = document.querySelector('.' + prefix + '-per-direction');
        if (unifiedEl) unifiedEl.style.display = group.locked ? '' : 'none';
        if (perDirEl) perDirEl.style.display = group.locked ? 'none' : '';
        const lockIcon = document.getElementById(prefix + 'Lock');
        if (lockIcon) {
            lockIcon.classList.toggle('locked', group.locked);
            lockIcon.title = group.locked ? '已锁定：统一调整' : '已解锁：可单独调整上下左右';
            lockIcon.innerHTML = group.locked ? '<i class="fas fa-lock"></i>' : '<i class="fas fa-lock-open"></i>';
        }
    }

    function syncLockInputs(group, section) {
        const inputsGroup = section === 'inner' ? inputs.inner : inputs.outer;
        if (group.locked) return;
        const dirs = ['Top', 'Right', 'Bottom', 'Left'];
        ['length', 'thickness', 'offset'].forEach(prop => {
            dirs.forEach(d => {
                const el = inputsGroup[prop + d];
                const numEl = inputsGroup[prop + d + 'Num'];
                const val = group[prop + d];
                if (el) el.value = val;
                if (numEl) numEl.value = val;
            });
        });
    }

    function bindInnerOuterPerDirection(inputsGroup, group) {
        const dirs = ['Top', 'Right', 'Bottom', 'Left'];
        ['length', 'thickness', 'offset'].forEach(prop => {
            dirs.forEach(d => {
                const key = prop + d;
                const rangeEl = inputsGroup[prop + d];
                const numEl = inputsGroup[prop + d + 'Num'];
                if (rangeEl && numEl) bindSlider(rangeEl, numEl, group, key);
            });
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
            if (config.frame && config.frame.enabled) drawFrameOutline(targetCtx, cx, cy, config.frame, outlineColor, oThick, scale);
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
        if (config.frame && config.frame.enabled) drawFrameFill(targetCtx, cx, cy, config.frame, fillColor, scale);
    }

    // Arm order after each rotate(90°): 0=下, 1=左, 2=上, 3=右 (screen direction)
    const DIR_KEYS = ['Bottom', 'Left', 'Top', 'Right'];
    function getArmValue(group, i, prop) {
        if (group.locked) return group[prop];
        const key = prop + DIR_KEYS[i];
        return group[key] != null ? group[key] : group[prop];
    }

    function drawGroupOutline(ctx, cx, cy, group, color, oThick, scale) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(group.rotation * Math.PI / 180);
        ctx.fillStyle = color;
        for (let i = 0; i < 4; i++) {
            ctx.rotate(90 * Math.PI / 180);
            const offset = getArmValue(group, i, 'offset') * scale;
            const length = getArmValue(group, i, 'length') * scale;
            const thickness = getArmValue(group, i, 'thickness') * scale;
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
            const offset = getArmValue(group, i, 'offset') * scale;
            const length = getArmValue(group, i, 'length') * scale;
            const thickness = getArmValue(group, i, 'thickness') * scale;
            ctx.fillRect(offset, -thickness / 2, length, thickness);
        }
        ctx.restore();
    }

    function drawFrameOutline(ctx, cx, cy, frame, color, oThick, scale) {
        const r = frame.radius * scale;
        const sides = Math.max(3, Math.round(frame.sides));
        const thick = frame.thickness * scale + oThick * 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(frame.rotation * Math.PI / 180);
        ctx.strokeStyle = color;
        ctx.lineWidth = thick;
        ctx.beginPath();
        for (let i = 0; i <= sides; i++) {
            const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    function drawFrameFill(ctx, cx, cy, frame, hexColor, scale) {
        const r = frame.radius * scale;
        const sides = Math.max(3, Math.round(frame.sides));
        const thick = frame.thickness * scale;
        const rgba = (() => {
            const r_ = parseInt(hexColor.slice(1, 3), 16);
            const g_ = parseInt(hexColor.slice(3, 5), 16);
            const b_ = parseInt(hexColor.slice(5, 7), 16);
            return `rgba(${r_}, ${g_}, ${b_}, ${frame.opacity})`;
        })();
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(frame.rotation * Math.PI / 180);
        ctx.strokeStyle = rgba;
        ctx.lineWidth = thick;
        ctx.beginPath();
        for (let i = 0; i <= sides; i++) {
            const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
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
        // Sync export inputs to config before checking
        if (inputs.export.size) currentConfig.export.size = parseInt(inputs.export.size.value) || 200;
        if (inputs.export.scale) currentConfig.export.scale = parseFloat(inputs.export.scale.value) || 1.85;

        const currentStr = JSON.stringify(currentConfig);
        
        // Don't save if identical to last saved/loaded state
        if (currentStr === lastSavedConfigStr) {
            return; 
        }

        let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        
        // Avoid duplicates (double check against history head)
        if (history.length > 0 && JSON.stringify(history[0].config) === currentStr) {
            lastSavedConfigStr = currentStr; // Update baseline
            return;
        }

        // Generate thumbnail
        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = 100;
        thumbCanvas.height = 100;
        const thumbCtx = thumbCanvas.getContext('2d');
        
        // Render crosshair for thumbnail
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
        
        // Update baseline after successful save
        lastSavedConfigStr = currentStr;
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
        ['Top', 'Right', 'Bottom', 'Left'].forEach(d => {
            ['length', 'thickness', 'offset'].forEach(p => {
                const key = p + d;
                const val = config.inner[key];
                if (val != null && inputs.inner[key]) inputs.inner[key].value = val;
                if (val != null && inputs.inner[key + 'Num']) inputs.inner[key + 'Num'].value = val;
            });
        });
        updateLockUI('inner');

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
        ['Top', 'Right', 'Bottom', 'Left'].forEach(d => {
            ['length', 'thickness', 'offset'].forEach(p => {
                const key = p + d;
                const val = config.outer[key];
                if (val != null && inputs.outer[key]) inputs.outer[key].value = val;
                if (val != null && inputs.outer[key + 'Num']) inputs.outer[key + 'Num'].value = val;
            });
        });
        updateLockUI('outer');

        // Frame
        if (config.frame && inputs.frame) {
            if (inputs.frame.enabled) inputs.frame.enabled.checked = config.frame.enabled;
            if (inputs.frame.opacity) inputs.frame.opacity.value = config.frame.opacity;
            if (inputs.frame.opacityNum) inputs.frame.opacityNum.value = config.frame.opacity;
            if (inputs.frame.sides) inputs.frame.sides.value = config.frame.sides;
            if (inputs.frame.sidesNum) inputs.frame.sidesNum.value = config.frame.sides;
            if (inputs.frame.radius) inputs.frame.radius.value = config.frame.radius;
            if (inputs.frame.radiusNum) inputs.frame.radiusNum.value = config.frame.radius;
            if (inputs.frame.thickness) inputs.frame.thickness.value = config.frame.thickness;
            if (inputs.frame.thicknessNum) inputs.frame.thicknessNum.value = config.frame.thickness;
            if (inputs.frame.rotation) inputs.frame.rotation.value = config.frame.rotation;
            if (inputs.frame.rotationNum) inputs.frame.rotationNum.value = config.frame.rotation;
        }

        // Export Settings
        if (config.export) {
            if (inputs.export.size) inputs.export.size.value = config.export.size;
            if (inputs.export.scale) inputs.export.scale.value = config.export.scale;
        }
    }

    function loadConfig(newConfig) {
        // Deep merge safely
        if (newConfig.color) config.color = newConfig.color;
        if (newConfig.centerDot) Object.assign(config.centerDot, newConfig.centerDot);
        if (newConfig.outline) Object.assign(config.outline, newConfig.outline);
        if (newConfig.inner) Object.assign(config.inner, newConfig.inner);
        if (newConfig.outer) Object.assign(config.outer, newConfig.outer);
        if (newConfig.frame) Object.assign(config.frame, newConfig.frame);
        if (newConfig.export) {
             config.export = { ...newConfig.export };
        } else {
            // Default if missing in old history
            config.export = { size: 200, scale: 1.85 };
        }
        
        updateUI();
        draw();
        
        // Update baseline so we don't save if no changes made after load
        lastSavedConfigStr = JSON.stringify(config);
    }

    function downloadPNG() {
        const size = config.export.size;
        const scale = config.export.scale;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = size;
        tempCanvas.height = size;
        const tCtx = tempCanvas.getContext('2d');
        
        renderScene(tCtx, size, size, scale);
        
        // Save to history when exporting (only if changed)
        saveToHistory(config);
        
        const link = document.createElement('a');
        link.download = `crosshair_${size}x${size}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    }

    function copyConfig() {
        // Ensure export settings are up to date
        if (inputs.export.size) config.export.size = parseInt(inputs.export.size.value) || 200;
        if (inputs.export.scale) config.export.scale = parseFloat(inputs.export.scale.value) || 1.85;

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
            if (newConfig.frame) Object.assign(config.frame, newConfig.frame);
            if (newConfig.export) {
                config.export = { ...newConfig.export };
            } else {
                config.export = { size: 200, scale: 1.85 };
            }
            
            updateUI();
            draw();
            
            // Update baseline immediately so we don't auto-save if user closes immediately
            // But wait, import is an "action", user might want it saved.
            // The user said "if selected ... no adjustments ... don't save".
            // Import is explicit. Let's save it.
            saveToHistory(config); 
            
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
