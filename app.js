// ==================== app.js ====================
const setText = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };
const formatNum = (num) => { const rounded = Math.round(num * 100) / 100; return Number.isInteger(rounded) ? rounded.toLocaleString() : rounded.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}); };

let currentAppPlan = "CI Extra Plus";
let currentPlan = '20CX'; 
let currentGender = 'male';
let lastCalculationData = null;
let currentMode = 'sum';
let currentCashFlow = 120000; 

function openPopup(id) { const modal = document.getElementById(id); if (modal) { modal.classList.remove('hidden'); setTimeout(() => { modal.classList.add('show'); }, 10); } }
function closePopup(id) { const modal = document.getElementById(id); if (modal) { modal.classList.remove('show'); setTimeout(() => { modal.classList.add('hidden'); }, 300); } }

function adjustAge(delta) { const input = document.getElementById('ageInput'); let val = parseInt(input.value) + delta; if (val >= 0 && val <= 65) { input.value = val; calculate(currentMode); } }
function setGender(gender) { 
    currentGender = gender; 
    const btnM = document.getElementById('btnMale'); const btnF = document.getElementById('btnFemale');
    if(gender === 'male') { btnM.className = 'flex-1 rounded-[14px] text-[15px] font-bold active-male text-white transition-all'; btnF.className = 'flex-1 rounded-[14px] text-[15px] font-bold text-slate-500 hover:bg-slate-50 transition-all'; } 
    else { btnM.className = 'flex-1 rounded-[14px] text-[15px] font-bold text-slate-500 hover:bg-slate-50 transition-all'; btnF.className = 'flex-1 rounded-[14px] text-[15px] font-bold active-female text-white transition-all'; }
    calculate(currentMode); 
}

function handlePremiumInput(el) { let v = el.value.replace(/,/g, '').split('.')[0]; if (!isNaN(v) && v !== '') { el.value = Number(v).toLocaleString(); calculate('premium'); } }
function handleSumInput(el) { let v = el.value.replace(/,/g, '').split('.')[0]; if (!isNaN(v) && v !== '') { el.value = Number(v).toLocaleString(); calculate('sum'); } }
function handleCashFlowInput(el) { let v = el.value.replace(/,/g, '').split('.')[0]; if (!isNaN(v) && v !== '') { el.value = Number(v).toLocaleString(); currentCashFlow = Number(v); calculate(currentMode); } }
function handleTpdInput(el) { let v = el.value.replace(/,/g, '').split('.')[0]; if (!isNaN(v) && v !== '') { el.value = Number(v).toLocaleString(); calculate(currentMode); } }

function setQuickSum(val) { document.getElementById('sumInsuredInput').value = val.toLocaleString(); calculate('sum'); }
function setQuickPremium(val) { document.getElementById('premiumInput').value = val.toLocaleString(); calculate('premium'); }
function setQuickCashFlow(val) { currentCashFlow = val; document.getElementById('cashFlowInput').value = val.toLocaleString(); calculate(currentMode); }

function selectAppPlan(planName) {
    closePopup('planSelectModal'); currentAppPlan = planName; 
    const config = PLANS_CONFIG[planName];
    
    document.getElementById('headerTitleText').innerText = planName;
    document.getElementById('headerDescText').innerText = config.subtitle;
    
    currentPlan = config.subPlans[0];

    const planSelectionWrapper = document.getElementById('planSelectionWrapper'); 
    const planContainer = document.getElementById('planSelectionContainer');
    if (config.subPlans.length <= 1) { planSelectionWrapper.classList.add('hidden'); } 
    else { 
        planSelectionWrapper.classList.remove('hidden'); 
        planContainer.innerHTML = config.subPlans.map(sp => `<button onclick="setPlan('${sp}')" id="btnPlan_${sp}" class="flex-1 rounded-[14px] text-[14px] font-bold ${sp === currentPlan ? 'active-blue text-white' : 'text-slate-500 hover:bg-slate-50'} transition-all">${sp}</button>`).join('');
    }

    const sumPillsContainer = document.getElementById('sumPillsWrapper');
    if (!config.sumPills || config.sumPills.length === 0) { sumPillsContainer.classList.add('hidden'); } 
    else { sumPillsContainer.classList.remove('hidden'); sumPillsContainer.innerHTML = config.sumPills.map(val => `<button onclick="setQuickSum(${val})" class="quick-pill">${val >= 1000000 ? (val/1000000)+' ล้าน' : (val/100000)+' แสน'}</button>`).join(''); }

    const premPillsContainer = document.getElementById('premiumPillContainer');
    if (!config.premPills || config.premPills.length === 0) { premPillsContainer.classList.add('hidden'); } 
    else { premPillsContainer.classList.remove('hidden'); premPillsContainer.innerHTML = config.premPills.map(val => `<button onclick="setQuickPremium(${val})" class="quick-pill">${val >= 1000000 ? (val/1000000)+' ล้าน' : (val/100000)+' แสน'}</button>`).join(''); }

    const cashPillsContainer = document.getElementById('cashPillContainer');
    if (config.hasCash) { cashPillsContainer.innerHTML = CASH_PILLS.map(val => `<button onclick="setQuickCashFlow(${val})" class="quick-pill hover:bg-emerald-200">${val >= 1000000 ? (val/1000000)+' ล้าน' : (val/100000)+' แสน'}</button>`).join(''); }

    document.getElementById('premiumLabel').innerText = config.labelPrem || "ออมเงิน (บาท/ปี)";
    document.getElementById('sumLabel').innerText = config.labelSum || "วงเงินคุ้มครอง (บาท)";
    
    document.getElementById('sumInsuredContainer').classList.toggle('hidden', !config.showSum);
    document.getElementById('premiumContainer').classList.toggle('hidden', !config.showPrem);
    document.getElementById('cashFlowContainer').classList.toggle('hidden', !config.hasCash);
    
    document.getElementById('threeDExtraOptions').classList.toggle('hidden', !config.allowRiders);
    document.getElementById('threeDExtraOptions').classList.toggle('grid', config.allowRiders);
    document.getElementById('hxSelectionBox').classList.toggle('hidden', !config.is3D);
    document.getElementById('tpdBox').classList.toggle('hidden', !config.is3D);

    const mainActionBtn = document.getElementById('mainActionBtn');
    if (config.uiType === "table") { mainActionBtn.innerHTML = `<i class="fas fa-table text-xl"></i> ตารางมูลค่า`; mainActionBtn.onclick = function() { switchView('table'); }; } 
    else { mainActionBtn.innerHTML = `<i class="fas fa-file-alt text-xl"></i> ดูรายละเอียด`; mainActionBtn.onclick = function() { manualTriggerPopup(); }; }

    if(config.defaultSum > 0) { document.getElementById('sumInsuredInput').value = config.defaultSum.toLocaleString(); }
    calculate('sum');
}

function setPlan(subPlan) { 
    currentPlan = subPlan; const config = PLANS_CONFIG[currentAppPlan];
    config.subPlans.forEach(sp => { const btn = document.getElementById(`btnPlan_${sp}`); if(btn) btn.className = `flex-1 rounded-[14px] text-[14px] font-bold ${sp === currentPlan ? 'active-blue text-white' : 'text-slate-500 hover:bg-slate-50'} transition-all`; });
    calculate(currentMode); 
}

function calculate(source) { 
    currentMode = source; const age = parseInt(document.getElementById('ageInput').value) || 0; 
    const config = PLANS_CONFIG[currentAppPlan];
    let fSum = parseFloat(document.getElementById('sumInsuredInput').value.replace(/,/g, '')) || 0; 
    let fPrem = 0; 

    // ป้องกันการคำนวณพังกรณีไม่มีไฟล์ Data
    const totalRate = (typeof PREMIUM_DATA !== 'undefined' && PREMIUM_DATA[currentPlan]?.[currentGender]) ? (PREMIUM_DATA[currentPlan][currentGender][age] || 25) : 25; 

    if (config.is3D) {
        fPrem = 25000; // สมมติ 3D รอใส่สูตร Phase ถัดไป
        document.getElementById('premiumInput').value = fPrem.toLocaleString();
    } else if (totalRate > 0) {
        if (source === 'sum' && config.showPrem) { 
            fPrem = Math.round((fSum / 1000) * totalRate); 
            document.getElementById('premiumInput').value = fPrem.toLocaleString(); 
        } else if (config.showSum) { 
            fPrem = parseFloat(document.getElementById('premiumInput').value.replace(/,/g, '')) || 50000; 
            fSum = (fPrem * 1000) / totalRate; 
            document.getElementById('sumInsuredInput').value = formatNum(fSum); 
        } 
    }
    
    let yearsStr = '20'; const matchYears = currentPlan.match(/\d+/); if (matchYears) yearsStr = matchYears[0];
    lastCalculationData = { premium: fPrem, sum: fSum, gender: currentGender==='male'?'ชาย':'หญิง', age: age, years: yearsStr, cashFlow: currentCashFlow }; 
    return lastCalculationData; 
}

function manualTriggerPopup() { const calcData = calculate('sum'); if (calcData) openModal(calcData); }

// UI Popup สรุปผลที่สวยเหมือนเดิม 100%
function openModal(d) { 
    if(!d) return; 
    setText('modalGender', d.gender); setText('modalAge', d.age + " ปี"); setText('modalYears', d.years + " ปี"); 
    
    const dynamicContent = document.getElementById('dynamicModalContent'); let html = '';
    
    switch(currentAppPlan) {
        case "CI Extra Plus":
            const sumStr = formatNum(d.sum); const extraCI = formatNum(d.sum * 0.25); const majorCI = formatNum(d.sum * 0.75); const medExtra = formatNum(d.sum * 0.10); const maturityStr = formatNum(d.sum * 1.05); const maturityExtraStr = formatNum(d.sum * 0.05);
            html += `<div class="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm border border-blue-100 border-l-4 border-l-blue-500 mb-3"><span class="text-[13px] text-slate-500 font-bold flex items-center gap-2"><i class="fas fa-wallet text-blue-400"></i> ออมเงิน</span><span class="text-[18px] font-black text-blue-600">${Math.round(d.premium).toLocaleString()}</span></div>`;
            if (d.age <= 15) { html += `<div class="flex flex-col p-4 bg-white rounded-2xl shadow-sm border border-sky-100 mb-3"><div class="flex justify-between items-center mb-2"><span class="text-[12px] text-slate-600 font-bold">ตรวจพบ 1 ใน 15 โรคเด็ก</span><span class="text-[16px] font-black text-sky-600">${sumStr}</span></div><button onclick="openPopup('disease15Modal')" class="text-[11px] text-sky-600 bg-sky-50 py-1.5 rounded-lg font-bold hover:bg-sky-100 transition-colors w-full">ดูรายชื่อโรค</button></div>`; }
            html += `
            <div class="flex flex-col p-4 bg-white rounded-2xl shadow-sm border border-amber-100 mb-3"><div class="flex justify-between items-center mb-1"><span class="text-[12px] text-slate-600 font-bold">1 ใน 5 โรคร้าย (จ่ายสูงสุด 4 ครั้ง)</span><span class="text-[16px] font-black text-amber-600">${extraCI}</span></div><button onclick="openPopup('disease5Modal')" class="text-[11px] text-amber-600 bg-amber-50 py-1.5 rounded-lg font-bold hover:bg-amber-100 transition-colors w-full mt-2">ดูรายชื่อโรค</button></div>
            <div class="flex flex-col p-4 bg-white rounded-2xl shadow-sm border border-rose-100 mb-3"><div class="flex justify-between items-center mb-1"><span class="text-[12px] text-slate-600 font-bold">1 ใน 45 โรคร้ายระยะรุนแรง</span><span class="text-[16px] font-black text-rose-600">${majorCI}</span></div><p class="text-[10px] text-slate-400 mb-2">* ยกเว้นการออม และมีค่ารักษาเพิ่มเติม <span class="font-bold text-slate-600">${medExtra}</span> บาท</p><div class="flex gap-2"><button onclick="openPopup('extraPayConditionsModal')" class="flex-1 text-[11px] text-slate-600 bg-slate-100 py-1.5 rounded-lg font-bold hover:bg-slate-200 transition-colors">เงื่อนไข</button><button onclick="openPopup('disease45Modal')" class="flex-1 text-[11px] text-rose-600 bg-rose-50 py-1.5 rounded-lg font-bold hover:bg-rose-100 transition-colors">รายชื่อโรค</button></div></div>
            <div class="flex flex-col p-4 bg-white rounded-2xl shadow-sm border border-indigo-100"><div class="flex justify-between items-center mb-1"><span class="text-[12px] text-slate-600 font-bold">จากไป หรือ ครบสัญญา</span><span class="text-[16px] font-black text-indigo-600">${maturityStr}</span></div><p class="text-[10px] text-slate-400 mb-2">* ทุพพลภาพสิ้นเชิงถาวร (TPD) รับ 2 เท่า (${formatNum(d.sum*2)} บาท)</p><button onclick="openPopup('maturityExtraModal')" class="text-[11px] text-indigo-600 bg-indigo-50 py-1.5 rounded-lg font-bold hover:bg-indigo-100 transition-colors w-full">ดูเงื่อนไข</button></div>`;
            break;
        case "Century Life + TPD":
            html += `<div class="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm border border-emerald-100 border-l-4 border-l-emerald-500 mb-3"><span class="text-[13px] text-slate-500 font-bold flex items-center gap-2"><i class="fas fa-wallet text-emerald-400"></i> ออมเงิน</span><span class="text-[18px] font-black text-emerald-600">${Math.round(d.premium).toLocaleString()}</span></div>`;
            html += `<div class="flex flex-col p-4 bg-white rounded-2xl shadow-sm border border-indigo-100"><div class="flex justify-between items-center mb-1"><span class="text-[12px] text-slate-600 font-bold">ความคุ้มครองชีวิต</span><span class="text-[16px] font-black text-indigo-600">${formatNum(d.sum)}</span></div><p class="text-[10px] text-slate-400 mb-2">* ทุพพลภาพสิ้นเชิงถาวร (TPD) รับ 2 เท่า (${formatNum(d.sum*2)} บาท)</p></div>`;
            break;
        default:
            html += `<div class="p-4 text-center text-sm text-slate-500">รอตั้งค่าการแสดงผลแบบเฉพาะของ ${currentAppPlan}</div>`;
    }
    if (dynamicContent) dynamicContent.innerHTML = html;
    openPopup('resultModal'); 
}

function switchView(targetView) {
    const views = { 'main': document.getElementById('mainView'), 'table': document.getElementById('tableView'), 'cash': document.getElementById('cashView'), 'ai': document.getElementById('aiView') };
    const navBtns = { 'main': document.getElementById('navMainBtn'), 'table': document.getElementById('navTableBtn'), 'cash': document.getElementById('navCashBtn'), 'ai': document.getElementById('navAiBtn') };
    if (targetView === 'table') generatePolicyTableData();
    Object.values(views).forEach(view => { if (view) view.classList.add('hidden'); });
    Object.values(navBtns).forEach(btn => { if (btn) btn.classList.remove('active'); });
    if (views[targetView]) views[targetView].classList.remove('hidden');
    if (navBtns[targetView]) navBtns[targetView].classList.add('active');
}

function openPlanModal() {
    const container = document.getElementById('unifiedPlanList'); 
    container.innerHTML = allInsurancePlans.map(p => `<button onclick="selectAppPlan('${p.name}')" class="w-full relative flex items-center text-left p-3.5 rounded-[20px] bg-white hover:bg-slate-50 border border-transparent hover:border-blue-200 transition-all mb-2 shadow-sm"><div class="w-12 h-12 rounded-[14px] ${p.bg} ${p.color} flex items-center justify-center text-[20px] shrink-0 mr-4 shadow-inner"><i class="${p.icon}"></i></div><div class="flex-1 pr-8"><h4 class="text-[15px] font-bold text-slate-800 leading-tight mb-0.5">${p.name}</h4><p class="text-[11px] text-slate-500 font-medium leading-tight">${p.desc}</p></div></button>`).join('');
    openPopup('planSelectModal');
}

function handleUnifiedPlanSearch() { const query = document.getElementById('unifiedPlanSearchInput').value.toLowerCase(); const filtered = allInsurancePlans.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)); document.getElementById('unifiedPlanList').innerHTML = filtered.map(p => `<button onclick="selectAppPlan('${p.name}')" class="w-full relative flex items-center text-left p-3.5 rounded-[20px] bg-white hover:bg-slate-50 border border-transparent hover:border-blue-200 transition-all mb-2 shadow-sm"><div class="w-12 h-12 rounded-[14px] ${p.bg} ${p.color} flex items-center justify-center text-[20px] shrink-0 mr-4 shadow-inner"><i class="${p.icon}"></i></div><div class="flex-1 pr-8"><h4 class="text-[15px] font-bold text-slate-800 leading-tight mb-0.5">${p.name}</h4><p class="text-[11px] text-slate-500 font-medium leading-tight">${p.desc}</p></div></button>`).join(''); }

function generatePolicyTableData() {
    if (!lastCalculationData) return; const d = lastCalculationData; const config = PLANS_CONFIG[currentAppPlan];
    document.getElementById('tableHeaderTitle').innerHTML = `<span class="truncate">${currentPlan} ${d.gender} ${d.age}</span>`;
    document.getElementById('policyTableHead').innerHTML = `<tr class="text-slate-500 shadow-sm text-[11px] sm:text-[12px]"><th class="py-3 px-1 font-bold">อายุ</th><th class="py-3 px-1 font-bold">เบี้ย/ปี</th><th class="py-3 px-1 font-bold text-blue-600">เบี้ยสะสม</th>${config.showCashFlow ? `<th class="py-3 px-1 font-bold text-emerald-600">กระแสเงินสด</th>` : ''}<th class="py-3 px-1 font-bold text-amber-600">เงินสดคืน</th></tr>`;
    document.getElementById('policyTableBody').innerHTML = `<tr><td colspan="5" class="py-10 text-slate-400">รออัปเดตตารางมูลค่า (Phase 2)</td></tr>`;
}

function getShareTextByPlan(d) { return `\n* เพิ่มความคุ้มครองทุพพลภาพสิ้นเชิงถาวร (TPD) เป็น 2 เท่า (${formatNum(d.sum * 2)} บาท)\n`; }

async function executeShare(text) {
    if (typeof liff !== 'undefined' && liff.isApiAvailable('shareTargetPicker')) {
        try { await liff.shareTargetPicker([{ type: "text", text: text }]); alert("ส่งเข้าแชทเรียบร้อยแล้ว!"); } catch (e) {}
    } else { navigator.clipboard.writeText(text); alert("คัดลอกข้อความสำเร็จ"); }
}

function openGenericShareModal(type) { 
    if (!lastCalculationData) return;
    const d = lastCalculationData;
    let text = `📊 สรุปแผน: ${currentAppPlan}\n👤 เพศ ${d.gender}\n🎂 อายุ ${d.age} ปี\n💰 เบี้ย : ${Math.round(d.premium).toLocaleString()} บาท/ปี\n🛡️ ทุนประกัน ${formatNum(d.sum)} บาท\n`; 
    text += getShareTextByPlan(d);
    executeShare(text);
}

window.onload = async () => { 
    document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.add('hidden'));
    try { await liff.init({ liffId: "ใส่_LIFF_ID_ของคุณที่นี่" }); } catch (err) {}
    selectAppPlan("CI Extra Plus");
};
