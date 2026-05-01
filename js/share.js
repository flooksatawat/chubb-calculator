// js/share.js

let thaiFontBase64 = null;
let pendingInstallmentData = {};
let currentShareType = '';

async function loadThaiFont() { 
    if (thaiFontBase64) return thaiFontBase64; 
    try { 
        const response = await fetch('https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/sarabun/Sarabun-Regular.ttf'); 
        const blob = await response.blob(); 
        return new Promise((resolve) => { 
            const reader = new FileReader(); 
            reader.onloadend = () => { thaiFontBase64 = reader.result.split(',')[1]; resolve(thaiFontBase64); }; 
            reader.readAsDataURL(blob); 
        }); 
    } catch (e) { return null; } 
}

async function exportTableToPDF(actionType = 'save') {
    // ... โค้ด exportTableToPDF เดิมทั้งหมด ...
}

function triggerInstallmentShare(type) {
    // ... โค้ด triggerInstallmentShare เดิมทั้งหมด ...
}

function openGenericShareModal(type) {
    if (type === 'all' && !lastCalculationData) return showCustomError("กรุณาคำนวณเบี้ยประกันก่อนแชร์");
    currentShareType = type; openPopup('genericShareModal');
}

function handleGenericShare(platform) {
     // ... โค้ด handleGenericShare เดิมทั้งหมด ...
}

function generateResultText(type) {
     // ... โค้ด generateResultText เดิมทั้งหมด ...
}

function copyToClipboard(text, msg) { /* ... โค้ดเดิม ... */ }
function copyToClipboardWithFeedback(text, callback, customHTML) { /* ... โค้ดเดิม ... */ }
function executeShare(text, platform) { /* ... โค้ดเดิม ... */ }
function shareResult(type, platform) { const text = generateResultText(type); if (text) executeShare(text, platform); }
function shareText(text, platform) { if (text) executeShare(text, platform); }
function handleCopyAndClose(type = 'all') { const text = generateResultText(type); if (text) copyToClipboard(text, "คัดลอกเรียบร้อยแล้ว"); closePopup('resultModal'); }
