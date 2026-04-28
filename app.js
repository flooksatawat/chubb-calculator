// ==================== app.js ====================
const setText = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };
const formatNum = (num) => { const rounded = Math.round(num * 100) / 100; return Number.isInteger(rounded) ? rounded.toLocaleString() : rounded.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}); };

let currentAppPlan = "CI Extra Plus";
let currentPlan = '20CX'; 
let currentGender = 'male';
let lastCalculationData = null;
let currentMode = 'sum';
let currentCashFlow = 120000; // ค่าเริ่มต้นกระแสเงินสด 120,000

let currentHX = 'HX15';
let currentExtra = 'ไม่เลือก';
let currentAdvance = 'ไม่เลือก';

// สร้าง UI องค์ประกอบเพิ่มเติมโดยอัตโนมัติ (เช่น HX Dropdown)
function initDynamicUI() {
    const cashFlowInput = document.getElementById('cashFlowInput');
    if (cashFlowInput) cashFlowInput.value = "120,000";

    if (!document.getElementById('hxSelectionBox')) {
        const extraBox = document.getElementById('threeDExtraOptions');
        if (extraBox) {
            const hxHtml = `
            <div id="hxSelectionBox" class="premium-card !p-2 mb-3 hidden">
                <p class="text-[10px] font-bold text-slate-400 uppercase mb-2 text-center">เลือกแผนหลัก HX (สุขภาพ)</p>
                <select id="hxPlan" class="w-full h-10 rounded-xl bg-slate-100 border-none px-3 font-bold text-sm text-center outline-none" onchange="currentHX=this.value; calculate('sum');">
                    <option value="HX15">HX 1.5 ล้าน</option>
                    <option value="HX20">HX 2.0 ล้าน</option>
                    <option value="HX40">HX 4.0 ล้าน</option>
                    <option value="HX60">HX 6.0 ล้าน</option>
                    <option value="HX150">HX 15 ล้าน</option>
                    <option value="HX300">HX 30 ล้าน</option>
                </select>
            </div>`;
            extraBox.insertAdjacentHTML('beforebegin', hxHtml);
        }
    }
}

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

function setQuickSum(val) { document.getElementById('sumInsuredInput').value = val.toLocaleString(); calculate('sum'); }
function setQuickPremium(val) { document.getElementById('premiumInput').value = val.toLocaleString(); calculate('premium'); }
function setQuickCashFlow(val) { currentCashFlow = val; document.getElementById('cashFlowInput').value = val.toLocaleString(); calculate(currentMode); }

function selectAppPlan(planName) {
    closePopup('planSelectModal'); 
    currentAppPlan = planName; 
    const config = PLANS_CONFIG[planName];
    
    document.getElementById('headerTitleText').innerText = planName;
    document.getElementById('headerDescText').innerText = config.subtitle;
    
    currentPlan = config.subPlans[0]; 

    // Render Sub-plans
    const planSelectionWrapper = document.getElementById('planSelectionWrapper');
    const planContainer = document.getElementById('planSelectionContainer');
    if (config.subPlans.length <= 1) {
        planSelectionWrapper.classList.add('hidden');
    } else {
        planSelectionWrapper.classList.remove('hidden');
        planContainer.innerHTML = config.subPlans.map(sp => 
            `<button onclick="setPlan('${sp}')" id="btnPlan_${sp}" class="flex-1 rounded-[14px] text-[14px] font-bold ${sp === currentPlan ? 'active-blue text-white' : 'text-slate-500 hover:bg-slate-50'} transition-all">${sp}</button>`
        ).join('');
    }

    // Render Pills
    const sumPillsContainer = document.querySelector('#sumInsuredContainer .quick-pill-container');
    if (config.pills.length === 0) {
        sumPillsContainer.classList.add('hidden');
    } else {
        sumPillsContainer.classList.remove('hidden');
        sumPillsContainer.innerHTML = config.pills.map(val => `<button onclick="setQuickSum(${val})" class="quick-pill">${val >= 1000000 ? (val/1000000)+' ล้าน' : (val/100000)+' แสน'}</button>`).join('');
    }

    // UI Updates
    document.getElementById('premiumLabel').innerText = config.labelPremium;
    document.getElementById('cashFlowContainer').classList.toggle('hidden', !config.showCashFlow);
    document.getElementById('threeDExtraOptions').classList.toggle('hidden', !config.allowRiders);
    document.getElementById('threeDExtraOptions').classList.toggle('grid', config.allowRiders);
    
    // กฎพิเศษสำหรับ 3D Health: ซ่อนช่องกรอกทุนหลัก และโชว์ปุ่มเลือก HX
    const hxBox = document.getElementById('hxSelectionBox');
    if (config.is3D) {
        document.getElementById('sumInsuredContainer').classList.add('hidden');
        if (hxBox) hxBox.classList.remove('hidden');
    } else {
        document.getElementById('sumInsuredContainer').classList.remove('hidden');
        if (hxBox) hxBox.classList.add('hidden');
    }

    // จัดการปุ่ม Action (เปลี่ยนชื่อเป็น "ตารางมูลค่า" ตามสั่ง)
    const mainActionBtn = document.getElementById('mainActionBtn');
    if (config.uiType === "table") {
        mainActionBtn.innerHTML = `<i class="fas fa-table text-xl"></i> ตารางมูลค่า`; 
        mainActionBtn.onclick = function() { switchView('table'); };
    } else {
        mainActionBtn.innerHTML = `<i class="fas fa-file-alt text-xl"></i> ดูรายละเอียด`; 
        mainActionBtn.onclick = function() { manualTriggerPopup(); };
    }

    // Set Default Sum
    if(config.defaultSum > 0) {
        document.getElementById('sumInsuredInput').value = config.defaultSum.toLocaleString();
    }

    calculate('sum');
}

function setPlan(subPlan) { 
    currentPlan = subPlan; 
    const config = PLANS_CONFIG[currentAppPlan];
    config.subPlans.forEach(sp => {
        const btn = document.getElementById(`btnPlan_${sp}`);
        if(btn) btn.className = `flex-1 rounded-[14px] text-[14px] font-bold ${sp === currentPlan ? 'active-blue text-white' : 'text-slate-500 hover:bg-slate-50'} transition-all`;
    });
    calculate(currentMode); 
}

// รอรับข้อมูล Rate จากไฟล์ data_premium.js
function getBaseRate(plan, gender, age) {
    if (typeof PREMIUM_DATA !== 'undefined' && PREMIUM_DATA[plan] && PREMIUM_DATA[plan][gender]) {
        return PREMIUM_DATA[plan][gender][age] || 0;
    }
    return 0; // ถ้าหาไม่เจอ ให้คืนค่า 0 ชั่วคราว (กันพังก่อนเติม Data)
}

function calculate(source) { 
    currentMode = source; 
    const age = parseInt(document.getElementById('ageInput').value) || 0; 
    const config = PLANS_CONFIG[currentAppPlan];
    
    let baseRate = getBaseRate(currentPlan, currentGender, age);
    let fSum = parseFloat(document.getElementById('sumInsuredInput').value.replace(/,/g, '')) || 0; 
    let fPrem = 0;

    if (baseRate > 0) {
        if (config.is3D) {
            // โหมด 3D: ไม่สนทุนที่กรอก ให้ดึงทุนจาก CL ขั้นต่ำ หรือคิดเบี้ยแบบตายตัว
            // (เดี๋ยวใส่ Logic บวก TPD, Extra, Advance ตรงนี้เมื่อได้ข้อมูล Data จริง)
            fPrem = 25000; // สมมติตัวเลขรอ Data
            document.getElementById('premiumInput').value = fPrem.toLocaleString();
        } else {
            if (source === 'sum') { 
                fPrem = (fSum / 1000) * baseRate; // รออัปเดตระบบส่วนลดตามไฟล์จริง
                document.getElementById('premiumInput').value = Math.round(fPrem).toLocaleString(); 
            } else { 
                fPrem = parseFloat(document.getElementById('premiumInput').value.replace(/,/g, '')) || 0; 
                fSum = (fPrem * 1000) / baseRate; 
                document.getElementById('sumInsuredInput').value = formatNum(fSum); 
            }
        }
    }

    let yearsStr = '20'; const matchYears = currentPlan.match(/\d+/); if (matchYears) yearsStr = matchYears[0];
    
    lastCalculationData = { 
        premium: fPrem, sum: fSum, gender: currentGender==='male'?'ชาย':'หญิง', age: age, years: yearsStr, cashFlow: currentCashFlow 
    }; 
    
    // ถ้ามี Rate หรือเป็น 3D ค่อยรีเฟรชจอ (กันมันว่าง)
    if (baseRate > 0 || config.is3D) refreshAllDisplays(); 
    return lastCalculationData; 
}

function manualTriggerPopup() { const calcData = calculate('sum'); if (calcData) openModal(calcData); }

function openModal(d) { 
    if(!d) return; 
    setText('modalGender', d.gender); setText('modalAge', d.age + " ปี"); setText('modalYears', d.years + " ปี"); 
    setText('modalPremium', Math.round(d.premium).toLocaleString()); setText('modalSum', formatNum(d.sum)); 
    
    const dynamicContent = document.getElementById('dynamicModalContent');
    let html = '';

    // สร้างเนื้อหาของ Modal ตามแบบประกัน (พร้อมเพิ่ม TPD 2 เท่า)
    switch(currentAppPlan) {
        case "CI Extra Plus":
            const sumStr = formatNum(d.sum); const extraCI = formatNum(d.sum * 0.25); const majorCI = formatNum(d.sum * 0.75); const medExtra = formatNum(d.sum * 0.10); const maturityStr = formatNum(d.sum * 1.05); const maturityExtraStr = formatNum(d.sum * 0.05);
            html += `<div class="flex flex-col p-4 bg-white rounded-2xl shadow-sm border border-amber-100"><div class="flex justify-between items-center mb-1"><span class="text-[12px] text-slate-600 font-bold">1 ใน 5 โรคร้าย (จ่ายสูงสุด 4 ครั้ง)</span><span class="text-[16px] font-black text-amber-600">${extraCI}</span></div><button onclick="openPopup('disease5Modal')" class="text-[11px] text-amber-600 bg-amber-50 py-1.5 rounded-lg font-bold hover:bg-amber-100 transition-colors w-full mt-2">ดูรายชื่อโรค</button></div>
            <div class="flex flex-col p-4 bg-white rounded-2xl shadow-sm border border-rose-100"><div class="flex justify-between items-center mb-1"><span class="text-[12px] text-slate-600 font-bold">1 ใน 45 โรคร้ายระยะรุนแรง</span><span class="text-[16px] font-black text-rose-600">${majorCI}</span></div><p class="text-[10px] text-slate-400 mb-2">* ยกเว้นการออม และมีค่ารักษาเพิ่มเติม <span class="font-bold text-slate-600">${medExtra}</span> บาท</p></div>
            <div class="flex flex-col p-4 bg-white rounded-2xl shadow-sm border border-indigo-100"><div class="flex justify-between items-center mb-1"><span class="text-[12px] text-slate-600 font-bold">จากไป หรือ ครบสัญญา</span><span class="text-[16px] font-black text-indigo-600">${maturityStr}</span></div><p class="text-[10px] text-slate-400 mb-2">* ทุพพลภาพสิ้นเชิงถาวร (TPD) รับ 2 เท่า (${formatNum(d.sum*2)} บาท)</p></div>`;
            break;
        case "Century Life + TPD":
            html += `<div class="flex flex-col p-4 bg-white rounded-2xl shadow-sm border border-emerald-100"><div class="flex justify-between items-center mb-1"><span class="text-[12px] text-slate-600 font-bold">ความคุ้มครองชีวิต</span><span class="text-[16px] font-black text-emerald-600">${formatNum(d.sum)}</span></div><p class="text-[10px] text-slate-400 mb-2">* ทุพพลภาพสิ้นเชิงถาวร (TPD) รับความคุ้มครองเพิ่มเป็น 2 เท่า (${formatNum(d.sum*2)} บาท)</p></div>`;
            break;
        default:
            html += `<div class="p-4 text-center text-sm text-slate-500">ตารางแสดงผล TPD 2 เท่าสำหรับ ${currentAppPlan}</div>`;
    }

    if (dynamicContent) dynamicContent.innerHTML = html;
    openPopup('resultModal'); 
}

function switchView(targetView) {
    const views = { 'main': document.getElementById('mainView'), 'table': document.getElementById('tableView'), 'cash': document.getElementById('cashView'), 'ai': document.getElementById('aiView') };
    const navBtns = { 'main': document.getElementById('navMainBtn'), 'table': document.getElementById('navTableBtn'), 'cash': document.getElementById('navCashBtn'), 'ai': document.getElementById('navAiBtn') };
    if ((targetView === 'table' || targetView === 'cash' || targetView === 'ai') && !lastCalculationData) { showCustomError("กรุณาคำนวณก่อนใช้งานเมนูนี้"); return; }
    if (targetView === 'table') generatePolicyTableData();
    if (targetView === 'cash') refreshAllDisplays();
    Object.values(views).forEach(view => { if (view) view.classList.add('hidden'); });
    Object.values(navBtns).forEach(btn => { if (btn) btn.classList.remove('active'); });
    if (views[targetView]) views[targetView].classList.remove('hidden');
    if (navBtns[targetView]) navBtns[targetView].classList.add('active');
}

function openPlanModal() {
    const container = document.getElementById('unifiedPlanList'); 
    container.innerHTML = allInsurancePlans.map(p => `
        <button onclick="selectAppPlan('${p.name}')" class="w-full relative flex items-center text-left p-3.5 rounded-[20px] bg-white hover:bg-slate-50 border border-transparent hover:border-blue-200 transition-all mb-2 shadow-sm">
            <div class="w-12 h-12 rounded-[14px] ${p.bg} ${p.color} flex items-center justify-center text-[20px] shrink-0 mr-4 shadow-inner"><i class="${p.icon}"></i></div>
            <div class="flex-1 pr-8"><h4 class="text-[15px] font-bold text-slate-800 leading-tight mb-0.5">${p.name}</h4><p class="text-[11px] text-slate-500 font-medium leading-tight">${p.desc}</p></div>
        </button>`).join('');
    openPopup('planSelectModal');
}

function refreshAllDisplays() { 
    if (!lastCalculationData) return; 
    // ส่วนอัปเดตหน้า CASH โค้ดคอมมิชชัน 
    const p = lastCalculationData.premium; 
    if (COM_RATES[currentPlan]) {
        const fyc = Math.round(p * COM_RATES[currentPlan][0]); 
        setText('caseIncomeComm', fyc.toLocaleString() + " บาท"); 
    }
}

function generatePolicyTableData() {
    if (!lastCalculationData) return; const d = lastCalculationData; 
    const showCashFlow = PLANS_CONFIG[currentAppPlan].showCashFlow;
    
    document.getElementById('tableHeaderTitle').innerHTML = `<span class="truncate">${currentPlan} ${d.gender} ${d.age} ทุน ${formatNum(d.sum)}</span>`;
    document.getElementById('policyTableHead').innerHTML = `<tr class="text-slate-500 shadow-sm text-[11px] sm:text-[12px]"><th class="py-3 px-1 font-bold">อายุ</th><th class="py-3 px-1 font-bold">เบี้ย/ปี</th><th class="py-3 px-1 font-bold text-blue-600">เบี้ยสะสม</th>${showCashFlow ? `<th class="py-3 px-1 font-bold text-emerald-600">กระแสเงินสด</th>` : ''}<th class="py-3 px-1 font-bold text-amber-600">เงินสดคืน</th></tr>`;
    
    // ตรงนี้เราจะมารอเขียนระบบอ่านข้อมูล CV_DATA ทีหลังเมื่อข้อมูลจาก Excel พร้อมครับ
    document.getElementById('policyTableBody').innerHTML = `<tr><td colspan="5" class="py-10 text-slate-400">รออัปเดตฐานข้อมูลตารางมูลค่า (Phase 2)</td></tr>`;
}

// อัปเกรดข้อความแชร์ให้มี TPD 2 เท่า
function getShareTextByPlan(d) {
    return `\n* เพิ่มความคุ้มครองทุพพลภาพสิ้นเชิงถาวร (TPD) เป็น 2 เท่า (${formatNum(d.sum * 2)} บาท)\n`;
}

async function executeShare(text) {
    if (typeof liff !== 'undefined' && liff.isApiAvailable('shareTargetPicker')) {
        await liff.shareTargetPicker([{ type: "text", text: text }]);
    } else {
        navigator.clipboard.writeText(text);
        alert("คัดลอกข้อความสำเร็จ");
    }
}
function openGenericShareModal(type) { 
    if (!lastCalculationData) return;
    const d = lastCalculationData;
    let text = `📊 สรุปแผน: ${currentAppPlan}\n👤 เพศ ${d.gender}\n🎂 อายุ ${d.age} ปี\n💰 เบี้ย : ${Math.round(d.premium).toLocaleString()} บาท/ปี\n🛡️ ทุนประกัน ${formatNum(d.sum)} บาท\n`; 
    text += getShareTextByPlan(d);
    executeShare(text);
}

// Initialize ตอนเปิดเว็บ
window.onload = async () => { 
    initDynamicUI();
    try {
        await liff.init({ liffId: "ใส่_LIFF_ID_ของคุณที่นี่" });
    } catch (err) {}
    selectAppPlan("CI Extra Plus");
};
