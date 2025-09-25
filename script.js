// DOM elements
const textInput = document.getElementById('textInput');
const fontFamily = document.getElementById('fontFamily');
const fontSize = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const formatSelect = document.getElementById('formatSelect');
const backgroundColor = document.getElementById('backgroundColor');
const backgroundColorGroup = document.getElementById('backgroundColorGroup');
const backgroundColorHex = document.getElementById('backgroundColorHex');
const enableFrame = document.getElementById('enableFrame');
const frameOptions = document.getElementById('frameOptions');
const frameColor = document.getElementById('frameColor');
const frameColorHex = document.getElementById('frameColorHex');
const frameWidth = document.getElementById('frameWidth');
const frameWidthValue = document.getElementById('frameWidthValue');
const frameStyle = document.getElementById('frameStyle');
const customFrameColor = document.getElementById('customFrameColor');
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

// Canvas settings
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 200;

// Initialize canvas size
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Event listeners
textInput.addEventListener('input', updatePreview);
fontFamily.addEventListener('change', updatePreview);
fontSize.addEventListener('input', updateFontSize);
formatSelect.addEventListener('change', updateFormatSettings);
backgroundColor.addEventListener('input', updateBackgroundColor);
enableFrame.addEventListener('change', updateFrameSettings);
frameColor.addEventListener('input', updateFrameColor);
frameWidth.addEventListener('input', updateFrameWidth);
frameStyle.addEventListener('change', updateFrameStyleSettings);
downloadBtn.addEventListener('click', downloadImage);

// Initialize
updateFontSize();
updateFormatSettings();
updateFrameSettings();
updateFrameStyleSettings();
updateBackgroundColor();
updateFrameColor();
updateFrameWidth();
updatePreview();

function updateFontSize() {
    fontSizeValue.textContent = fontSize.value + 'px';
    updatePreview();
}

function updateFormatSettings() {
    const isJpeg = formatSelect.value === 'jpeg';
    backgroundColorGroup.style.display = isJpeg ? 'block' : 'none';
    updatePreview();
}

function updateBackgroundColor() {
    backgroundColorHex.textContent = backgroundColor.value.toUpperCase();
    updatePreview();
}

function updateFrameSettings() {
    frameOptions.style.display = enableFrame.checked ? 'block' : 'none';
    updatePreview();
}

function updateFrameColor() {
    frameColorHex.textContent = frameColor.value.toUpperCase();
    updatePreview();
}

function updateFrameWidth() {
    frameWidthValue.textContent = frameWidth.value + 'px';
    updatePreview();
}

function updateFrameStyleSettings() {
    const style = frameStyle.value;
    customFrameColor.style.display = style === 'solid' ? 'block' : 'none';
    updatePreview();
}

function updatePreview() {
    const text = textInput.value || '👋 Digite algo!';
    const fontSizeNum = parseInt(fontSize.value);
    const isJpeg = formatSelect.value === 'jpeg';
    const bgColor = backgroundColor.value;
    const hasFrame = enableFrame.checked;
    const fColor = frameColor.value;
    const fWidth = parseInt(frameWidth.value);
    const fStyle = frameStyle.value;
    
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Set background for JPEG
    if (isJpeg) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    
    // Draw frame if enabled
    if (hasFrame) {
        drawFrame(ctx, fColor, fWidth, fStyle);
    }
    
    // Configure text rendering  
    const selectedFont = fontFamily.value || 'Inter';
    ctx.font = `${fontSizeNum}px "${selectedFont}", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isJpeg ? getContrastColor(bgColor) : '#333333';
    
    // Handle text wrapping for long text (accounting for frame padding)
    const framePadding = hasFrame ? fWidth * 2 + 20 : 40;
    const maxWidth = CANVAS_WIDTH - framePadding;
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    
    // Calculate starting Y position for centered text
    const lineHeight = fontSizeNum * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = (CANVAS_HEIGHT - totalHeight) / 2 + lineHeight / 2;
    
    // Draw each line
    lines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        ctx.fillText(line, CANVAS_WIDTH / 2, y);
    });
    
    // Enable download button if there's text
    downloadBtn.disabled = !textInput.value.trim();
}

function drawFrame(context, color, width, style) {
    // Save current context state
    context.save();
    
    const halfWidth = width / 2;
    const x = halfWidth;
    const y = halfWidth;
    const w = CANVAS_WIDTH - width;
    const h = CANVAS_HEIGHT - width;
    
    context.lineWidth = width;
    context.setLineDash([]);
    
    switch (style) {
        case 'gradient':
            const gradient = context.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(0.5, '#764ba2');
            gradient.addColorStop(1, '#f093fb');
            context.strokeStyle = gradient;
            break;
            
        case 'neon':
            context.strokeStyle = '#00ffff';
            context.shadowColor = '#00ffff';
            context.shadowBlur = width;
            break;
            
        case 'vintage':
            context.strokeStyle = '#8b4513';
            context.shadowColor = '#654321';
            context.shadowBlur = width / 2;
            break;
            
        case 'royal':
            const royalGradient = context.createLinearGradient(0, 0, CANVAS_WIDTH, 0);
            royalGradient.addColorStop(0, '#ffd700');
            royalGradient.addColorStop(0.5, '#ffb347');
            royalGradient.addColorStop(1, '#ffd700');
            context.strokeStyle = royalGradient;
            context.shadowColor = '#b8860b';
            context.shadowBlur = width / 3;
            break;
            
        case 'nature':
            const natureGradient = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
            natureGradient.addColorStop(0, '#228b22');
            natureGradient.addColorStop(0.5, '#32cd32');
            natureGradient.addColorStop(1, '#90ee90');
            context.strokeStyle = natureGradient;
            break;
            
        case 'ocean':
            const oceanGradient = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
            oceanGradient.addColorStop(0, '#191970');
            oceanGradient.addColorStop(0.5, '#4169e1');
            oceanGradient.addColorStop(1, '#87ceeb');
            context.strokeStyle = oceanGradient;
            break;
            
        case 'sunset':
            const sunsetGradient = context.createLinearGradient(0, 0, CANVAS_WIDTH, 0);
            sunsetGradient.addColorStop(0, '#ff6b6b');
            sunsetGradient.addColorStop(0.5, '#feca57');
            sunsetGradient.addColorStop(1, '#ff9ff3');
            context.strokeStyle = sunsetGradient;
            break;
            
        case 'galaxy':
            const galaxyGradient = context.createRadialGradient(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 0, CANVAS_WIDTH/2, CANVAS_HEIGHT/2, Math.max(CANVAS_WIDTH, CANVAS_HEIGHT)/2);
            galaxyGradient.addColorStop(0, '#9b59b6');
            galaxyGradient.addColorStop(0.5, '#3742fa');
            galaxyGradient.addColorStop(1, '#2f3542');
            context.strokeStyle = galaxyGradient;
            context.shadowColor = '#9b59b6';
            context.shadowBlur = width;
            break;
            
        case 'fire':
            const fireGradient = context.createLinearGradient(0, CANVAS_HEIGHT, 0, 0);
            fireGradient.addColorStop(0, '#ff0000');
            fireGradient.addColorStop(0.5, '#ff4500');
            fireGradient.addColorStop(1, '#ffd700');
            context.strokeStyle = fireGradient;
            context.shadowColor = '#ff4500';
            context.shadowBlur = width / 2;
            break;
            
        default: // solid
            context.strokeStyle = color;
            context.shadowColor = 'transparent';
            context.shadowBlur = 0;
    }
    
    // Draw the frame
    context.strokeRect(x, y, w, h);
    
    // Restore context state (resets shadows automatically)
    context.restore();
}

function getContrastColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    // Calculate brightness
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    // Return black for light backgrounds, white for dark backgrounds
    return brightness > 128 ? '#000000' : '#FFFFFF';
}

function downloadImage() {
    if (!textInput.value.trim()) {
        alert('Por favor, digite algum texto antes de baixar!');
        return;
    }
    
    const format = formatSelect.value;
    const text = textInput.value.replace(/[^\w\s-]/g, '').substring(0, 20) || 'imagem';
    const filename = `${text}_${Date.now()}.${format}`;
    
    // Create download canvas with higher resolution
    const downloadCanvas = document.createElement('canvas');
    const downloadCtx = downloadCanvas.getContext('2d');
    
    // Set high resolution
    const scale = 3; // 3x resolution for better quality
    downloadCanvas.width = CANVAS_WIDTH * scale;
    downloadCanvas.height = CANVAS_HEIGHT * scale;
    
    // Scale the context
    downloadCtx.scale(scale, scale);
    
    // Redraw on download canvas
    const fontSizeNum = parseInt(fontSize.value);
    const isJpeg = format === 'jpeg';
    const bgColor = backgroundColor.value;
    const hasFrame = enableFrame.checked;
    const fColor = frameColor.value;
    const fWidth = parseInt(frameWidth.value);
    const fStyle = frameStyle.value;
    
    // Clear and set background
    downloadCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    if (isJpeg) {
        downloadCtx.fillStyle = bgColor;
        downloadCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    
    // Draw frame if enabled
    if (hasFrame) {
        drawFrame(downloadCtx, fColor, fWidth, fStyle);
    }
    
    // Configure text
    const selectedFont = fontFamily.value || 'Inter';
    downloadCtx.font = `${fontSizeNum}px "${selectedFont}", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    downloadCtx.textAlign = 'center';
    downloadCtx.textBaseline = 'middle';
    downloadCtx.fillStyle = isJpeg ? getContrastColor(bgColor) : '#333333';
    
    // Render text with same wrapping logic (accounting for frame)
    const framePadding = hasFrame ? fWidth * 2 + 20 : 40;
    const maxWidth = CANVAS_WIDTH - framePadding;
    const words = textInput.value.split(' ');
    const lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = downloadCtx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    
    const lineHeight = fontSizeNum * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = (CANVAS_HEIGHT - totalHeight) / 2 + lineHeight / 2;
    
    lines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        downloadCtx.fillText(line, CANVAS_WIDTH / 2, y);
    });
    
    // Convert to blob and download
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = format === 'jpeg' ? 0.95 : undefined;
    
    downloadCanvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Show success message
        showNotification('Imagem baixada com sucesso! 🎉');
    }, mimeType, quality);
}

function showNotification(message) {
    // Simple notification system
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Handle emoji input and ensure proper rendering
textInput.addEventListener('keydown', function(e) {
    // Allow backspace, delete, and arrow keys
    if ([8, 9, 27, 46, 37, 38, 39, 40].includes(e.keyCode)) {
        return;
    }
    
    // Limit input length
    if (this.value.length >= 100) {
        e.preventDefault();
    }
});
