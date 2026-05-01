// ==================== PRODUCT CONDITIONS LOADER ====================
window.PRODUCT_CONDITIONS = {};

// โหลดไฟล์ JSON ทั้งหมด
const PRODUCT_FILES = ['cx.json', 'slb.json', '3d.json', 'cl.json', 'elite.json', 'hbf.json', 'lp.json', 'slpa.json', 'tla.json', 'tx.json', 'wxn.json']; 

async function loadAllProductConditions() {
    for (const file of PRODUCT_FILES) {
        try {
            const response = await fetch(`data/product/${file}`);
            if (response.ok) {
                const data = await response.json();
                window.PRODUCT_CONDITIONS[data.name] = data; 
            }
        } catch (e) { }
    }
}

// ==================== UI HELPERS & NOTIFICATIONS ====================
function openPopup(id) { const modal = document.getElementById(id); if (modal) { modal.classList.remove('hidden'); setTimeout(() => { modal.classList.add('show'); }, 10); } }
function closePopup(id) { const modal = document.getElementById(id); if (modal) { modal.classList.remove('show'); setTimeout(() => { modal.classList.add('hidden'); }, 300); } }
function handleModalClick(e, modalId) { if (e.target.closest('button, input, select, textarea, a, .list-row, .interactive-btn, .prevent-close')) return; closePopup(modalId); }

function showCustomError(msg) { 
    const toast = document.createElement('div'); toast.className = "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600/95 text-white px-8 py-5 rounded-2xl text-sm font-bold z-[1000] shadow-2xl text-center backdrop-blur-sm transition-all"; 
    toast.innerHTML = `<i class='fas fa-exclamation-triangle mb-3 block text-3xl text-red-200'></i><span class="whitespace-nowrap">${msg}</span>`; 
    document.body.appendChild(toast); setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 2000); 
}

let hasShownCongratsMB = false, hasShownCongratsMYB = false, hasShownCongratsNAB = false;
function showCongratsToast(msg) {
    const cashView = document.getElementById('cashView'); if (cashView && cashView.classList.contains('hidden')) return;
    const toast = document.createElement('div'); toast.className = "fixed top-16 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-[24px] z-[9999] shadow-[0_10px_30px_rgba(16,185,129,0.4)] text-center transition-all duration-500 flex items-center gap-3.5 transform -translate-y-10 opacity-0 scale-90 w-[90%] max-w-[340px]"; 
    toast.innerHTML = `<i class='fas fa-trophy text-3xl text-yellow-300 drop-shadow-md animate-bounce' style="animation-duration: 2s;"></i><div class="text-left"><p class="text-[16px] font-black leading-tight tracking-wide">🎉 ยินดีด้วย!</p><p class="text-[12px] font-medium opacity-95 mt-0.5 leading-snug">${msg}</p></div>`; 
    document.body.appendChild(toast); setTimeout(() => { toast.classList.remove('-translate-y-10', 'opacity-0', 'scale-90'); toast.classList.add('translate-y-0', 'opacity-100', 'scale-100'); }, 10);
    setTimeout(() => { toast.classList.add('-translate-y-10', 'opacity-0', 'scale-90'); setTimeout(() => toast.remove(), 500); }, 3500); 
}

let isLongPressActive = false;
function handleHeaderClick(e) { if (isLongPressActive) { e.preventDefault(); isLongPressActive = false; return; } openPlanModal(); }

// ==================== HIGHLIGHT PILLS ====================
function highlightActivePills(fSum, fPrem, fCashFlow) {
    setTimeout(() => {
        let sumMatched = false; const sumBg = document.getElementById('sumPillBg');
        for(let i=1; i<=5; i++) { let el = document.getElementById('sumPill'+i); if(el) { let match = el.getAttribute('onclick').match(/\d+/); if(match && parseInt(match[0]) === fSum) { el.className = 'flex-1 relative z-10 rounded-[10px] text-[11px] font-bold text-blue-700 transition-all duration-300'; if(sumBg) { sumBg.style.opacity = '1'; sumBg.style.width = el.offsetWidth + 'px'; sumBg.style.left = el.offsetLeft + 'px'; } sumMatched = true; } else { el.className = 'flex-1 relative z-10 rounded-[10px] text-[11px] font-medium text-slate-500 hover:text-slate-700 transition-all duration-300'; } } }
        if(!sumMatched && sumBg) sumBg.style.opacity = '0';
        
        let premMatched = false; const premBg = document.getElementById('premPillBg');
        for(let i=1; i<=5; i++) { let el = document.getElementById('premPill'+i); if(el) { let match = el.getAttribute('onclick').match(/\d+/); if(match && parseInt(match[0]) === fPrem) { el.className = 'flex-1 relative z-10 rounded-[10px] text-[11px] font-bold text-blue-700 transition-all duration-300'; if(premBg) { premBg.style.opacity = '1'; premBg.style.width = el.offsetWidth + 'px'; premBg.style.left = el.offsetLeft + 'px'; } premMatched = true; } else { el.className = 'flex-1 relative z-10 rounded-[10px] text-[11px] font-medium text-slate-500 hover:text-slate-700 transition-all duration-300'; } } }
        if(!premMatched && premBg) premBg.style.opacity = '0';
        
        if (currentAppPlan === 'Whole Life Extra' || currentAppPlan === '868 / 818 Elite Saving' || currentAppPlan === '24 TX') {
            let cf1 = getSafeValue('cashFlowInput1'); let c1Matched = false; const c1Bg = document.getElementById('wxnCash1Bg');
            for(let i=1; i<=5; i++) { let el = document.getElementById('wxnC1Pill'+i); if(el) { let match = el.getAttribute('onclick').match(/\d+/); if(match && parseInt(match[0]) === cf1) { el.className = 'flex-1 relative z-10 rounded-[10px] text-[11px] font-bold text-emerald-700 transition-all duration-300'; if(c1Bg) { c1Bg.style.opacity = '1'; c1Bg.style.width = el.offsetWidth + 'px'; c1Bg.style.left = el.offsetLeft + 'px'; } c1Matched = true; } else { el.className = 'flex-1 relative z-10 rounded-[10px] text-[11px] font-medium text-emerald-600/80 hover:text-emerald-700 transition-all duration-300'; } } }
            if(!c1Matched && c1Bg) c1Bg.style.opacity = '0';
            
            let cf2 = getSafeValue('cashFlowInput2'); let c2Matched = false; const c2Bg = document.getElementById('wxnCash2Bg');
            for(let i=1; i<=5; i++) { let el = document.getElementById('wxnC2Pill'+i); if(el) { let match = el.getAttribute('onclick').match(/\d+/); if(match && parseInt(match[0]) === cf2) { el.className = 'flex-1 relative z-10 rounded-[10px] text-[11px] font-bold text-emerald-700 transition-all duration-300'; if(c2Bg) { c2Bg.style.opacity = '1'; c2Bg.style.width = el.offsetWidth + 'px'; c2Bg.style.left = el.offsetLeft + 'px'; } c2Matched = true; } else { el.className = 'flex-1 relative z-10 rounded-[10px] text-[11px] font-medium text-emerald-600/80 hover:text-emerald-700 transition-all duration-300'; } } }
            if(!c2Matched && c2Bg) c2Bg.style.opacity = '0';
            
            let cf3 = getSafeValue('cashFlowInput'); let c3Matched = false; const c3Bg = document.getElementById('cashPillBg');
            for(let i=1; i<=5; i++) { let el = document.getElementById('cashPill'+i); if(el) { let match = el.getAttribute('onclick').match(/\d+/); if(match && parseInt(match[0]) === cf3) { el.className = 'flex-1 relative z-10 rounded-[10px] text-[11px] font-bold text-emerald-700 transition-all duration-300 px-3 shrink-0'; if(c3Bg) { c3Bg.style.opacity = '1'; c3Bg.style.width = el.offsetWidth + 'px'; c3Bg.style.left = el.offsetLeft + 'px'; } c3Matched = true; } else { el.className = 'flex-1 relative z-10 rounded-[10px] text-[11px] font-medium text-emerald-600/80 hover:text-emerald-700 transition-all duration-300 px-3 shrink-0'; } } }
            if(!c3Matched && c3Bg) c3Bg.style.opacity = '0';
        } else {
            let cashMatched = false; const cashBg = document.getElementById('cashPillBg');
            for(let i=1; i<=5; i++) { let el = document.getElementById('cashPill'+i); if(el) { let match = el.getAttribute('onclick').match(/\d+/); if(match && parseInt(match[0]) === fCashFlow) { el.className = 'flex-1 relative z-10 rounded-[10px] text-[11px] font-bold text-emerald-700 transition-all duration-300'; if(cashBg) { cashBg.style.opacity = '1'; cashBg.style.width = el.offsetWidth + 'px'; cashBg.style.left = el.offsetLeft + 'px'; } cashMatched = true; } else { el.className = 'flex-1 relative z-10 rounded-[10px] text-[11px] font-medium text-emerald-600/80 hover:text-emerald-700 transition-all duration-300'; } } }
            if(!cashMatched && cashBg) cashBg.style.opacity = '0';
        }
    }, 10);
}

// ==================== DYNAMIC THEME ====================
function applyDayColorTheme() {
    const day = new Date().getDay(); 
    const themes = {
        0: 'bg-gradient-to-br from-[#E24634] to-[#C12516] border-[#E24634]/30 shadow-[0_10px_25px_rgba(226,70,52,0.35)]', 
        1: 'bg-gradient-to-br from-[#F5AB35] to-[#D4860D] border-[#F5AB35]/30 shadow-[0_10px_25px_rgba(245,171,53,0.35)]', 
        2: 'bg-gradient-to-br from-[#E73994] to-[#C11871] border-[#E73994]/30 shadow-[0_10px_25px_rgba(231,57,148,0.35)]', 
        3: 'bg-gradient-to-br from-[#93CD47] to-[#71A825] border-[#93CD47]/30 shadow-[0_10px_25px_rgba(147,205,71,0.35)]', 
        4: 'bg-gradient-to-br from-[#EF702B] to-[#C94E0C] border-[#EF702B]/30 shadow-[0_10px_25px_rgba(239,112,43,0.35)]', 
        5: 'bg-gradient-to-br from-[#53B9D6] to-[#2C95B3] border-[#53B9D6]/30 shadow-[0_10px_25px_rgba(83,185,214,0.35)]', 
        6: 'bg-gradient-to-br from-[#7D3CB9] to-[#592091] border-[#7D3CB9]/30 shadow-[0_10px_25px_rgba(125,60,185,0.35)]'  
    };
    const mainHeader = document.getElementById('mainHeaderBtn');
    if (mainHeader) mainHeader.className = `w-full rounded-[24px] py-4 px-4 flex flex-col items-center justify-center active:scale-[0.97] transition-all relative overflow-hidden group select-none cursor-pointer border ${themes[day]}`;
    const cashHeader = document.querySelector('#cashView > div > div.bg-gradient-to-br');
    if (cashHeader) cashHeader.className = `w-full rounded-[24px] py-5 px-4 flex flex-col items-center justify-center relative overflow-hidden border ${themes[day].replace('shadow-[0_10px_25px', 'shadow-[0_12px_30px')}`;
}

// ==================== APP ROUTING ====================
function getPlanAbbr(planName) {
    const abbrMap = { "CI Extra Plus": "CX", "Life Protector 20": "LPB", "Supreme Life Protector": "SLPA", "Signature Legacy": "SLB", "Convertable Term": "TLA", "Century Life + TPD": "CLA", "3D Health Excellence": "3D", "Whole Life Extra": "WXN", "24 TX": "TX", "868 / 818 Elite Saving": "Elite" };
    return abbrMap[planName] || planName;
}

function switchView(targetView) {
    if (targetView === 'table' || targetView === 'cash') {
        if (typeof calculate === 'function') calculate(currentMode, true);
        if (!lastCalculationData || lastCalculationData.premium === 0) { showCustomError("กรุณาตรวจสอบทุน/เบี้ย หรือกรอกตัวเลขให้ครบถ้วน"); return; }
        
        let minPrem = 4000; 
        if (currentAppPlan === 'Whole Life Extra' || currentAppPlan === '868 / 818 Elite Saving' || currentAppPlan === '24 TX') minPrem = 50000;
        if (currentAppPlan !== 'Signature Legacy' && lastCalculationData.premium < minPrem) {
            showCustomError(`เบี้ยประกันขั้นต่ำ ต้องไม่น้อยกว่า ${minPrem.toLocaleString()} บาท/ปี`); return;
        }
    }

    const views = { 'main': document.getElementById('mainView'), 'table': document.getElementById('tableView'), 'cash': document.getElementById('cashView') };
    const navBtns = { 'main': document.getElementById('navMainBtn'), 'table': document.getElementById('navTableBtn'), 'cash': document.getElementById('navCashBtn') };
    
    if (targetView === 'table') generatePolicyTableData();
    if (targetView === 'cash') refreshAllDisplays();
    
    Object.values(views).forEach(view => { if (view) view.classList.add('hidden'); });
    Object.values(navBtns).forEach(btn => { if (btn) btn.classList.remove('active'); });
    
    if (views[targetView]) views[targetView].classList.remove('hidden');
    if (navBtns[targetView]) navBtns[targetView].classList.add('active');
}

function openPlanModal() { renderUnifiedPlanList(allInsurancePlans); openPopup('planSelectModal'); }
function renderUnifiedPlanList(plans) {
    const container = document.getElementById('unifiedPlanList'); if (!container) return;
    container.innerHTML = plans.map(p => {
        const isActive = p.name === currentAppPlan;
        return `<button onclick="selectAppPlan('${p.name}')" class="w-full relative flex items-center text-left p-3.5 rounded-[20px] border ${isActive ? 'border-blue-400 bg-blue-50/50' : 'border-transparent bg-white shadow-sm'} group"><div class="w-12 h-12 rounded-[14px] ${p.bg} ${p.color} flex items-center justify-center text-[20px] shrink-0 mr-4 shadow-inner border border-white/50"><i class="${p.icon}"></i></div><div class="flex-1 pr-8"><h4 class="text-[15px] font-normal ${isActive ? 'text-blue-900 font-medium' : 'text-slate-800'} leading-tight mb-0.5">${p.name}</h4><p class="text-[11px] text-slate-500 font-medium leading-tight">${p.desc}</p></div></button>`;
    }).join('');
}
function handleUnifiedPlanSearch() {
    const query = document.getElementById('unifiedPlanSearchInput').value.toLowerCase();
    const filtered = allInsurancePlans.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query));
    renderUnifiedPlanList(filtered);
}

// ==================== PILLS & OPTIONS ====================
function updateQuickPills(planName) {
    const sumPillWrapper = document.getElementById('sumPillWrapper'); 
    const premPillContainer = document.getElementById('premiumPillContainer');
    if (!sumPillWrapper || !premPillContainer) return;
    
    const sumBgHtml = `<div id="sumPillBg" class="absolute top-1 bottom-1 bg-white rounded-[10px] shadow-[0_2px_8px_rgba(37,99,235,0.15)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] border border-blue-100/80 pointer-events-none opacity-0"></div>`;
    const premBgHtml = `<div id="premPillBg" class="absolute top-1 bottom-1 bg-white rounded-[10px] shadow-[0_2px_8px_rgba(37,99,235,0.15)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] border border-blue-100/80 pointer-events-none opacity-0"></div>`;
    const inactiveClass = `flex-1 relative z-10 rounded-[10px] text-[11px] font-medium text-slate-500 hover:text-slate-700 transition-all duration-300 plan-pill`;
    
    if (planName === 'Signature Legacy') {
        sumPillWrapper.innerHTML = sumBgHtml + `<button id="sumPill1" onclick="setQuickSum(5000000)" class="${inactiveClass}">5 ล้าน</button><button id="sumPill2" onclick="setQuickSum(10000000)" class="${inactiveClass}">10 ล้าน</button><button id="sumPill3" onclick="setQuickSum(20000000)" class="${inactiveClass}">20 ล้าน</button><button id="sumPill4" onclick="setQuickSum(50000000)" class="${inactiveClass}">50 ล้าน</button><button id="sumPill5" onclick="setQuickSum(100000000)" class="${inactiveClass}">100 ล้าน</button>`;
        premPillContainer.innerHTML = premBgHtml + `<button id="premPill1" onclick="setQuickPremium(100000)" class="${inactiveClass}">1 แสน</button><button id="premPill2" onclick="setQuickPremium(300000)" class="${inactiveClass}">3 แสน</button><button id="premPill3" onclick="setQuickPremium(500000)" class="${inactiveClass}">5 แสน</button><button id="premPill4" onclick="setQuickPremium(1000000)" class="${inactiveClass}">1 ล้าน</button><button id="premPill5" onclick="setQuickPremium(2000000)" class="${inactiveClass}">2 ล้าน</button>`;
    } else if (planName === 'Whole Life Extra' || planName === '868 / 818 Elite Saving' || planName === '24 TX') {
        sumPillWrapper.innerHTML = ''; 
        premPillContainer.innerHTML = premBgHtml + `<button id="premPill1" onclick="setQuickPremium(120000)" class="${inactiveClass}">1.2 แสน</button><button id="premPill2" onclick="setQuickPremium(240000)" class="${inactiveClass}">2.4 แสน</button><button id="premPill3" onclick="setQuickPremium(360000)" class="${inactiveClass}">3.6 แสน</button><button id="premPill4" onclick="setQuickPremium(480000)" class="${inactiveClass}">4.8 แสน</button><button id="premPill5" onclick="setQuickPremium(560000)" class="${inactiveClass}">5.6 แสน</button>`;
    } else if (planName === 'Life Protector 20' || planName === 'Supreme Life Protector') {
        sumPillWrapper.innerHTML = sumBgHtml + `<button id="sumPill1" onclick="setQuickSum(500000)" class="${inactiveClass}">5 แสน</button><button id="sumPill2" onclick="setQuickSum(1000000)" class="${inactiveClass}">1 ล้าน</button><button id="sumPill3" onclick="setQuickSum(3000000)" class="${inactiveClass}">3 ล้าน</button><button id="sumPill4" onclick="setQuickSum(5000000)" class="${inactiveClass}">5 ล้าน</button><button id="sumPill5" onclick="setQuickSum(10000000)" class="${inactiveClass}">10 ล้าน</button>`;
        premPillContainer.innerHTML = premBgHtml + `<button id="premPill1" onclick="setQuickPremium(120000)" class="${inactiveClass}">1.2 แสน</button><button id="premPill2" onclick="setQuickPremium(240000)" class="${inactiveClass}">2.4 แสน</button><button id="premPill3" onclick="setQuickPremium(360000)" class="${inactiveClass}">3.6 แสน</button><button id="premPill4" onclick="setQuickPremium(480000)" class="${inactiveClass}">4.8 แสน</button><button id="premPill5" onclick="setQuickPremium(600000)" class="${inactiveClass}">6.0 แสน</button>`;
    } else {
        if (planName === 'Convertable Term') {
            sumPillWrapper.innerHTML = sumBgHtml + `<button id="sumPill1" onclick="setQuickSum(1000000)" class="${inactiveClass}">1 ล้าน</button><button id="sumPill2" onclick="setQuickSum(2000000)" class="${inactiveClass}">2 ล้าน</button><button id="sumPill3" onclick="setQuickSum(3000000)" class="${inactiveClass}">3 ล้าน</button><button id="sumPill4" onclick="setQuickSum(4000000)" class="${inactiveClass}">4 ล้าน</button><button id="sumPill5" onclick="setQuickSum(5000000)" class="${inactiveClass}">5 ล้าน</button>`;
        } else {
            sumPillWrapper.innerHTML = sumBgHtml + `<button id="sumPill1" onclick="setQuickSum(100000)" class="${inactiveClass}">1 แสน</button><button id="sumPill2" onclick="setQuickSum(500000)" class="${inactiveClass}">5 แสน</button><button id="sumPill3" onclick="setQuickSum(1000000)" class="${inactiveClass}">1 ล้าน</button><button id="sumPill4" onclick="setQuickSum(3000000)" class="${inactiveClass}">3 ล้าน</button><button id="sumPill5" onclick="setQuickSum(5000000)" class="${inactiveClass}">5 ล้าน</button>`;
        }
        premPillContainer.innerHTML = premBgHtml + `<button id="premPill1" onclick="setQuickPremium(12000)" class="${inactiveClass}">12,000</button><button id="premPill2" onclick="setQuickPremium(24000)" class="${inactiveClass}">24,000</button><button id="premPill3" onclick="setQuickPremium(36000)" class="${inactiveClass}">36,000</button><button id="premPill4" onclick="setQuickPremium(48000)" class="${inactiveClass}">48,000</button><button id="premPill5" onclick="setQuickPremium(60000)" class="${inactiveClass}">60,000</button>`;
    }
    
    // ตั้งค่ากล่อง Cashflow ให้เลื่อนสไลด์ได้สำหรับ Elite และ 24TX
    const cFlowBox1 = document.getElementById('singleCashFlowBox');
    if (cFlowBox1 && (planName === '24 TX' || planName === '868 / 818 Elite Saving')) {
        let pillsHtml = `<div id="cashPillBg" class="absolute top-1 bottom-1 bg-white rounded-[10px] shadow-[0_2px_8px_rgba(16,185,129,0.2)] transition-all duration-300 opacity-0 border border-emerald-100 pointer-events-none"></div>`;
        pillsHtml += `<div class="flex p-1 bg-emerald-100/60 rounded-[14px] relative shadow-inner border border-emerald-200/50 mb-3 h-[42px] overflow-x-auto whitespace-nowrap custom-scrollbar w-full" style="scroll-snap-type: x mandatory;">`;
        const inactiveCFClass = `flex-1 relative z-10 rounded-[10px] text-[11px] font-medium text-emerald-600/80 hover:text-emerald-700 transition-all px-3 shrink-0 scroll-snap-align-start`;
        pillsHtml += `<button id="cashPill1" onclick="setQuickCashFlow(10000)" class="${inactiveCFClass}">1 หมื่น</button>`;
        pillsHtml += `<button id="cashPill2" onclick="setQuickCashFlow(50000)" class="${inactiveCFClass}">5 หมื่น</button>`;
        pillsHtml += `<button id="cashPill3" onclick="setQuickCashFlow(100000)" class="${inactiveCFClass}">1 แสน</button>`;
        pillsHtml += `<button id="cashPill4" onclick="setQuickCashFlow(200000)" class="${inactiveCFClass}">2 แสน</button>`;
        pillsHtml += `<button id="cashPill5" onclick="setQuickCashFlow(300000)" class="${inactiveCFClass}">3 แสน</button>`;
        pillsHtml += `<button id="cashPill6" onclick="setQuickCashFlow(500000)" class="${inactiveCFClass}">5 แสน</button>`;
        pillsHtml += `</div><div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold text-lg">฿</span><input type="text" id="cashFlowInput" value="0" class="input-box-rounded pl-8 text-emerald-700 bg-white focus:ring-emerald-500" oninput="handleCashFlowInput(this, 0)"></div>`;
        cFlowBox1.innerHTML = pillsHtml;
    }

    if (lastCalculationData) highlightActivePills(lastCalculationData.sum, lastCalculationData.premium, lastCalculationData.cashFlow || 0);
}

function render3DOptionsUI() {
    const container = document.getElementById('threeDExtraOptions');
    if (!container) return;
    
    container.className = 'flex flex-col gap-3 shrink-0 mt-2 mb-2 w-full';
    
    let hxVal = window.currentHX || 'HX15'; let hxoVal = window.currentHXO || 'ไม่เลือก';
    let hxdVal = window.currentHXD || 'ไม่เลือก'; let hbfVal = window.currentHBF || 'ไม่เลือก';

    const hxOpts = ['HX15', 'HX20', 'HX40', 'HX60', 'HX150', 'HX300'];
    const hxoOpts = ['ไม่เลือก', 'HX010', 'HX020', 'HX030', 'HX050'];
    const hxdOpts = ['ไม่เลือก', 'HXD100', 'HXD200', 'HXD500', 'HXD1000'];
    const hbfOpts = ['ไม่เลือก', 'HBF500', 'HBF1000', 'HBF1500', 'HBF2000', 'HBF3000'];

    const createPills = (title, opts, currentVal, fnName, locked, iconClass, colorClass) => {
        let html = `<div><p class="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center gap-1.5"><i class="${iconClass} ${colorClass}"></i> ${title}</p>`;
        html += `<div class="flex p-1 bg-slate-100/80 rounded-[14px] relative shadow-inner border border-slate-200/60 h-[42px] overflow-x-auto whitespace-nowrap custom-scrollbar w-full" style="scroll-snap-type: x mandatory;">`;
        opts.forEach(opt => {
            let isSel = opt === currentVal;
            let baseCls = `relative z-10 rounded-[10px] text-[11px] font-medium transition-all duration-300 px-4 shrink-0 scroll-snap-align-start flex items-center justify-center `;
            if (locked && opt !== 'ไม่เลือก') { baseCls += `text-slate-400 opacity-60 cursor-not-allowed`; } 
            else if (isSel) { baseCls += `bg-white text-blue-700 font-bold shadow-sm border border-blue-100/80`; } 
            else { baseCls += `text-slate-500 hover:text-slate-700 hover:bg-slate-50/50`; }
            let onclick = (locked && opt !== 'ไม่เลือก') ? '' : `onclick="${fnName}('${opt}')"`;
            html += `<button ${onclick} class="${baseCls}">${opt}</button>`;
        });
        html += `</div></div>`;
        return html;
    };

    let html = createPills('ค่าห้อง (HX)', hxOpts, hxVal, 'setHX', false, 'fas fa-bed', 'text-teal-500');
    html += createPills('EXTRA (HXO)', hxoOpts, hxoVal, 'setHXO', false, 'fas fa-plus-circle', 'text-blue-500');
    
    let hxdLocked = (hxoVal === 'ไม่เลือก');
    if (hxdLocked && hxdVal !== 'ไม่เลือก') { window.currentHXD = 'ไม่เลือก'; hxdVal = 'ไม่เลือก'; }
    
    html += createPills('ADVANCE (HXD)', hxdOpts, hxdVal, 'setHXD', hxdLocked, 'fas fa-star', 'text-indigo-500');
    html += createPills('ชดเชยรายวัน (HBF)', hbfOpts, hbfVal, 'setHBF', false, 'fas fa-heartbeat', 'text-rose-500');

    container.innerHTML = html;
}

window.setHX = function(val) { window.currentHX = val; render3DOptionsUI(); if(typeof calculate === 'function') calculate(currentMode, true); };
window.setHXO = function(val) { window.currentHXO = val; render3DOptionsUI(); if(typeof calculate === 'function') calculate(currentMode, true); };
window.setHXD = function(val) { window.currentHXD = val; render3DOptionsUI(); if(typeof calculate === 'function') calculate(currentMode, true); };
window.setHBF = function(val) { window.currentHBF = val; render3DOptionsUI(); if(typeof calculate === 'function') calculate(currentMode, true); };

// ==================== CONDITIONS MODALS (Long Press) ====================
function getConditionsHTML(planName) {
    const pd = window.PRODUCT_CONDITIONS && window.PRODUCT_CONDITIONS[planName];
    if (!pd) return '<div class="text-center text-slate-500 py-4 font-medium">ไม่พบข้อมูลเงื่อนไขของแบบประกันนี้</div>';
    
    let html = '<div class="overflow-y-auto max-h-[55vh] space-y-3 pr-0.5 custom-scrollbar">';
    
    if (pd.conditions && pd.conditions.length) {
        let shortConditions = pd.conditions.filter(c => c.includes('อายุ') || c.includes('ทุน'));
        if (shortConditions.length > 0) {
            html += '<div><p class="text-[10px] font-black text-blue-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5"><i class="fas fa-clipboard-list text-blue-500"></i> เงื่อนไขรับประกัน</p><div class="space-y-1.5">';
            html += shortConditions.map(c => `<div class="bg-blue-50 p-2 rounded-xl border border-blue-100 flex items-start gap-2"><i class="fas fa-info-circle text-blue-500 mt-0.5 text-[12px] shrink-0"></i><span class="text-[12px] text-slate-700 font-bold">${c}</span></div>`).join('');
            html += '</div></div>';
        } else {
            html += '<div class="text-center text-slate-500 py-4 font-medium">ไม่มีเงื่อนไขพิเศษที่ระบุอายุ/ทุน</div>';
        }
    } else {
        html += '<div class="text-center text-slate-500 py-4 font-medium">ไม่พบข้อมูลเงื่อนไขของแบบประกันนี้</div>';
    }
    html += '</div>';
    return html;
}

function updateConditionsModal(planName) {
    const el = document.querySelector('#insuranceConditionsModal .text-left');
    if (el) el.innerHTML = getConditionsHTML(planName); 
}

function replacePercentWithAmount(text, sum, premium) {
    return text.replace(/(\d+(?:\.\d+)?)%\s*ของทุน(?:ประกัน)?/g, (match, p1) => {
        let percent = parseFloat(p1); let amount = sum * (percent / 100); return `<span class="font-bold text-slate-800">${formatNum(amount)} บาท</span>`;
    }).replace(/(\d+(?:\.\d+)?)%\s*ของเบี้ย(?:ประกัน)?/g, (match, p1) => {
        let percent = parseFloat(p1); let amount = premium * (percent / 100); return `<span class="font-bold text-slate-800">${formatNum(amount)} บาท</span>`;
    });
}

function selectAppPlan(planName) {
    if (planName === 'Medical Fund') { showCustomError("ระบบ Medical Fund อยู่ระหว่างการพัฒนา"); return; }

    closePopup('planSelectModal'); 
    currentAppPlan = planName; 
    currentMode = 'sum'; 
    
    const config = PLAN_CONFIG[planName] || PLAN_CONFIG["CI Extra Plus"];
    const inputAge = document.getElementById('ageInput');
    inputAge.value = config.minAge !== undefined ? config.minAge : 0;
    
    document.getElementById('headerTitleText').innerText = planName;
    const planInfo = allInsurancePlans.find(p => p.name === planName);
    if (planInfo) setText('headerDescText', planInfo.desc);
    
    currentPlanOptions = config.options || [];
    let ageInputVal = parseInt(inputAge.value) || 0;
    if (planName === '868 / 818 Elite Saving') {
        currentPlan = ageInputVal <= 50 ? 'S868' : 'S818';
    } else {
        currentPlan = currentPlanOptions[0] || ''; 
    }
    
    const planSelectionWrapper = document.getElementById('planSelectionWrapper');
    if(planSelectionWrapper) { 
        if ((config.options && config.options.length <= 1) || planName === '868 / 818 Elite Saving') {
            planSelectionWrapper.classList.add('hidden');
        } else {
            planSelectionWrapper.classList.remove('hidden');
        }
    }
    
    const pLabel = document.getElementById('premiumLabel'); 
    const pPills = document.getElementById('premiumPillContainer');
    const premiumContainer = document.getElementById('premiumContainer');
    const premiumInput = document.getElementById('premiumInput');
    const cashFlowContainer = document.getElementById('cashFlowContainer');
    const sumInsuredContainer = document.getElementById('sumInsuredContainer');
    const extraOptions = document.getElementById('threeDExtraOptions');
    const hxRoomRateContainer = document.getElementById('hxRoomRateContainer');
    const mainActionBtn = document.getElementById('mainActionBtn');
    const globalMFContainer = document.getElementById('globalMFContainer'); 
    
    premiumInput.readOnly = false;

    if (planName === 'Whole Life Extra' || planName === '868 / 818 Elite Saving') {
        currentMode = 'premium'; 
        document.getElementById('premiumInput').value = "50,000";
        if(sumInsuredContainer) sumInsuredContainer.classList.add('hidden'); 
        if(premiumContainer) premiumContainer.classList.remove('hidden');
        if(cashFlowContainer) {
            cashFlowContainer.classList.remove('hidden');
            if(planName === 'Whole Life Extra') {
                document.getElementById('singleCashFlowBox').classList.add('hidden');
                document.getElementById('dualCashFlowBox').classList.remove('hidden');
                document.getElementById('dualCashFlowBox').classList.add('flex');
            } else { 
                document.getElementById('singleCashFlowBox').classList.remove('hidden');
                document.getElementById('dualCashFlowBox').classList.add('hidden');
                document.getElementById('dualCashFlowBox').classList.remove('flex');
            }
        }
    } else if (planName === '24 TX') {
        currentMode = 'premium'; 
        document.getElementById('premiumInput').value = "50,000";
        if(sumInsuredContainer) sumInsuredContainer.classList.add('hidden'); 
        if(premiumContainer) premiumContainer.classList.remove('hidden');
        if(cashFlowContainer) {
            cashFlowContainer.classList.remove('hidden');
            document.getElementById('singleCashFlowBox').classList.remove('hidden');
            document.getElementById('dualCashFlowBox').classList.add('hidden');
            document.getElementById('dualCashFlowBox').classList.remove('flex');
        }
    } else if (planName === 'Life Protector 20' || planName === 'Supreme Life Protector') {
        currentMode = 'premium';
        document.getElementById('sumInsuredInput').value = "500,000";
        document.getElementById('premiumInput').value = "120,000"; 
        if(sumInsuredContainer) sumInsuredContainer.classList.remove('hidden');
        if(premiumContainer) premiumContainer.classList.remove('hidden');
        if(cashFlowContainer) cashFlowContainer.classList.add('hidden');
    } else if (planName === 'Convertable Term') {
        currentMode = 'sum';
        document.getElementById('sumInsuredInput').value = "1,000,000";
        if(sumInsuredContainer) sumInsuredContainer.classList.remove('hidden');
        if(premiumContainer) premiumContainer.classList.remove('hidden');
        if(cashFlowContainer) cashFlowContainer.classList.add('hidden');
    } else {
        document.getElementById('sumInsuredInput').value = (config.minSum || 100000).toLocaleString();
        if(sumInsuredContainer) sumInsuredContainer.classList.remove('hidden');
        if(premiumContainer) premiumContainer.classList.remove('hidden');
        if(cashFlowContainer) {
            if (config.hasCashFlow) {
                cashFlowContainer.classList.remove('hidden');
                document.getElementById('singleCashFlowBox').classList.remove('hidden');
                document.getElementById('dualCashFlowBox').classList.add('hidden');
                document.getElementById('dualCashFlowBox').classList.remove('flex');
            } else {
                cashFlowContainer.classList.add('hidden');
            }
        }
    }
    
    if (planName === '3D Health Excellence') {
        if(hxRoomRateContainer) hxRoomRateContainer.classList.add('hidden'); 
        if(extraOptions) { extraOptions.classList.remove('hidden'); render3DOptionsUI(); } 
        if(pPills) pPills.classList.add('hidden');
        premiumInput.readOnly = true;
        if(pLabel) pLabel.innerText = "เบี้ยประกัน (บาท)"; 
    } else {
        if(extraOptions) { extraOptions.classList.remove('flex'); extraOptions.classList.add('hidden'); }
        if(hxRoomRateContainer) hxRoomRateContainer.classList.add('hidden');
    }

    if (['Whole Life Extra', '24 TX', '868 / 818 Elite Saving', '3D Health Excellence'].includes(planName)) {
        if (globalMFContainer) globalMFContainer.classList.remove('hidden');
    } else {
        if (globalMFContainer) globalMFContainer.classList.add('hidden');
    }

    if (['Signature Legacy', 'Convertable Term'].includes(planName)) {
        if(pLabel) pLabel.innerText = "เบี้ยประกัน (บาท)"; if(pPills) pPills.classList.add('hidden'); 
    } else if (planName !== '3D Health Excellence') {
        if(pLabel) pLabel.innerText = "ออมเงิน (บาท/ปี)"; if(pPills) pPills.classList.remove('hidden');
    }
    
    if (mainActionBtn) {
        if (planName === "Whole Life Extra") {
            mainActionBtn.innerHTML = `<i class="fas fa-table text-lg"></i> ตารางมูลค่า`; 
            mainActionBtn.onclick = function() { switchView('table'); };
        } else {
            mainActionBtn.innerHTML = `<i class="fas fa-file-alt text-lg"></i> ดูรายละเอียด`; 
            mainActionBtn.onclick = function() { manualTriggerPopup(); };
        }
    }
    
    updateConditionsModal(planName); 
    setPlan(currentPlan);
    updateQuickPills(planName);
}

function setPlan(plan) { 
    currentPlan = plan; 
    const btns = [document.getElementById('btnPlan1'), document.getElementById('btnPlan2'), document.getElementById('btnPlan3'), document.getElementById('btnPlan4')];
    let activeBtn = null;
    btns.forEach((btn, idx) => {
        if (!btn) return;
        if (idx < currentPlanOptions.length) {
            let displayLabel = currentPlanOptions[idx];
            if (currentAppPlan === 'Century Life + TPD' || currentAppPlan === '3D Health Excellence') {
                displayLabel = displayLabel.replace('CL', ''); 
            }
            btn.innerText = displayLabel;
            btn.classList.remove('hidden');
            btn.onclick = () => setPlan(currentPlanOptions[idx]);
            const isTarget = plan === currentPlanOptions[idx];
            if (isTarget) { btn.className = 'flex-1 relative z-10 rounded-[10px] text-[14px] font-bold text-blue-700 transition-all duration-300 plan-pill'; activeBtn = btn; } 
            else { btn.className = 'flex-1 relative z-10 rounded-[10px] text-[14px] font-medium text-slate-500 hover:text-slate-700 transition-all duration-300 plan-pill'; }
        } else { btn.classList.add('hidden'); }
    });
    
    const planBg = document.getElementById('planBg');
    if (planBg && activeBtn) { setTimeout(() => { planBg.style.width = activeBtn.offsetWidth + 'px'; planBg.style.left = activeBtn.offsetLeft + 'px'; }, 10); }
    
    calculate(currentMode, true);
}

// ==================== UNIVERSAL MODAL (View Details) ====================
function injectDynamicModals() {
    if (!document.getElementById('dynamicResultModal')) {
        const modalHtml = `<div id="dynamicResultModal" class="modal-overlay hidden"><div class="modal-content-card !max-w-[22rem]"><div class="bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] p-5 pt-6 text-center text-white flex-shrink-0 relative"><button onclick="closePopup('dynamicResultModal')" class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all text-[16px] font-bold shadow-md active:scale-90 z-[100] bg-red-500 text-white border border-red-600 hover:bg-red-600"><i class="fas fa-times"></i></button><h3 class="text-[20px] font-bold tracking-tight drop-shadow-md">สรุปรายละเอียด</h3></div><div class="overflow-y-auto flex-1 custom-scrollbar p-4 pb-5 bg-white"><div class="flex gap-2.5 mb-3.5"><div class="flex-1 text-center py-2.5 bg-slate-50 rounded-[14px] border border-slate-100"><span class="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">เพศ</span><span id="dynModalGender" class="text-[15px] font-bold text-slate-800">-</span></div><div class="flex-1 text-center py-2.5 bg-slate-50 rounded-[14px] border border-slate-100"><span class="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">อายุ</span><span id="dynModalAge" class="text-[15px] font-bold text-slate-800">-</span></div><div class="flex-1 text-center py-2.5 bg-slate-50 rounded-[14px] border border-slate-100"><span class="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">ระยะออม</span><span id="dynModalYears" class="text-[15px] font-bold text-slate-800">-</span></div></div><div class="flex justify-between items-center p-3.5 bg-blue-50/70 rounded-[14px] border border-blue-100 border-l-[6px] border-l-blue-500 mb-3"><span class="text-[13px] text-blue-900 font-bold flex items-center gap-2"><i class="fas fa-wallet text-blue-500"></i> เบี้ย/ออมเงิน</span><span id="dynModalPremium" class="text-[18px] font-extrabold text-blue-700">0</span></div><div id="dynModalSumContainer" class="flex justify-between items-center p-3.5 bg-emerald-50/70 rounded-[14px] border border-emerald-100 border-l-[6px] border-l-emerald-500 mb-3"><span class="text-[13px] text-emerald-900 font-bold flex items-center gap-2"><i class="fas fa-shield-halved text-emerald-500"></i> ทุน/วงเงิน</span><span id="dynModalSum" class="text-[18px] font-extrabold text-emerald-700">0</span></div><div id="dynModalBenefits" class="space-y-3"></div><div class="mt-4 pt-4 border-t border-slate-100"><button onclick="openGenericShareModal('all')" class="w-full bg-[#059669] hover:bg-[#047857] text-white py-3.5 rounded-[16px] font-bold flex justify-center items-center gap-2 text-[15px] shadow-[0_8px_20px_rgba(16,185,129,0.3)] active:scale-95 transition-all"><i class="fas fa-share-nodes text-xl"></i> แชร์ข้อมูลสรุปทั้งหมด</button></div></div></div></div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
    if (!document.getElementById('maturityExtraModal')) {
        const mHtml = `<div id="maturityExtraModal" class="modal-overlay hidden"><div class="modal-content-card p-5 text-center"><div class="flex justify-between items-center mb-3 border-b border-slate-100 pb-2.5"><h3 class="text-base font-bold text-indigo-900"><i class="fas fa-info-circle mr-2 text-indigo-600"></i> เงื่อนไขจากไปหรือครบสัญญา</h3><button onclick="closePopup('maturityExtraModal')" class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all text-[16px] font-bold shadow-md active:scale-90 z-[100] bg-red-500 text-white border border-red-600 hover:bg-red-600"><i class="fas fa-times"></i></button></div><div class="text-left text-xs font-medium text-slate-700 space-y-2"><p class="bg-indigo-50 p-3 rounded-xl border border-indigo-100">รับ 105% ของทุนประกัน หากไม่เคยเคลมโรคร้ายแรงระยะรุนแรง</p><p class="bg-rose-50 p-3 rounded-xl border border-rose-100 text-rose-700">*หากเคยเคลมโรคร้ายระยะเริ่มต้น (25%) หรือรุนแรง (100%) บริษัทจะหักออกจาก 105% นี้ และจ่ายส่วนต่างให้ (ถ้ามี)</p></div></div></div>`;
        document.body.insertAdjacentHTML('beforeend', mHtml);
    }
}

function manualTriggerPopup() { 
    try {
        calculate(currentMode, true); 
        const calcData = lastCalculationData;
        if (!calcData || calcData.premium === 0) { showCustomError("กรุณากรอกข้อมูลและคำนวณเบี้ยให้ครบถ้วนก่อน"); return; }
        
        let minPrem = 4000; 
        if (currentAppPlan === 'Whole Life Extra' || currentAppPlan === '868 / 818 Elite Saving' || currentAppPlan === '24 TX') minPrem = 50000;
        if (currentAppPlan !== 'Signature Legacy' && calcData.premium < minPrem) {
            showCustomError(`เบี้ยประกันขั้นต่ำ ต้องไม่น้อยกว่า ${minPrem.toLocaleString()} บาท/ปี`); return;
        }
        
        if (currentAppPlan === 'Medical Fund') { showCustomError(`ระบบดูรายละเอียดของ ${currentAppPlan} อยู่ระหว่างการพัฒนา`); return; }
        openUniversalModal(calcData);
        
    } catch(e) { console.error(e); showCustomError("เกิดข้อผิดพลาดในการดึงข้อมูลรายละเอียด"); }
}

function openUniversalModal(d) {
    if(!d) return;
    injectDynamicModals();
    
    if (currentAppPlan === 'Signature Legacy') {
        setText('modalSLBGender', d.gender); setText('modalSLBAge', d.age + " ปี"); setText('modalSLBYears', d.years + " ปี"); 
        setText('modalSLBPremium', Math.round(d.premium).toLocaleString()); setText('modalSLBSum', formatNum(d.sum)); 
        let accidentalTotal = d.sum + Math.min(d.sum, 100000000); setText('modalSLBAccident', formatNum(accidentalTotal));
        setText('modalSLBCancer', formatNum(Math.min(d.sum * 0.30, 30000000))); let terminalMaxCap = (d.age >= 60 && d.age <= 70) ? 50000000 : 100000000;
        setText('modalSLBTerminal', formatNum(Math.min(d.sum * 0.90, terminalMaxCap))); setText('modalSLBTerminalNote', `* หากรับเงินก้อนมะเร็ง 30% ไปแล้ว จะหักออกจากยอดนี้`);
        openPopup('slbResultModal'); 
    } 
    else if (currentAppPlan === 'CI Extra Plus') {
        setText('modalGender', d.gender); setText('modalAge', d.age + " ปี"); setText('modalYears', d.years + " ปี"); 
        setText('modalPremium', Math.round(d.premium).toLocaleString()); setText('modalSum', formatNum(d.sum)); 
        const childRow = document.getElementById('modalChildRow'); 
        if (childRow) {
            if (d.age >= 0 && d.age <= 15) { childRow.classList.remove('hidden'); childRow.classList.add('flex'); setText('modalChildCI', formatNum(d.sum)); } 
            else { childRow.classList.add('hidden'); childRow.classList.remove('flex'); } 
        }
        
        const extraCIRow = document.getElementById('modalExtraCI')?.closest('.flex-col');
        const majorCIRow = document.getElementById('modalMajorCI')?.closest('.flex-col');
        const maturityRow = document.getElementById('modalMaturity')?.closest('.flex-col');

        if (extraCIRow) { extraCIRow.classList.remove('hidden'); extraCIRow.classList.add('flex'); }
        if (majorCIRow) { majorCIRow.classList.remove('hidden'); majorCIRow.classList.add('flex'); }
        if (maturityRow) { maturityRow.classList.remove('hidden'); maturityRow.classList.add('flex'); }

        setText('modalExtraCI', formatNum(d.sum * 0.25)); setText('modalMajorCI', formatNum(d.sum * 0.75));
        setText('modalMedExtra1Popup', formatNum(d.sum * 0.10)); setText('modalMaturity', formatNum(d.sum * 1.05)); setText('modalMaturityExtraPopup', formatNum(d.sum * 0.05));
        
        const dynamicB = document.getElementById('modalDynamicBenefits');
        if (dynamicB) { dynamicB.innerHTML = ''; dynamicB.classList.add('hidden'); }
        
        openPopup('resultModal'); 
    }
    else {
        // ใช้ dynamicResultModal สำหรับแผนอื่นๆ (CL, TLA, Elite, 3D ฯลฯ)
        setText('dynModalGender', d.gender); setText('dynModalAge', d.age + " ปี"); setText('dynModalYears', d.years + " ปี"); 
        setText('dynModalPremium', Math.round(d.premium).toLocaleString()); 
        
        if (currentAppPlan === '3D Health Excellence' || currentAppPlan === '868 / 818 Elite Saving') {
            document.getElementById('dynModalSumContainer').classList.add('hidden');
        } else {
            document.getElementById('dynModalSumContainer').classList.remove('hidden');
            setText('dynModalSum', formatNum(d.sum)); 
        }
        
        let dynamicContainer = document.getElementById('dynModalBenefits');
        let html = '';
        const pd = window.PRODUCT_CONDITIONS && window.PRODUCT_CONDITIONS[currentAppPlan];
        
        if (pd && pd.benefits && pd.benefits.length > 0) {
            html += '<p class="text-[11px] font-black text-emerald-700 mb-2 uppercase tracking-wider flex items-center gap-1.5"><i class="fas fa-shield-alt text-emerald-500"></i> ความคุ้มครองหลัก</p>';
            pd.benefits.forEach((b) => {
                let calcB = replacePercentWithAmount(b, d.sum, d.premium);
                let emojiMatch = calcB.match(/^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/);
                let emoji = emojiMatch ? emojiMatch[0] : '🔹';
                let textClean = calcB.replace(/^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])\s*/, '');
                
                let title = textClean; let valStr = '';
                if (textClean.includes(':')) {
                    let parts = textClean.split(':'); title = parts[0]; valStr = parts.slice(1).join(':').trim();
                }

                html += `<div class="flex flex-col p-3.5 bg-blue-50/70 rounded-[14px] border border-blue-100 mb-2.5">
                            <div class="flex justify-between items-center gap-2">
                                <span class="text-[12px] text-blue-900 font-bold flex items-center gap-1.5 leading-tight">${emoji} ${title}</span>
                                ${valStr ? `<span class="text-[13px] font-extrabold text-blue-700 text-right shrink-0">${valStr}</span>` : ''}
                            </div>
                        </div>`;
            });
        } else {
            html += `<div class="flex flex-col p-3.5 bg-slate-50 rounded-[14px] border border-slate-200 text-center"><p class="text-[12px] text-slate-500 font-bold">กรุณาดูรายละเอียดเพิ่มเติมในตารางมูลค่า</p></div>`;
        }
        
        if (pd && pd.remark) {
             html += `<div class="bg-slate-50 p-2.5 rounded-[12px] border border-slate-100 mt-2"><p class="text-[10px] text-slate-500 italic font-medium leading-relaxed">${pd.remark.replace(/\n/g, '<br>')}</p></div>`;
        }
        dynamicContainer.innerHTML = html;
        openPopup('dynamicResultModal'); 
    }
}

// ==================== CASH MODULE DISPLAYS ====================
function getComRateArray(planKey) {
    if (typeof COM_RATES === 'undefined') return [];
    let planData = COM_RATES[planKey]; if (!planData) return []; if (Array.isArray(planData)) return planData;

    let age = 0;
    if (typeof lastCalculationData !== 'undefined' && lastCalculationData && lastCalculationData.age !== undefined) { age = lastCalculationData.age; } 
    else { const ageInput = document.getElementById('ageInput'); age = ageInput ? (parseInt(ageInput.value) || 0) : 0; }

    for (let key in planData) {
        if (key.includes('-')) {
            let parts = key.split('-'); let min = parseInt(parts[0], 10); let max = parseInt(parts[1], 10);
            if (age >= min && age <= max) {
                let rateData = planData[key];
                if (typeof rateData === 'string') { let mainRateKey = currentAppPlan === '24 TX' ? '24TX' : currentPlan; return getComRateArray(mainRateKey); }
                return Array.isArray(rateData) ? rateData : [];
            }
        }
    }
    for (let key in planData) { if (Array.isArray(planData[key])) return planData[key]; }
    return [];
}

function updateMBDisplay() { 
    let rateKey = currentAppPlan === '24 TX' ? '24TX' : currentPlan;
    const effectivePlan = (typeof COM_RATES !== 'undefined' && COM_RATES[rateKey]) ? rateKey : currentAppPlan; 
    const rateArr = getComRateArray(effectivePlan);
    if (typeof lastCalculationData === 'undefined' || !lastCalculationData || rateArr.length === 0) return; 
    
    const p = lastCalculationData.premium || 0; const fycFromCase = Math.round(p * (rateArr[0] || 0)) || 0; 
    const existingFYC = getSafeValue('existingFYCInput'); const totalFYC = fycFromCase + existingFYC; 
    const tiers = [{min:8000, max: 16000, rate:0.20}, {min:16001, max: 32000, rate:0.25}, {min:32001, max: 64000, rate:0.30}, {min:64001, max: Infinity, rate:0.35}]; 
    let curIdx = -1; tiers.forEach((t, i) => { if (totalFYC >= t.min) curIdx = i; }); const currentRate = curIdx >= 0 ? tiers[curIdx].rate : 0; 
    
    setText('mbCalculatedBonus', Math.round(totalFYC * currentRate).toLocaleString() + " บาท"); setText('mbTotalFYCDisplay', totalFYC.toLocaleString());
    let tierHtml = '';
    tiers.forEach((t, i) => {
        const isActive = (curIdx === i);
        tierHtml += `<div class="flex justify-between items-center p-3 rounded-[16px] border ${isActive ? 'border-[#10b981] bg-[#ecfdf5]' : 'border-slate-100 bg-white'} mb-2 shadow-sm"><span class="text-[14px] font-bold ${isActive ? 'text-[#065f46]' : 'text-slate-600'}">${t.min.toLocaleString()} - ${t.max === Infinity ? 'ขึ้นไป' : t.max.toLocaleString()}</span><span class="text-[14px] font-black px-4 py-1.5 rounded-xl ${isActive ? 'bg-[#10b981]/20 text-[#047857]' : 'text-slate-800'}">${formatPct(t.rate * 100)}</span></div>`;
    });
    document.getElementById('mbTierList').innerHTML = tierHtml;
    setText('mbCaseFYCDisplay', fycFromCase.toLocaleString()); setText('mbExistingFYCDisplay', existingFYC.toLocaleString());
    setText('mbBonusCalcMethod', `(${totalFYC.toLocaleString()} x ${formatPct(currentRate * 100)})`);
    if (document.getElementById('caseIncomeBonusCalc')) document.getElementById('caseIncomeBonusCalc').innerText = `(${fycFromCase.toLocaleString()} x ${formatPct(currentRate * 100)})`;

    window.currentMBBonus = Math.round(fycFromCase * currentRate);
    const adviceBox = document.getElementById('mbAdviceText'); 
    if (adviceBox) { 
        if (curIdx < tiers.length - 1) { 
            const next = tiers[curIdx + 1]; adviceBox.innerHTML = `<strong>เพิ่มอีก <span class="whitespace-nowrap text-amber-600">${(Math.max(0, next.min - totalFYC)).toLocaleString()} บาท</span></strong><br><span class="text-slate-500">เพื่อรับโบนัสระดับถัดไป ${formatPct(next.rate * 100)}</span>`; hasShownCongratsMB = false;
        } else { 
            adviceBox.innerHTML = `<strong class="text-emerald-600">🎉 ยินดีด้วย!</strong><br><span class="text-slate-600">คุณได้รับโบนัสระดับสูงสุด ${formatPct(tiers[curIdx].rate * 100)} แล้ว</span>`; 
            if (!hasShownCongratsMB) { showCongratsToast(`ทะลุเป้าหมาย MB สูงสุด ${formatPct(tiers[curIdx].rate * 100)} แล้ว`); hasShownCongratsMB = true; }
        } 
    }
}

window.toggleMYBTiers = function() {
    const hiddenTiers = document.querySelectorAll('.myb-tier-hidden'); hiddenTiers.forEach(el => el.classList.toggle('hidden'));
    const btn = document.getElementById('mybToggleBtn');
    if (btn) {
        if (btn.innerText.includes('ดูเพิ่มเติม')) btn.innerHTML = 'ย่อตาราง <i class="fas fa-chevron-up ml-1"></i>';
        else btn.innerHTML = 'ดูตารางเพิ่มเติม <i class="fas fa-chevron-down ml-1"></i>';
    }
};

function updateMYBDisplay() { 
    let rateKey = currentAppPlan === '24 TX' ? '24TX' : currentPlan;
    const effectivePlan = (typeof COM_RATES !== 'undefined' && COM_RATES[rateKey]) ? rateKey : currentAppPlan; 
    const rateArr = getComRateArray(effectivePlan);
    if (typeof lastCalculationData === 'undefined' || !lastCalculationData || rateArr.length === 0) return; 
    
    const p = lastCalculationData.premium || 0; const fycFromCase = Math.round(p * (rateArr[0] || 0)) || 0; 
    const existingHalfYearFYC = getSafeValue('existingHalfYearFYCInput'); const totalFYC = fycFromCase + existingHalfYearFYC; 
    const tiers = [{min:40000, max: 60000, rate:0.175}, {min:60001, max: 100000, rate:0.20}, {min:100001, max: 150000, rate:0.225}, {min:150001, max: 200000, rate:0.25}, {min:200001, max: 250000, rate:0.275}, {min:250001, max: 300000, rate:0.30}, {min:300001, max: 400000, rate:0.325}, {min:400001, max: Infinity, rate:0.35}]; 
    let curIdx = -1; tiers.forEach((t, i) => { if (totalFYC >= t.min) curIdx = i; }); const currentRate = curIdx >= 0 ? tiers[curIdx].rate : 0; 
    
    let tierHtml = '';
    tiers.forEach((t, i) => {
        const isActive = (curIdx === i); const hiddenClass = i >= 4 ? 'myb-tier-hidden hidden' : '';
        tierHtml += `<div class="${hiddenClass} flex justify-between items-center p-3 rounded-[16px] border ${isActive ? 'border-[#8b5cf6] bg-[#f5f3ff]' : 'border-slate-100 bg-white'} mb-2 shadow-sm"><span class="text-[14px] font-bold ${isActive ? 'text-[#5b21b6]' : 'text-slate-600'}">${t.min.toLocaleString()} - ${t.max === Infinity ? 'ขึ้นไป' : t.max.toLocaleString()}</span><span class="text-[14px] font-black px-4 py-1.5 rounded-xl ${isActive ? 'bg-[#8b5cf6]/20 text-[#6d28d9]' : 'text-slate-800'}">${formatPct(t.rate * 100)}</span></div>`;
    });
    if (tiers.length > 4) { tierHtml += `<button id="mybToggleBtn" onclick="toggleMYBTiers()" class="w-full text-center text-[11px] font-bold text-purple-600 bg-purple-50 py-2 rounded-xl mt-1 hover:bg-purple-100 transition-colors">ดูตารางเพิ่มเติม <i class="fas fa-chevron-down ml-1"></i></button>`; }

    document.getElementById('mybTierList').innerHTML = tierHtml;
    setText('mybCalculatedBonus', Math.round(totalFYC * currentRate).toLocaleString() + " บาท"); 
    setText('mybCaseFYCDisplay', fycFromCase.toLocaleString()); setText('mybMBFYCDisplay', existingHalfYearFYC.toLocaleString());
    setText('mybTotalFYCDisplay', totalFYC.toLocaleString()); setText('mybBonusCalcMethod', `(${totalFYC.toLocaleString()} x ${formatPct(currentRate * 100)})`);
    if (document.getElementById('caseIncomeMYBonusCalc')) document.getElementById('caseIncomeMYBonusCalc').innerText = `(${fycFromCase.toLocaleString()} x ${formatPct(currentRate * 100)})`;

    window.currentMYBBonus = Math.round(fycFromCase * currentRate);
    const adviceBox = document.getElementById('mybAdviceText'); 
    if (adviceBox) { 
        if (curIdx < tiers.length - 1) { 
            const next = tiers[curIdx + 1]; adviceBox.innerHTML = `<strong>เพิ่มอีก <span class="whitespace-nowrap text-amber-600">${(Math.max(0, next.min - totalFYC)).toLocaleString()} บาท</span></strong><br><span class="text-slate-500">เพื่อรับโบนัสระดับถัดไป ${formatPct(next.rate * 100)}</span>`; hasShownCongratsMYB = false;
        } else { 
            adviceBox.innerHTML = `<strong class="text-emerald-600">🎉 ยินดีด้วย!</strong><br><span class="text-slate-600">คุณได้รับโบนัสครึ่งปีเกินเกณฑ์ขั้นที่ 4 แล้ว</span>`; 
            if (!hasShownCongratsMYB) { showCongratsToast(`ทะลุเป้าหมาย MYB แล้ว`); hasShownCongratsMYB = true; }
        } 
    }
}

function updateNABDisplay() { 
    let rateKey = currentAppPlan === '24 TX' ? '24TX' : currentPlan;
    const effectivePlan = (typeof COM_RATES !== 'undefined' && COM_RATES[rateKey]) ? rateKey : currentAppPlan; 
    const rateArr = getComRateArray(effectivePlan);
    if (typeof lastCalculationData === 'undefined' || !lastCalculationData || rateArr.length === 0) return; 
    
    const p = lastCalculationData.premium || 0; const fycFromCase = Math.round(p * (rateArr[0] || 0)) || 0; 
    const existingNABFYC = getSafeValue('existingNABFYCInput'); const existingCases = parseInt(document.getElementById('existingNABCases')?.value) || 0; 
    const phase = document.getElementById('nabPhaseSelect')?.value || 'p1'; 
    const totalFYC = fycFromCase + existingNABFYC; const totalCases = 1 + existingCases; 
    let tiers = phase === 'p1' ? [{ minFYC: 20000, minCases: 3, bonus: 6000, label: "≥ 20,000 และ 3 ราย" },{ minFYC: 50000, minCases: 5, bonus: 15000, label: "≥ 50,000 และ 5 ราย" }] : [{ minFYC: 40000, minCases: 5, bonus: 10000, label: "≥ 40,000 และ 5 ราย" },{ minFYC: 100000, minCases: 10, bonus: 25000, label: "≥ 100,000 และ 10 ราย" }]; 
    let nabBonus = 0; let currentTierIdx = -1; 
    tiers.forEach((t, i) => { if (totalFYC >= t.minFYC && totalCases >= t.minCases) { nabBonus = t.bonus; currentTierIdx = i; } }); 
    
    let tierHtml = '';
    tiers.forEach((t, i) => {
        const isActive = (currentTierIdx === i); const activeClass = isActive ? 'border-[#06b6d4] bg-[#ecfeff]' : 'border-slate-100 bg-white';
        const fycIcon = (totalFYC >= t.minFYC) ? '<i class="fas fa-check-circle text-[#10b981]"></i>' : '<i class="far fa-circle text-slate-300"></i>';
        const casesIcon = (totalCases >= t.minCases) ? '<i class="fas fa-check-circle text-[#10b981]"></i>' : '<i class="far fa-circle text-slate-300"></i>';
        tierHtml += `<div class="flex justify-between items-center p-3 rounded-[16px] border ${activeClass} mb-2 shadow-sm"><div class="flex flex-col gap-1"><span class="text-[14px] font-bold text-slate-800">${t.label}</span><div class="text-[11px] text-slate-500 flex flex-col mt-0.5"><span class="flex items-center gap-1.5">${fycIcon} FYC: ${totalFYC.toLocaleString()} / ${t.minFYC.toLocaleString()}</span><span class="flex items-center gap-1.5">${casesIcon} ราย: ${totalCases} / ${t.minCases}</span></div></div><span class="text-[16px] font-black text-[#0891b2]">${t.bonus.toLocaleString()}</span></div>`;
    });
    document.getElementById('nabTierList').innerHTML = tierHtml; window.currentNABBonus = nabBonus; 
    setText('nabCaseFYCDisplay', fycFromCase.toLocaleString()); setText('nabExistingFYCDisplay', existingNABFYC.toLocaleString()); 
    setText('nabTotalFYCDisplay', totalFYC.toLocaleString()); setText('nabCalculatedBonus', nabBonus.toLocaleString() + " บาท"); 
    
    const adviceBox = document.getElementById('nabAdviceText'); 
    if (adviceBox) { 
        if (currentTierIdx < tiers.length - 1) { 
            const nextTier = tiers[currentTierIdx + 1]; const fycNeed = Math.max(0, nextTier.minFYC - totalFYC); const casesNeed = Math.max(0, nextTier.minCases - totalCases); 
            let adviceText = "<strong>เพิ่มอีก "; if (fycNeed > 0) adviceText += `<span class="whitespace-nowrap text-amber-600">${fycNeed.toLocaleString()} FYC</span> `; if (fycNeed > 0 && casesNeed > 0) adviceText += "และ "; if (casesNeed > 0) adviceText += `<span class="whitespace-nowrap text-amber-600">${casesNeed} ราย</span>`; adviceText += `</strong><br><span class="text-slate-500">เพื่อรับโบนัส <span class="whitespace-nowrap">${nextTier.bonus.toLocaleString()} บาท</span></span>`; 
            adviceBox.innerHTML = adviceText; hasShownCongratsNAB = false;
        } else { 
            adviceBox.innerHTML = `<strong class="text-emerald-600">🎉 ยินดีด้วย!</strong><br><span class="text-slate-600">คุณได้รับโบนัสสูงสุด <span class="whitespace-nowrap">${nabBonus.toLocaleString()} บาท</span> แล้ว</span>`; 
            if (!hasShownCongratsNAB && nabBonus > 0) { showCongratsToast(`ทะลุเป้าหมาย NAB รับโบนัส ${nabBonus.toLocaleString()} บาท`); hasShownCongratsNAB = true; }
        } 
    } 
}

function handleMBInput(el) { let v = el.value.replace(/,/g, '').split('.')[0]; if (!isNaN(v) && v !== '') el.value = Number(v).toLocaleString(); refreshAllDisplays(); }
function handleMYBInput(el) { let v = el.value.replace(/,/g, '').split('.')[0]; if (!isNaN(v) && v !== '') el.value = Number(v).toLocaleString(); refreshAllDisplays(); }
function handleNABFYCInput(el) { let v = el.value.replace(/,/g, '').split('.')[0]; if (!isNaN(v) && v !== '') el.value = Number(v).toLocaleString(); refreshAllDisplays(); }

function setNABPhase(phase) {
    document.getElementById('nabPhaseSelect').value = phase; const bg = document.getElementById('nabPhaseBg'); const btnP1 = document.getElementById('btnNabP1'); const btnP2 = document.getElementById('btnNabP2');
    if (phase === 'p1') { bg.style.transform = 'translateX(0)'; btnP1.classList.remove('font-medium', 'text-slate-500', 'hover:text-slate-700'); btnP1.classList.add('font-bold', 'text-cyan-700'); btnP2.classList.remove('font-bold', 'text-cyan-700'); btnP2.classList.add('font-medium', 'text-slate-500', 'hover:text-slate-700');
    } else { bg.style.transform = 'translateX(100%)'; btnP2.classList.remove('font-medium', 'text-slate-500', 'hover:text-slate-700'); btnP2.classList.add('font-bold', 'text-cyan-700'); btnP1.classList.remove('font-bold', 'text-cyan-700'); btnP1.classList.add('font-medium', 'text-slate-500', 'hover:text-slate-700'); }
    refreshAllDisplays();
}

window.toggleComTiers = function() {
    const hiddenTiers = document.querySelectorAll('.com-tier-hidden'); hiddenTiers.forEach(el => el.classList.toggle('hidden'));
    const btn = document.getElementById('comToggleBtn');
    if (btn) {
        if (btn.innerText.includes('ดูปีที่ 6')) btn.innerHTML = 'ย่อตาราง <i class="fas fa-chevron-up ml-1"></i>';
        else btn.innerHTML = `ดูปีที่ 6-${window.lastTotalComYears} <i class="fas fa-chevron-down ml-1"></i>`;
    }
};

function refreshAllDisplays() { 
    if (typeof lastCalculationData === 'undefined' || !lastCalculationData) return; 
    const p = lastCalculationData.premium || 0; 
    let rateKey = currentAppPlan === '24 TX' ? '24TX' : currentPlan;
    const effectivePlan = (typeof COM_RATES !== 'undefined' && COM_RATES[rateKey]) ? rateKey : currentAppPlan; 
    
    const rateArr = getComRateArray(effectivePlan);
    const fyc = Math.round(p * (rateArr[0] || 0)) || 0; 
    
    if(document.getElementById('caseIncomeComm')) document.getElementById('caseIncomeComm').innerText = fyc.toLocaleString() + " ฿"; 
    
    let comH = `<h4 class="text-[13px] font-black text-slate-800 text-center mb-4">ประมาณการคอมมิชชันรายปี</h4>`; 
    let totalComAmt = 0; let totalComPct = 0;
    
    if (rateArr && rateArr.length > 0) {
        window.lastTotalComYears = rateArr.length;
        rateArr.forEach((r, i) => { 
            const annualAmt = Math.round(p * r) || 0; totalComAmt += annualAmt; totalComPct += r;
            const hiddenClass = i >= 5 ? 'com-tier-hidden hidden' : '';
            comH += `<div class="${hiddenClass} flex justify-between items-center bg-white border border-amber-200 rounded-[14px] p-3 mb-2.5 shadow-sm">
                <span class="bg-amber-100 text-amber-700 text-[11px] font-bold px-3 py-1 rounded-full w-14 text-center">ปีที่ ${i+1}</span>
                <span class="text-[14px] font-black text-amber-600 text-center flex-1">${formatPct(r*100)}</span>
                <span class="text-[14px] font-black text-slate-800 text-right w-20">${annualAmt.toLocaleString()}</span>
            </div>`; 
        });
        if (rateArr.length > 5) comH += `<button id="comToggleBtn" onclick="toggleComTiers()" class="w-full text-center text-[11px] font-bold text-amber-600 bg-amber-50 py-2 rounded-xl mt-1 hover:bg-amber-100 transition-colors">ดูปีที่ 6-${rateArr.length} <i class="fas fa-chevron-down ml-1"></i></button>`;
        comH += `<div class="mt-4 pt-3.5 border-t border-slate-100 flex justify-between items-end">
            <div class="text-left"><div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">PERCENT รวม</div><div class="text-[18px] font-black text-amber-500">${formatPct(totalComPct * 100)}</div></div>
            <div class="text-right"><div class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">คอมมิชชันรวมตลอดสัญญา</div><div class="text-[20px] font-black text-amber-600">${totalComAmt.toLocaleString()} <span class="text-sm">฿</span></div></div>
        </div>`;
    } else {
        comH += `<div class="text-center text-slate-500 py-4"><i class="fas fa-exclamation-triangle text-amber-400 text-2xl mb-2"></i><br>ไม่พบข้อมูลคอมมิชชันในขณะนี้</div>`;
    }
    
    if(document.getElementById('comList')) document.getElementById('comList').innerHTML = comH;
    
    updateMBDisplay(); updateMYBDisplay(); updateNABDisplay();
    
    if(document.getElementById('caseIncomeBonus')) document.getElementById('caseIncomeBonus').innerText = (window.currentMBBonus || 0).toLocaleString() + " ฿"; 
    if(document.getElementById('caseIncomeMYBonus')) document.getElementById('caseIncomeMYBonus').innerText = (window.currentMYBBonus || 0).toLocaleString() + " ฿";
    const caseTotal = Math.round(fyc + (window.currentMBBonus || 0) + (window.currentMYBBonus || 0)); 
    if(document.getElementById('caseIncomeTotal')) document.getElementById('caseIncomeTotal').innerText = caseTotal.toLocaleString(); 
    const pctVal = p > 0 ? ((caseTotal / p) * 100) : 0;
    if(document.getElementById('caseIncomePercent')) document.getElementById('caseIncomePercent').innerText = formatPct(pctVal); 
}  

// ==================== TABLE MODULE ====================
function generatePolicyTableData() {
    if (!lastCalculationData) return; const d = lastCalculationData;
    const showCashFlow = ["Whole Life Extra", "24 TX", "868 / 818 Elite Saving"].includes(currentAppPlan);
    let sumDisplay = '';
    if (d.sum >= 1000000 && d.sum % 1000000 === 0) sumDisplay = (d.sum / 1000000) + ' ล้านบาท';
    else if (d.sum >= 100000 && d.sum % 100000 === 0 && d.sum < 1000000) sumDisplay = (d.sum / 100000) + ' แสนบาท';
    else sumDisplay = formatNum(d.sum) + ' บาท';
    
    document.getElementById('tableHeaderTitle').innerHTML = `<span class="truncate">${getPlanAbbr(currentAppPlan)} ${d.gender} ${d.age} ทุน ${sumDisplay}</span>`;
    
    const isProtector = ["Life Protector 20", "Supreme Life Protector"].includes(currentAppPlan);
    let tableHeaderHTML = `<tr class="text-slate-600 shadow-sm text-[10px] min-[380px]:text-[11px] sm:text-[12px]"><th class="py-3 px-1 font-bold bg-[#f8fafc] border-b border-slate-200 whitespace-nowrap ${showCashFlow ? 'w-[10%]' : 'w-[15%]'}">อายุ</th><th class="py-3 px-1 font-bold bg-[#f8fafc] border-b border-slate-200 whitespace-nowrap ${showCashFlow ? 'w-[20%]' : 'w-[25%]'}">ออมเงิน</th><th class="py-3 px-1 font-bold bg-[#f8fafc] text-blue-600 border-b border-slate-200 whitespace-nowrap ${showCashFlow ? 'w-[22%]' : 'w-[25%]'}">ออมสะสม</th>${showCashFlow ? `<th class="py-3 px-1 font-bold bg-[#f8fafc] text-emerald-600 border-b border-slate-200 whitespace-nowrap w-[24%]">กระแสเงินสด</th>` : ''}<th class="py-3 px-1 font-bold bg-[#f8fafc] text-amber-600 border-b border-slate-200 whitespace-nowrap ${showCashFlow ? 'w-[24%]' : 'w-[25%]'}">เงินสดพร้อมใช้</th>`;
    if (isProtector) tableHeaderHTML += `<th class="py-3 px-1 font-bold bg-[#f8fafc] text-rose-600 border-b border-slate-200 whitespace-nowrap w-[25%]">ทุนประกัน</th>`;
    tableHeaderHTML += `</tr>`;
    document.getElementById('policyTableHead').innerHTML = tableHeaderHTML;
    
    const maxYear = 90 - d.age; const payYears = parseInt(d.years) || 20;
    let html = ''; let totalPremium = 0; let foundBreakeven = false; let beYear = 0; let beAge = 0;
    const hasCVData = typeof cvDataLookup !== 'undefined' && cvDataLookup && Object.keys(cvDataLookup).length > 0;
    
    for (let y = 1; y <= maxYear; y++) {
        let annualPremium = 0; if (y <= payYears) { annualPremium = d.premium; totalPremium += d.premium; }
        let cvTotal = 0;
        let rateKey = currentPlan === 'TLA' ? 'TLA_RATES' : currentPlan;
        if (hasCVData && cvDataLookup[rateKey] && cvDataLookup[rateKey][currentGender] && cvDataLookup[rateKey][currentGender][d.age]) { 
            try { let ratePer1000 = cvDataLookup[rateKey][currentGender][d.age][y]; cvTotal = (d.sum / 1000) * ratePer1000; } catch(e) { cvTotal = 0; } 
        } else { 
            let cvPer1000 = 0; if (y > 1) { let progress = (y - 1) / (maxYear - 1); cvPer1000 = Math.round(Math.pow(progress, 1.4) * 1000); } if (y === maxYear) cvPer1000 = 1000; cvTotal = (d.sum / 1000) * cvPer1000; 
        }
        
        let cashFlowAmt = 0;
        if (showCashFlow) {
            if (currentAppPlan === '868 / 818 Elite Saving') { cashFlowAmt = d.sum * 0.12; } 
            else if (currentAppPlan === 'Whole Life Extra') {
                let cAge = d.age + y; if (cAge <= 60) cashFlowAmt = d.sum * 0.0225; else if (cAge == 61) cashFlowAmt = d.sum * 0.10; else if (cAge > 61 && cAge < 90) cashFlowAmt = d.sum * (0.10 + ((cAge - 61) * 0.005)); else if (cAge == 90) cashFlowAmt = d.sum;
                if (cashFlowAmt > d.sum * 0.24 && cAge < 90) cashFlowAmt = d.sum * 0.24; 
            } else if (currentAppPlan === '24 TX') { cashFlowAmt = d.cashFlow || (d.sum * 0.01); }
        }
        
        let isBeRow = false; if (!foundBreakeven && totalPremium > 0 && cvTotal >= totalPremium) { foundBreakeven = true; beYear = y; beAge = d.age + y; isBeRow = true; }
        let trClass = "border-b border-slate-100 transition-colors " + (isBeRow ? "breakeven-target" : "hover:bg-slate-50");
        html += `<tr class="${trClass}"><td class="py-3 px-1 text-slate-700 font-medium relative"><div class="be-badge absolute left-0 top-1/2 -translate-y-1/2 w-1 h-full bg-emerald-500 rounded-r-md hidden"></div>${d.age + y}</td><td class="py-3 px-1 text-slate-700">${y <= payYears ? Math.round(annualPremium).toLocaleString() : "-"}</td><td class="py-3 px-1 text-blue-600">${Math.round(totalPremium).toLocaleString()}</td>${showCashFlow ? `<td class="py-3 px-1 text-emerald-600 font-bold">${Math.round(cashFlowAmt).toLocaleString()}</td>` : ''}<td class="py-3 px-1 text-amber-600 font-bold">${Math.round(cvTotal).toLocaleString()}</td>`;
        if (isProtector) html += `<td class="py-3 px-1 text-rose-600 font-bold">${Math.round(d.sum).toLocaleString()}</td>`;
        html += `</tr>`;
    }
    document.getElementById('policyTableBody').innerHTML = html;
    
    // ทยอยเวนคืน UI สำหรับ LPB/SLPA จัดตำแหน่งให้อยู่ "ใต้" จุดคุ้มทุน
    let surrenderHTML = '';
    if (isProtector) {
        surrenderHTML = `
        <div class="flex items-center justify-between px-5 py-3 border-t border-b border-slate-100 bg-blue-50/10 mt-2">
            <span class="text-[13px] font-bold text-slate-700 flex items-center gap-2"><i class="fas fa-hand-holding-usd text-blue-500"></i> ทยอยเวนคืน</span>
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="toggleSurrender" class="sr-only peer" onchange="document.getElementById('surrenderInputs').classList.toggle('hidden')">
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 shadow-inner"></div>
            </label>
        </div>
        <div id="surrenderInputs" class="px-5 py-3 flex gap-3 hidden bg-blue-50/30 border-b border-slate-100">
            <div class="flex-1"><label class="text-[10px] font-bold text-slate-500 mb-1 block">อายุเริ่มรับเงิน</label><input type="number" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-center text-xs font-bold text-slate-700 outline-none focus:border-blue-400" value="60"></div>
            <div class="flex-1"><label class="text-[10px] font-bold text-slate-500 mb-1 block">รับถึงอายุ</label><input type="number" class="w-full bg-white border border-slate-200 rounded-lg p-2 text-center text-xs font-bold text-slate-700 outline-none focus:border-blue-400" value="99"></div>
        </div>`;
    }

    if (foundBreakeven) { 
        document.getElementById('breakevenSummary').innerHTML = `<div class="bg-emerald-100 border border-emerald-200 rounded-xl py-2.5 px-3 m-3 text-[12px] text-emerald-800 font-bold shadow-sm flex items-center justify-center gap-2"><i class="fas fa-bullseye text-emerald-600 text-lg"></i><span>จุดคุ้มทุนอยู่ที่: ปีที่ <span class="text-emerald-700 text-sm">${beYear}</span> (อายุ <span class="text-emerald-700 text-sm">${beAge}</span> ปี)</span></div>` + surrenderHTML; 
    } else { 
        document.getElementById('breakevenSummary').innerHTML = `<div class="bg-slate-100 border border-slate-200 rounded-xl py-2.5 px-3 m-3 text-[12px] text-slate-500 font-bold flex items-center justify-center gap-2"><i class="fas fa-info-circle text-slate-400"></i> ไม่พบจุดคุ้มทุนก่อนครบกำหนดสัญญา</div>` + surrenderHTML; 
    }
    toggleBreakevenDisplay(false); 
}

function toggleBreakevenDisplay(smoothScroll = true) {
    const tableBody = document.getElementById('policyTableBody'); const summary = document.getElementById('breakevenSummary'); const isChecked = document.getElementById('toggleBreakeven')?.checked;
    if (!tableBody) return;
    if (isChecked) {
        tableBody.classList.add('show-breakeven'); if (summary) summary.classList.remove('hidden');
        if (smoothScroll) { setTimeout(() => { const beRow = tableBody.querySelector('.breakeven-target'); const pdfTableTarget = document.getElementById('pdfTableTarget'); if (beRow && pdfTableTarget) { const targetPos = beRow.offsetTop - (pdfTableTarget.clientHeight / 2) + 30; pdfTableTarget.scrollTo({ top: targetPos, behavior: 'smooth' }); } }, 100); }
    } else { tableBody.classList.remove('show-breakeven'); if (summary) summary.classList.add('hidden'); }
}

let thaiFontBase64 = null;
async function loadThaiFont() { 
    if (thaiFontBase64) return thaiFontBase64; 
    try { const response = await fetch('https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/sarabun/Sarabun-Regular.ttf'); const blob = await response.blob(); return new Promise((resolve) => { const reader = new FileReader(); reader.onloadend = () => { thaiFontBase64 = reader.result.split(',')[1]; resolve(thaiFontBase64); }; reader.readAsDataURL(blob); }); } catch (e) { return null; } 
}

async function exportTableToPDF(actionType = 'preview') { 
    if (!lastCalculationData) return showCustomError("กรุณาคำนวณเบี้ยประกันก่อน");
    const toast = document.createElement('div'); toast.className = "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-900 text-white px-8 py-5 rounded-2xl text-sm font-bold z-[1000] shadow-2xl text-center backdrop-blur-sm transition-all"; toast.innerHTML = `<i class='fas fa-spinner fa-spin mb-3 block text-3xl'></i><span>กำลังสร้างเอกสาร PDF...</span>`; document.body.appendChild(toast); 
    
    try {
        const fontBase64 = await loadThaiFont(); const { jsPDF } = window.jspdf; const doc = new jsPDF('p', 'mm', 'a4'); let fontName = 'helvetica'; 
        if (fontBase64) { try { doc.addFileToVFS('Sarabun-Regular.ttf', fontBase64); doc.addFont('Sarabun-Regular.ttf', 'Sarabun', 'normal'); doc.addFont('Sarabun-Regular.ttf', 'Sarabun', 'bold'); fontName = 'Sarabun'; } catch (e) {} }
        
        const d = lastCalculationData; const tableRows = []; const trs = document.querySelectorAll('#policyTableBody tr'); const showBreakeven = document.getElementById('toggleBreakeven')?.checked; 
        let beRowIndex = -1; let beAgeStr = '', beYearStr = '', beCVStr = ''; const showCashFlow = ["Whole Life Extra", "24 TX", "868 / 818 Elite Saving"].includes(currentAppPlan); const isProtector = ["Life Protector 20", "Supreme Life Protector"].includes(currentAppPlan);
        let headRow = ['อายุ', 'ออมเงิน', 'ออมสะสม']; if (showCashFlow) headRow.push('กระแสเงินสด'); headRow.push('เงินสดพร้อมใช้'); if (isProtector) headRow.push('ทุนประกัน'); else headRow.push('ทุนอ้างอิง');
        
        trs.forEach((tr, index) => { 
            const tds = tr.querySelectorAll('td'); const rowData = []; tds.forEach(td => rowData.push(td.innerText.trim())); 
            if(!isProtector) rowData.push(formatNum(d.sum)); tableRows.push(rowData); 
            if (tr.classList.contains('breakeven-target')) { beRowIndex = index; beAgeStr = rowData[0]; beYearStr = beAgeStr - d.age; beCVStr = rowData[showCashFlow ? 4 : 3]; } 
        });
        
        doc.autoTable({ 
            startY: (showBreakeven && beRowIndex !== -1) ? 40 : 34, head: [headRow], body: tableRows, theme: 'plain', margin: { top: 34, bottom: 15, left: 15, right: 15 }, 
            styles: { font: fontName, fontSize: 12, halign: 'center', valign: 'middle', cellPadding: 1.5, minCellHeight: 4.8 }, 
            headStyles: { fillColor: [248, 250, 252], textColor: [100, 116, 139], fontStyle: 'bold', lineWidth: { top: 0, bottom: 0.1, left: 0, right: 0 }, lineColor: [226, 232, 240] }, 
            bodyStyles: { textColor: [71, 85, 105], lineWidth: { top: 0, bottom: 0.1, left: 0, right: 0 }, lineColor: [241, 245, 249] }, 
            didDrawPage: function (data) { 
                doc.setFillColor(36, 60, 148); doc.rect(0, 0, 210, 20, 'F'); doc.setFont(fontName, 'normal'); doc.setFontSize(18); doc.setTextColor(255, 255, 255); doc.text(currentAppPlan, 105, 13, { align: 'center' }); 
                let sumDisplay = (d.sum >= 1000000 && d.sum % 1000000 === 0) ? (d.sum/1000000)+' ล้านบาท' : (d.sum >= 100000 && d.sum % 100000 === 0) ? (d.sum/100000)+' แสนบาท' : formatNum(d.sum)+' บาท'; 
                doc.setFontSize(14); doc.setTextColor(30, 58, 138); doc.text(`${getPlanAbbr(currentAppPlan)} ${d.gender} ${d.age} ทุน ${sumDisplay}`, 105, 28, { align: 'center' }); 
                if (data.pageNumber === 1 && showBreakeven && beRowIndex !== -1) { doc.setFont(fontName, 'normal'); doc.setFontSize(13); doc.setTextColor(6, 95, 70); doc.text(`🎯 จุดคุ้มทุน: ปีที่ ${beYearStr} (อายุ ${beAgeStr} ปี) | เงินสดพร้อมใช้: ${beCVStr} บาท`, 105, 35, { align: 'center' }); } 
            } 
        });
        
        // PDF Summary page using generic result text
        const summaryText = generateResultText('all');
        if (summaryText) {
            doc.addPage();
            doc.setFillColor(36, 60, 148); doc.rect(0, 0, 210, 20, 'F');
            doc.setFont(fontName, 'bold'); doc.setFontSize(16); doc.setTextColor(255, 255, 255);
            doc.text('สรุปรายละเอียดความคุ้มครอง', 105, 13, { align: 'center' });
            
            let currentY = 30;
            const checkPageBreak = (heightNeeded) => { if (currentY + heightNeeded > 280) { doc.addPage(); currentY = 20; } };

            doc.setFont(fontName, 'normal'); doc.setFontSize(12); doc.setTextColor(71, 85, 105);
            let textClean = summaryText.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();
            
            let splitLines = textClean.split('\n');
            splitLines.forEach(line => {
                if (line.includes('---')) return; // skip divider
                if (line.includes('ความคุ้มครองหลัก') || line.includes('สรุปแผน')) doc.setFont(fontName, 'bold'); else doc.setFont(fontName, 'normal');
                let lines = doc.splitTextToSize(line, 180);
                checkPageBreak(lines.length * 6);
                doc.text(lines, 15, currentY); currentY += (lines.length * 6) + 1;
            });
        }

        const pageCount = doc.internal.getNumberOfPages(); doc.setFont(fontName, 'normal'); doc.setFontSize(10);
        for (let i = 1; i <= pageCount; i++) { doc.setPage(i); doc.setDrawColor(226, 232, 240); doc.line(15, 285, 195, 285); doc.setTextColor(148, 163, 184); doc.text(`หน้า ${i} / ${pageCount}`, 195, 290, { align: 'right' }); }

        const pdfFileName = `${getPlanAbbr(currentAppPlan)}_ตารางมูลค่า_อายุ${d.age}.pdf`;
        if (actionType === 'preview') { window.open(doc.output('bloburl'), '_blank'); } 
        else if (actionType === 'save') { doc.save(pdfFileName); } 
        else if (actionType === 'print') { doc.autoPrint(); window.open(doc.output('bloburl'), '_blank'); } 
        else if (actionType === 'line' || actionType === 'messenger') { 
            const pdfBlob = doc.output('blob'); const file = new File([pdfBlob], pdfFileName, { type: 'application/pdf' }); 
            if (navigator.canShare && navigator.canShare({ files: [file] })) { 
                navigator.share({ files: [file], title: `ตารางมูลค่า ${getPlanAbbr(currentAppPlan)}`, text: `ตารางมูลค่า ${getPlanAbbr(currentAppPlan)}` }).catch(err => { if (err.name === 'NotAllowedError') window.open(doc.output('bloburl'), '_blank'); }); 
            } else { showCustomError("เบราว์เซอร์ไม่รองรับการแชร์ไฟล์ จะทำการเปิดพรีวิวแทน"); window.open(doc.output('bloburl'), '_blank'); } 
        }
    } catch (error) { showCustomError("เกิดข้อผิดพลาดในการสร้าง PDF"); } finally { toast.remove(); }
}

// ==================== ONLOAD INITIALIZATION ====================
window.onload = async () => {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
    applyDayColorTheme();
    
    // จัดการปุ่มปิด Popup (X) เป็นสีแดง
    document.querySelectorAll('button[onclick^="closePopup"]').forEach(btn => {
        const card = btn.closest('.modal-content-card');
        if (card) {
            card.classList.add('relative');
            btn.className = `absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all text-[16px] font-bold shadow-md active:scale-90 z-[100] bg-red-500 text-white border border-red-600 hover:bg-red-600`;
            btn.innerHTML = '<i class="fas fa-times"></i>';
        }
    });
    
    const installBtn = document.querySelector('button[onclick*="installmentModal"]');
    if (installBtn) { installBtn.removeAttribute('onclick'); installBtn.addEventListener('click', openInstallmentModal); }
    
    const sumInput = document.getElementById('sumInsuredInput');
    if (sumInput) sumInput.addEventListener('blur', () => calculate('sum', true));
    const premInput = document.getElementById('premiumInput');
    if (premInput) premInput.addEventListener('blur', () => calculate('premium', true));
    const cfInput = document.getElementById('cashFlowInput');
    if (cfInput) cfInput.addEventListener('blur', () => calculate('cashflow', true));
    const cfInput1 = document.getElementById('cashFlowInput1');
    if (cfInput1) cfInput1.addEventListener('blur', () => calculate('cashflow1', true));
    const cfInput2 = document.getElementById('cashFlowInput2');
    if (cfInput2) cfInput2.addEventListener('blur', () => calculate('cashflow2', true));
    const ageInput = document.getElementById('ageInput');
    if (ageInput) ageInput.addEventListener('blur', () => forceAgeValidation());

    setupLongPress(); setupScrollHideNav();
    
    await loadAllProductConditions(); 
    await loadAllRates();
    
    setGender(currentGender); setPlan(currentPlan);
};
