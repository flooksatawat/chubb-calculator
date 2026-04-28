// ==================== app.js ====================
let state = {
    plan: "CI Extra Plus", subPlan: "20CX", gender: "male", age: 30,
    sum: 1000000, prem: 0, cash: 120000, hx: "HX15", extra: "none", advance: "none", tpd: 1000000
};

function calculate() {
    const config = PLANS_CONFIG[state.plan];
    const baseRate = 25.5; // Placeholder
    
    if (!config.is3D) {
        state.prem = Math.round((state.sum / 1000) * baseRate);
        document.getElementById('premInput').value = state.prem.toLocaleString();
    } else {
        // Logic 3D: CL + 3D + Extra + Advance + TPD
        state.prem = 15000 + 2000; // Placeholder calculation
    }
    
    document.getElementById('actionBtn').innerText = (config.ui === "table") ? "ตารางมูลค่า" : "ดูรายละเอียด";
}

function setPlan(p) {
    state.plan = p;
    const config = PLANS_CONFIG[p];
    state.subPlan = config.subPlans[0];
    state.sum = config.defaultSum || 1000000;
    
    setText('headerTitle', p);
    setText('headerSubtitle', config.subtitle);
    setText('premLabel', config.labelPrem || "ออมเงิน (บาท/ปี)");
    setText('sumLabel', config.labelSum || "วงเงินคุ้มครอง (บาท)");

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

function renderPills() {
    const config = PLANS_CONFIG[state.plan];
    const sumWrapper = document.getElementById('sumPills');
    const cashWrapper = document.getElementById('cashPills');
    
    if (config.sumPills) {
        sumWrapper.innerHTML = config.sumPills.map(v => `<div onclick="setSum(${v})" class="quick-pill">${v >= 1000000 ? v/1000000+'M' : v/1000+'K'}</div>`).join('');
    }

    if (config.hasCash) {
        cashWrapper.innerHTML = [120000, 300000, 600000, 1000000].map(v => `<div onclick="setCash(${v})" class="quick-pill">${v/1000}K</div>`).join('');
    }
}

function renderResultContent() {
    const container = document.getElementById('resultContent');
    if (state.plan === "CI Extra Plus") {
        container.innerHTML = `
            <div class="p-4 rounded-2xl bg-blue-50 border-l-4 border-blue-600">
                <p class="text-[10px] font-bold text-blue-600 uppercase">ออมเงินต่อปี</p>
                <p class="text-2xl font-black text-blue-900">${state.prem.toLocaleString()} บาท</p>
            </div>
            <div class="grid grid-cols-1 gap-2">
                <div class="p-3 bg-white rounded-xl border border-sky-100 flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-600">ตรวจพบ 1 ใน 15 โรคเด็ก</span>
                    <span class="font-black text-sky-600">${state.sum.toLocaleString()}</span>
                </div>
                <div class="p-3 bg-white rounded-xl border border-amber-100 flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-600">1 ใน 5 โรคร้าย (4 ครั้ง)</span>
                    <span class="font-black text-amber-600">${(state.sum*0.25).toLocaleString()}</span>
                </div>
                <div class="p-3 bg-white rounded-xl border border-rose-100 flex justify-between items-center">
                    <span class="text-xs font-bold text-slate-600">1 ใน 45 โรคร้ายแรง</span>
                    <span class="font-black text-rose-600">${(state.sum*0.75).toLocaleString()}</span>
                </div>
            </div>
            <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p class="text-xs font-bold text-indigo-700"><i class="fas fa-shield-heart mr-1"></i> กรณีเสียชีวิต / ครบสัญญา</p>
                <p class="text-lg font-black text-indigo-900">${(state.sum*1.05).toLocaleString()} บาท</p>
            </div>
        `;
    } else {
        container.innerHTML = `<p class="text-center py-10 text-slate-400">สรุปผลสำหรับ ${state.plan}</p>`;
    }
}

// System Init
window.onload = () => { setPlan("CI Extra Plus"); };

// Helpers
function setText(id, txt) { document.getElementById(id).innerText = txt; }
function openPopup(id) { document.getElementById(id).classList.add('show'); }
function closePopup(id) { document.getElementById(id).classList.remove('show'); }
function setGender(g) { state.gender = g; calculate(); }
function changeAge(v) { state.age += v; calculate(); }
function setSum(v) { state.sum = v; document.getElementById('sumInput').value = v.toLocaleString(); calculate(); }
function setCash(v) { state.cash = v; document.getElementById('cashInput').value = v.toLocaleString(); calculate(); }
function handleMainAction() { if(PLANS_CONFIG[state.plan].ui === "table") switchView('table'); else { renderResultContent(); openPopup('resultModal'); } }
