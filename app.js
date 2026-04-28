// ==================== app.js ====================
let state = {
    plan: "CI Extra Plus", subPlan: "20CX", gender: "male", age: 30,
    sum: 1000000, prem: 0, cash: 120000, hx: "HX15", extra: "none", advance: "none", tpd: 1000000
};

function calculate() {
    const config = PLANS_CONFIG[state.plan];
    const baseRate = 25.5; // Placeholder สำหรับ Phase 2
    
    if (!config.is3D) {
        state.prem = Math.round((state.sum / 1000) * baseRate);
        document.getElementById('premInput').value = state.prem.toLocaleString();
    } else {
        // สูตร 3D: สัญญาหลัก + 3D + Extra + Advance + TPD
        state.prem = 18000; // Placeholder
    }
    
    document.getElementById('mainActionBtn').innerText = (config.uiType === "table") ? "ตารางมูลค่า" : "ดูรายละเอียด";
}

function setPlan(p) {
    state.plan = p;
    const config = PLANS_CONFIG[p];
    state.subPlan = config.subPlans[0];
    state.sum = config.defaultSum || 1000000;
    
    document.getElementById('headerTitle').innerText = p;
    document.getElementById('headerSubtitle').innerText = config.subtitle;
    document.getElementById('premLabel').innerText = config.labelPrem || "ออมเงิน (บาท/ปี)";
    document.getElementById('sumLabel').innerText = config.labelSum || "วงเงินคุ้มครอง (บาท)";

    // UI Visibilities
    document.getElementById('sumContainer').classList.toggle('hidden', !config.showSum);
    document.getElementById('premContainer').classList.toggle('hidden', !config.showPrem);
    document.getElementById('hxSelectionBox').classList.toggle('hidden', !config.is3D);
    document.getElementById('extraAdvanceBox').classList.toggle('hidden', !config.is3D);
    document.getElementById('tpdBox').classList.toggle('hidden', !config.is3D);
    document.getElementById('cashFlowBox').classList.toggle('hidden', !config.hasCash);

    renderSubPlans();
    renderPills();
    calculate();
    closePopup('planModal');
}

function renderSubPlans() {
    const wrapper = document.getElementById('subPlanWrapper');
    const config = PLANS_CONFIG[state.plan];
    if (config.subPlans.length <= 1) {
        wrapper.classList.add('hidden');
    } else {
        wrapper.classList.remove('hidden');
        wrapper.innerHTML = config.subPlans.map(sp => 
            `<button onclick="setSubPlan('${sp}')" class="flex-1 rounded-[14px] font-bold text-xs ${state.subPlan === sp ? 'active-male text-white' : 'text-slate-500'}">${sp}</button>`
        ).join('');
    }
}

function renderPills() {
    const config = PLANS_CONFIG[state.plan];
    const sumWrapper = document.getElementById('sumPills');
    const premWrapper = document.getElementById('premPills');
    const cashWrapper = document.getElementById('cashPills');

    if (config.sumPills) {
        sumWrapper.innerHTML = config.sumPills.map(v => `<div onclick="setSum(${v})" class="quick-pill">${v >= 1000000 ? v/1000000+'M' : v/1000+'K'}</div>`).join('');
    }
    if (config.premPills) {
        premWrapper.innerHTML = config.premPills.map(v => `<div onclick="setPrem(${v})" class="quick-pill">${v/1000}K</div>`).join('');
    }
    if (config.hasCash) {
        cashWrapper.innerHTML = CASH_PILLS.map(v => `<div onclick="setCash(${v})" class="quick-pill">${v/1000}K</div>`).join('');
    }
}

function renderResultContent() {
    const container = document.getElementById('resultContent');
    if (state.plan === "CI Extra Plus") {
        container.innerHTML = `
            <div class="p-4 rounded-2xl bg-white border border-blue-100 border-l-4 border-blue-600 shadow-sm">
                <p class="text-[10px] font-bold text-blue-500 uppercase">ออมเงินต่อปี</p>
                <p class="text-2xl font-black text-blue-900">${state.prem.toLocaleString()} บาท</p>
            </div>
            <div class="grid grid-cols-1 gap-2">
                <div class="p-3 bg-white rounded-xl border border-sky-100 flex justify-between items-center shadow-sm">
                    <span class="text-xs font-bold text-slate-600">ตรวจพบ 1 ใน 15 โรคเด็ก</span>
                    <span class="font-black text-sky-600">${state.sum.toLocaleString()}</span>
                </div>
                <div class="p-3 bg-white rounded-xl border border-amber-100 flex justify-between items-center shadow-sm">
                    <span class="text-xs font-bold text-slate-600">1 ใน 5 โรคร้าย (จ่าย 4 ครั้ง)</span>
                    <span class="font-black text-amber-600">${(state.sum*0.25).toLocaleString()}</span>
                </div>
                <div class="p-3 bg-white rounded-xl border border-rose-100 flex justify-between items-center shadow-sm">
                    <span class="text-xs font-bold text-slate-600">1 ใน 45 โรคร้ายแรง</span>
                    <span class="font-black text-rose-600">${(state.sum*0.75).toLocaleString()}</span>
                </div>
            </div>
            <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-inner">
                <p class="text-xs font-bold text-indigo-700 mb-1"><i class="fas fa-shield-heart mr-1"></i> กรณีเสียชีวิต / ครบสัญญา</p>
                <p class="text-lg font-black text-indigo-900">${(state.sum*1.05).toLocaleString()} บาท</p>
                <p class="text-[9px] text-indigo-500 font-medium">* เพิ่มความคุ้มครอง TPD เป็น 2 เท่า หรือ ${(state.sum*2).toLocaleString()} บาท</p>
            </div>
        `;
    } else {
        container.innerHTML = `<div class="py-10 text-center text-slate-400">สรุปข้อมูลแผน ${state.plan}<br>(รออัปเดตข้อมูล TPD 2 เท่า)</div>`;
    }
}

// Helpers
function openPlanModal() {
    const list = document.getElementById('planList');
    list.innerHTML = Object.keys(PLANS_CONFIG).map(p => `
        <div onclick="setPlan('${p}')" class="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between active:bg-blue-50 transition-all shadow-sm">
            <div><p class="font-bold text-slate-800">${p}</p><p class="text-[10px] text-slate-500">${PLANS_CONFIG[p].subtitle}</p></div>
            <i class="fas fa-chevron-right text-slate-300"></i>
        </div>`).join('');
    openPopup('planModal');
}
function setGender(g) { state.gender = g; document.getElementById('mBtn').className = `flex-1 rounded-[14px] font-bold ${g==='male'?'active-male text-white':'text-slate-500'}`; document.getElementById('fBtn').className = `flex-1 rounded-[14px] font-bold ${g==='female'?'active-female text-white':'text-slate-500'}`; calculate(); }
function changeAge(v) { state.age = Math.max(0, Math.min(65, state.age + v)); document.getElementById('ageInput').value = state.age; calculate(); }
function setSum(v) { state.sum = v; document.getElementById('sumInput').value = v.toLocaleString(); calculate(); }
function setPrem(v) { state.prem = v; document.getElementById('premInput').value = v.toLocaleString(); calculate(); }
function setCash(v) { state.cash = v; document.getElementById('cashInput').value = v.toLocaleString(); calculate(); }
function setSubPlan(sp) { state.subPlan = sp; renderSubPlans(); calculate(); }
function handleManualInput(el, key) { let val = parseInt(el.value.replace(/,/g, '')) || 0; state[key] = val; el.value = val.toLocaleString(); calculate(); }
function openPopup(id) { document.getElementById(id).style.display = 'flex'; setTimeout(() => document.getElementById(id).classList.add('show'), 10); }
function closePopup(id) { document.getElementById(id).classList.remove('show'); setTimeout(() => document.getElementById(id).style.display = 'none', 300); }
function triggerAction() { if(PLANS_CONFIG[state.plan].uiType === "table") switchView('table'); else { renderResultContent(); openPopup('resultModal'); } }

window.onload = () => { setPlan("CI Extra Plus"); };
