// ==================== SHARING MODULE ====================
let pendingInstallmentData = {};

function replacePercentWithAmountShare(text, sum, premium) {
    return text.replace(/(\d+(?:\.\d+)?)%\s*ของทุน(?:ประกัน)?/g, (match, p1) => {
        let percent = parseFloat(p1); let amount = sum * (percent / 100); return `${formatNum(amount)} บาท`;
    }).replace(/(\d+(?:\.\d+)?)%\s*ของเบี้ย(?:ประกัน)?/g, (match, p1) => {
        let percent = parseFloat(p1); let amount = premium * (percent / 100); return `${formatNum(amount)} บาท`;
    });
}

function triggerInstallmentShare(type) {
    if (!lastCalculationData) return; 
    const d = lastCalculationData; const p = d.premium; let amt = 0, label = ''; 
    if(type === 'monthly') { amt = Math.round(p * 0.09); label = 'รายเดือน'; } if(type === '3month') { amt = Math.round(p * 0.27); label = 'ราย 3 เดือน'; } if(type === '6month') { amt = Math.round(p * 0.52); label = 'ราย 6 เดือน'; } 
    
    const sumStr = formatNum(d.sum); 
    const premOnlyText = `${amt.toLocaleString()}`;
    let allText = `📋 สรุปแผน: ${getPlanAbbr(currentAppPlan)}\n👤 เพศ ${d.gender} | 🎂 อายุ ${d.age} ปี\n💰 ออมเงิน : ${amt.toLocaleString()} บาท (${label})\n⏳ ระยะเวลาออม ${d.years} ปี\n🛡️ วงเงิน ${sumStr} บาท\n`; 
    
    const pd = window.PRODUCT_CONDITIONS && window.PRODUCT_CONDITIONS[currentAppPlan];
    if (pd) {
        allText += `\n--------------------------\n`;
        if(pd.benefits && pd.benefits.length) {
            allText += `🛡️ ความคุ้มครองหลัก:\n`;
            pd.benefits.forEach(b => {
                let calcB = replacePercentWithAmountShare(b, d.sum, d.premium);
                allText += `- ${calcB}\n`;
            });
        }
        if(pd.remark) allText += `\nหมายเหตุ: ${pd.remark}\n`;
    }

    pendingInstallmentData = { premOnly: premOnlyText, allText: allText, label: label };
    document.getElementById('installmentShareTitle').innerText = 'แชร์ยอดชำระ' + label;
    closePopup('installmentModal'); openPopup('installmentShareModal');
}

function generateShortShareText() {
    if (!lastCalculationData) return '';
    const d = lastCalculationData;
    return `📋 สรุปแผน: ${getPlanAbbr(currentAppPlan)}\n👤 เพศ: ${d.gender} | 🎂 อายุ: ${d.age} ปี\n🛡️ วงเงิน: ${formatNum(d.sum)} บาท\n💰 ออมเงิน: ${Math.round(d.premium).toLocaleString()} บาท/ปี`;
}

let currentShareType = '';
function openGenericShareModal(type) { if (type === 'all' && !lastCalculationData) return showCustomError("กรุณาคำนวณเบี้ยประกันก่อนแชร์"); currentShareType = type; openPopup('genericShareModal'); }

function handleGenericShare(platform) {
    if (currentShareType === 'diseaseList') { 
        const text = 'https://short-url.org/1nMQi'; 
        if (platform === 'copy') copyToClipboard(text, 'คัดลอกลิงก์เรียบร้อยแล้ว'); else executeShare(text, platform); 
    } 
    else if (currentShareType === 'premium' || currentShareType === 'all' || currentShareType === 'slb' || currentShareType === 'wxn') { 
        if (platform === 'copy') { 
            copyToClipboard(generateShortShareText(), "คัดลอกข้อมูลแบบย่อเรียบร้อยแล้ว"); 
            closePopup('dynamicResultModal'); closePopup('slbResultModal'); closePopup('resultModal'); 
        } else { 
            closePopup('dynamicResultModal'); closePopup('slbResultModal'); closePopup('resultModal'); 
            shareResult(currentShareType, platform); 
        } 
    } 
    else if (currentShareType === 'installmentPrem' || currentShareType === 'installmentAll') { 
        const textToShare = currentShareType === 'installmentPrem' ? pendingInstallmentData.premOnly : pendingInstallmentData.allText; 
        if (platform === 'copy') copyToClipboard(textToShare, `คัดลอกเรียบร้อยแล้ว`); else executeShare(textToShare, platform); 
    } 
    else if (['scb', 'bbl', 'bay', 'kbank'].includes(currentShareType)) { 
        const bText = {"scb": "ธ.ไทยพาณิชย์ : 049-416-6866 สาขาถนนวิทยุ", "bbl": "ธ.กรุงเทพ : 147-312-5357 สาขาสุรวงศ์", "bay": "ธ.กรุงศรี : 001-016-4329 สาขาเพลินจิต", "kbank": "ธ.กสิกร : 099-132-6065 สาขาพหลโยธิน"}; 
        if (platform === 'copy') copyToClipboard(bText[currentShareType], 'คัดลอกบัญชีเรียบร้อยแล้ว'); else shareText(bText[currentShareType], platform); 
    }
    closePopup('genericShareModal');
}

function generateResultText(type) {
    if (!lastCalculationData) return ''; 
    const d = lastCalculationData;
    if (type === 'premium') return `${Math.round(d.premium).toLocaleString()}`;
    const sumStr = formatNum(d.sum); 
    
    let text = `📋 สรุปแผน: ${getPlanAbbr(currentAppPlan)}\n👤 เพศ ${d.gender} | 🎂 อายุ ${d.age} ปี\n💰 ออม/เบี้ย : ${Math.round(d.premium).toLocaleString()} บาท\n⏳ ระยะเวลาออม ${d.years} ปี\n🛡️ วงเงิน ${sumStr} บาท\n`;

    const pd = window.PRODUCT_CONDITIONS && window.PRODUCT_CONDITIONS[currentAppPlan];
    if (pd) {
        text += `\n--------------------------\n`;
        if(pd.benefits && pd.benefits.length) {
            text += `🛡️ ความคุ้มครองหลัก:\n`;
            pd.benefits.forEach(b => {
                let calcB = replacePercentWithAmountShare(b, d.sum, d.premium);
                text += `- ${calcB}\n`;
            });
        }
        if(pd.remark) text += `\nหมายเหตุ: ${pd.remark}\n`;
    }
    return text;
}

function copyToClipboard(text, msg) { const el = document.createElement('textarea'); el.value = text; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); const toast = document.createElement('div'); toast.className = "fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full text-xs font-bold z-[1000] shadow-xl transition-opacity duration-300"; toast.innerText = msg; document.body.appendChild(toast); setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 300); }, 2000); }
function copyToClipboardWithFeedback(text, callback, customHTML) { const el = document.createElement('textarea'); el.value = text; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); const toast = document.createElement('div'); toast.className = "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800/95 text-white px-8 py-6 rounded-3xl text-sm font-bold z-[1000] shadow-2xl text-center backdrop-blur-sm transition-all"; toast.innerHTML = customHTML; document.body.appendChild(toast); setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => { toast.remove(); if (callback) callback(); }, 300); }, 1800); }

function executeShare(text, platform) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (platform === 'line') { const lineUrl = 'https://line.me/R/msg/text/?' + encodeURIComponent(text); if (isMobile) window.location.href = lineUrl; else window.open(lineUrl, '_blank'); } 
    else if (platform === 'messenger') { const fbHtml = `<div class="w-14 h-14 bg-[#0084FF] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"><i class='fab fa-facebook-messenger text-3xl text-white'></i></div><span class="text-base font-bold block mb-1">เปิด Messenger แล้ว</span><span class='text-xs font-medium opacity-90 block text-blue-200'>กรุณาวางข้อความในแชทที่ต้องการ</span>`; copyToClipboardWithFeedback(text, () => { if (isMobile) { window.location.href = 'fb-messenger://'; setTimeout(() => { window.open('https://www.messenger.com/', '_blank'); }, 800); } else { window.open('https://www.messenger.com/', '_blank'); } }, fbHtml); } 
    else if (platform === 'copy') { copyToClipboard(text, "คัดลอกข้อมูลสรุปเรียบร้อยแล้ว"); }
}

function shareResult(type, platform) { const text = generateResultText(type); if (text) executeShare(text, platform); }
function shareText(text, platform) { if (text) executeShare(text, platform); }
function handleCopyAndClose(type = 'all') { const text = generateShortShareText(); if (text) copyToClipboard(text, "คัดลอกข้อมูลแบบย่อเรียบร้อยแล้ว"); closePopup('dynamicResultModal'); }

let voiceRecog = null; let isVoiceListening = false;
function startVoiceRecognition() { 
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition; 
    if (!SpeechRecognition) { showCustomError("อุปกรณ์ไม่รองรับคำสั่งเสียง"); return; }
    if (isVoiceListening) { if (voiceRecog) voiceRecog.stop(); return; }
    if (!voiceRecog) {
        voiceRecog = new SpeechRecognition(); voiceRecog.lang = 'th-TH'; 
        voiceRecog.onstart = () => { isVoiceListening = true; document.getElementById('navVoiceIcon').parentElement.classList.add('listening-active'); }; 
        voiceRecog.onend = () => { isVoiceListening = false; document.getElementById('navVoiceIcon').parentElement.classList.remove('listening-active'); };
        voiceRecog.onerror = () => { isVoiceListening = false; document.getElementById('navVoiceIcon').parentElement.classList.remove('listening-active'); };
    }
    try { voiceRecog.start(); } catch(e) {}
}

function showDefinition(title, desc) { document.getElementById('defTitle').innerText = title; document.getElementById('defDescription').innerText = desc; openPopup('definitionModal'); }

function setupLongPress() {
    const btn = document.getElementById('mainHeaderBtn'); if (!btn) return;
    let pressTimer; let startX, startY;
    const handleStart = (x, y) => { 
        isLongPressActive = false; startX = x; startY = y; 
        pressTimer = setTimeout(() => { 
            isLongPressActive = true; 
            updateConditionsModal(currentAppPlan); 
            openPopup('insuranceConditionsModal'); 
            if (navigator.vibrate) navigator.vibrate(50); 
        }, 500); 
    };
    const handleMove = (x, y) => { if (!startX || !startY) return; if (Math.abs(x - startX) > 10 || Math.abs(y - startY) > 10) { clearTimeout(pressTimer); } };
    btn.addEventListener('touchstart', (e) => { handleStart(e.touches[0].clientX, e.touches[0].clientY); }, {passive: true});
    btn.addEventListener('touchmove', (e) => { handleMove(e.touches[0].clientX, e.touches[0].clientY); }, {passive: true});
    btn.addEventListener('touchend', () => clearTimeout(pressTimer));
    btn.addEventListener('mousedown', (e) => { if (e.button !== 0) return; handleStart(e.clientX, e.clientY); });
    btn.addEventListener('mousemove', (e) => { handleMove(e.clientX, e.clientY); });
    btn.addEventListener('mouseup', () => clearTimeout(pressTimer));
    btn.addEventListener('mouseleave', () => clearTimeout(pressTimer));
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
}

function setupScrollHideNav() {
    const bottomNav = document.getElementById('bottomNavContainer'); if (!bottomNav) return;
    document.querySelectorAll('.scrollable-view').forEach(el => {
        let lastScrollTop = 0;
        el.addEventListener('scroll', function() {
            let st = this.scrollTop;
            if (st <= 10) { bottomNav.style.transform = 'translateY(0)'; bottomNav.style.opacity = '1'; lastScrollTop = st; return; }
            if (st < 0) return; if (Math.abs(lastScrollTop - st) <= 5) return; 
            if (st > lastScrollTop) { bottomNav.style.transform = 'translateY(150%)'; bottomNav.style.opacity = '0'; } 
            else { bottomNav.style.transform = 'translateY(0)'; bottomNav.style.opacity = '1'; }
            lastScrollTop = st;
        }, { passive: true });
    });
}
