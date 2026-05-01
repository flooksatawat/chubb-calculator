// ==================== JS LOGIC & UTILITIES ====================
var setText = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };
var formatNum = (num) => { const rounded = Math.round(num * 100) / 100; return Number.isInteger(rounded) ? rounded.toLocaleString() : rounded.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}); };
var formatPct = (num) => { return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + '%'; };
var getSafeValue = (id) => { const el = document.getElementById(id); if (!el || !el.value) return 0; return parseFloat(el.value.toString().replace(/,/g, '')) || 0; };

// ==================== GLOBAL STATE ====================
var currentAppPlan = "CI Extra Plus";
var currentPlan = '20CX', currentGender = 'male', lastCalculationData = null, currentMode = 'sum';
var currentPlanOptions = ['10CX', '20CX'];
var cvDataLookup = {};

// ค่าเริ่มต้น 3D Health
window.currentHX = 'HX15'; window.currentHXO = 'ไม่เลือก'; window.currentHXD = 'ไม่เลือก'; window.currentHBF = 'ไม่เลือก'; window.currentMF = 'ไม่เลือก';

// ==================== DATA ARCHITECTURE & CONFIG ====================
var LIFE_RATES = {}; var CI_RATES = {}; var COM_RATES = {};

var PLAN_CONFIG = {
    "CI Extra Plus": { abbr: "CX", minAge: 0, maxAge: 65, minSum: 100000, minPrem: 4000, getMaxSum: (age) => age <= 15 ? 3000000 : 10000000, options: ['10CX', '20CX'], hasCashFlow: false },
    "Signature Legacy": { abbr: "SLB", minAge: 0, maxAge: 70, minSum: 5000000, minPrem: 0, getMaxSum: (age) => 500000000, options: ['5SLB', '10SLB'], hasCashFlow: false },
    "Life Protector 20": { abbr: "LPB", minAge: 0, maxAge: 65, minSum: 500000, minPrem: 4000, getMaxSum: (age) => Infinity, options: ['20LPB'], hasCashFlow: false },
    "Supreme Life Protector": { abbr: "SLPA", minAge: 0, maxAge: 65, minSum: 500000, minPrem: 4000, getMaxSum: (age) => Infinity, options: ['20SLPA'], hasCashFlow: false },
    "Whole Life Extra": { abbr: "WXN", minAge: 0, maxAge: 65, minSum: 100000, minPrem: 50000, getMaxSum: (age) => Infinity, options: ['WXN10', 'WXN15'], hasCashFlow: true },
    "24 TX": { abbr: "TX", minAge: 0, maxAge: 65, minSum: 100000, minPrem: 50000, getMaxSum: (age) => Infinity, options: ['24TX'], hasCashFlow: true },
    "868 / 818 Elite Saving": { abbr: "Elite", minAge: 0, maxAge: 65, minSum: 100000, minPrem: 50000, getMaxSum: (age) => Infinity, options: ['S868', 'S818'], hasCashFlow: true },
    "Century Life + TPD": { abbr: "CLA", minAge: 0, maxAge: 65, minSum: 100000, minPrem: 4000, getMaxSum: (age) => Infinity, options: ['10CL', '20CL', '60CL', '90CL'], hasCashFlow: false },
    "3D Health Excellence": { abbr: "3D", minAge: 11, maxAge: 65, minSum: 100000, minPrem: 4000, getMaxSum: (age) => Infinity, options: ['10CL', '20CL', '60CL', '90CL'], hasCashFlow: false },
    "Convertable Term": { abbr: "TLA", minAge: 20, maxAge: 65, minSum: 1000000, minPrem: 4000, getMaxSum: (age) => Infinity, options: ['TLA'], hasCashFlow: false },
    "Medical Fund": { abbr: "MF", minAge: 0, maxAge: 65, minSum: 0, minPrem: 0, getMaxSum: (age) => Infinity, options: [], hasCashFlow: false }
};

var allInsurancePlans = [
    { name: "CI Extra Plus", desc: "ออมเงิน : ชดเชยโรคร้าย+วงเงินพิเศษ", icon: "fas fa-shield-heart", color: "text-rose-500", bg: "bg-rose-100" },
    { name: "Life Protector 20", desc: "เปลี่ยนทุนประกัน เป็นบำนาญ", icon: "fas fa-piggy-bank", color: "text-emerald-500", bg: "bg-emerald-100" },
    { name: "Supreme Life Protector", desc: "เปลี่ยนทุนประกัน เป็นบำนาญ", icon: "fas fa-piggy-bank", color: "text-emerald-500", bg: "bg-emerald-100" },
    { name: "Signature Legacy", desc: "แผนมรดก ลูกค้ามูลค่าสูง", icon: "fas fa-crown", color: "text-amber-500", bg: "bg-amber-100" },
    { name: "Convertable Term", desc: "จองสิทธิ เปลี่ยนแบบประกันได้", icon: "fas fa-umbrella", color: "text-blue-500", bg: "bg-blue-100" },
    { name: "Century Life + TPD", desc: "แผนมรดก 100 ปี + TPD", icon: "fas fa-gem", color: "text-amber-500", bg: "bg-amber-100" },
    { name: "3D Health Excellence", desc: "ประกันสุขภาพ ที่เข้าใจทุกช่วงชีวิต", icon: "fas fa-hand-holding-medical", color: "text-teal-500", bg: "bg-teal-100" },
    { name: "Whole Life Extra", desc: "สินทรัพย์กระแสเงินสด", icon: "fas fa-money-bill-trend-up", color: "text-indigo-500", bg: "bg-indigo-100" },
    { name: "24 TX", desc: "สินทรัพย์กระแสเงินสด", icon: "fas fa-money-bill-trend-up", color: "text-indigo-500", bg: "bg-indigo-100" },
    { name: "868 / 818 Elite Saving", desc: "สินทรัพย์กระแสเงินสด", icon: "fas fa-money-bill-trend-up", color: "text-indigo-500", bg: "bg-indigo-100" }
];

async function loadAllRates() {
    const rateFiles = ['cx_rates.json', 'lp_rates.json', 'slb_rates.json', 'slpa_rates.json', 'tx_rates.json', 'elite_rates.json', 'cl_rates.json', 'tla_rates.json', 'hx_rates.json', 'hxd_rates.json', 'hxo_rates.json', '3d_health.json', 'hbf_rates.json', 'wxn_rates.json'];
    try {
        for (const file of rateFiles) {
            try { const r = await fetch(`data/rates/${file}`); if (r.ok) { const d = await r.json(); LIFE_RATES = { ...LIFE_RATES, ...d }; } } catch(e) {}
        }
        try { const r = await fetch('data/com/com_rates.json'); if (r.ok) { COM_RATES = await r.json(); window.COM_RATES = COM_RATES; } } catch(e) {}
    } catch (error) { console.error('loadAllRates failed:', error); }
}

async function getCVData() {
    if (Object.keys(cvDataLookup).length > 0) return cvDataLookup;
    try { const r = await fetch('data/cv/CV_DATA.json'); if (r.ok) { cvDataLookup = await r.json(); window.cvDataLookup = cvDataLookup; } } catch(e) { }
    return cvDataLookup;
}

function getHealthRate(categoryKey, planName, age, gender) { 
    if (!planName || planName === 'ไม่เลือก' || planName === '-') return 0;
    let cName = planName.trim().toUpperCase();
    if (LIFE_RATES[cName]?.[gender]?.[age]) return LIFE_RATES[cName][gender][age];
    for (let k in LIFE_RATES) {
        if (k.toUpperCase() === cName || k.replace(/\s/g,'').toUpperCase() === cName || k.toUpperCase() === `${categoryKey}${cName}`.toUpperCase()) {
            if (LIFE_RATES[k][gender]?.[age]) return LIFE_RATES[k][gender][age];
        }
    }
    return 0;
}

function getPlanAgeLimit(planName, appPlanName) {
    const config = PLAN_CONFIG[appPlanName] || { maxAge: 65, minAge: 0 };
    return { min: config.minAge !== undefined ? config.minAge : 0, max: config.maxAge }; 
}

function forceAgeValidation() {
    const input = document.getElementById('ageInput'); let val = parseInt(input.value) || 0; 
    const limits = getPlanAgeLimit(currentPlan, currentAppPlan);
    if (currentAppPlan === 'Whole Life Extra') {
        if (currentPlan === 'WXN10' && val > 50) { val = 50; showCustomError("แผน WXN10 รับประกันสูงสุดถึงอายุ 50 ปี"); }
        else if (currentPlan === 'WXN15') {
            if (val < 11) { val = 11; showCustomError("แผน WXN15 รับประกันตั้งแต่อายุ 11 ปี"); }
            if (val > 45) { val = 45; showCustomError("แผน WXN15 รับประกันสูงสุดถึงอายุ 45 ปี"); }
        }
    }
    if (val < limits.min) val = limits.min; if (val > limits.max) val = limits.max; 
    input.value = val; calculate(currentMode, true);
}

function adjustAge(delta) { 
    const input = document.getElementById('ageInput'); let val = parseInt(input.value) + delta; 
    const limits = getPlanAgeLimit(currentPlan, currentAppPlan);
    if (currentAppPlan === 'Whole Life Extra') {
        if (currentPlan === 'WXN10' && val > 50) { val = 50; showCustomError("แผน WXN10 รับประกันสูงสุดถึงอายุ 50 ปี"); } 
        else if (currentPlan === 'WXN15') {
            if (val < 11) { val = 11; showCustomError("แผน WXN15 รับประกันตั้งแต่อายุ 11 ปี"); }
            if (val > 45) { val = 45; showCustomError("แผน WXN15 รับประกันสูงสุดถึงอายุ 45 ปี"); }
        }
    }
    if (val < limits.min) val = limits.min; if (val > limits.max) val = limits.max; 
    input.value = val; calculate(currentMode, true); 
}

function setGender(gender) { 
    currentGender = gender; 
    const btnM = document.getElementById('btnMale'); const btnF = document.getElementById('btnFemale'); const genderBg = document.getElementById('genderBg');
    if(gender === 'male') {
        if(btnM) btnM.className = 'flex-1 relative z-10 rounded-[10px] text-[15px] font-bold text-blue-700 transition-all duration-300';
        if(btnF) btnF.className = 'flex-1 relative z-10 rounded-[10px] text-[15px] font-medium text-slate-500 hover:text-slate-700 transition-all duration-300';
        if(genderBg && btnM) { genderBg.style.width = btnM.offsetWidth + 'px'; genderBg.style.left = btnM.offsetLeft + 'px'; }
    } else {
        if(btnM) btnM.className = 'flex-1 relative z-10 rounded-[10px] text-[15px] font-medium text-slate-500 hover:text-slate-700 transition-all duration-300';
        if(btnF) btnF.className = 'flex-1 relative z-10 rounded-[10px] text-[15px] font-bold text-[#e11d48] transition-all duration-300';
        if(genderBg && btnF) { genderBg.style.width = btnF.offsetWidth + 'px'; genderBg.style.left = btnF.offsetLeft + 'px'; }
    }
    calculate(currentMode, true); 
}

function getDiscount(sum, plan) { 
    if (plan === '10CX') { if (sum >= 5000000) return 3.0; if (sum >= 1000000) return 2.0; } 
    else if (plan === '20CX') { if (sum >= 5000000) return 1.5; if (sum >= 1000000) return 1.0; if (sum >= 800000) return 0.5; } 
    else if (plan === 'WXN10' || plan === 'WXN15') {
        if (sum >= 1000000) return 5.0; if (sum >= 600000) return 3.0; if (sum >= 300000) return 1.0;
    }
    return 0; 
}

function handlePremiumInput(el) { let v = el.value.replace(/,/g, '').split('.')[0]; if (!isNaN(v) && v !== '') { el.value = Number(v).toLocaleString(); calculate('premium', true); } }
function handleSumInput(el) { let v = el.value.replace(/,/g, '').split('.')[0]; if (!isNaN(v) && v !== '') { el.value = Number(v).toLocaleString(); calculate('sum', true); } }
function handleCashFlowInput(el, type = 0) { 
    let v = el.value.replace(/,/g, '').split('.')[0]; 
    if (!isNaN(v) && v !== '') { 
        el.value = Number(v).toLocaleString(); 
        if(type === 1) calculate('cashflow1', true);
        else if(type === 2) calculate('cashflow2', true);
        else calculate('cashflow', true); 
    } 
}

function setQuickSum(val) { document.getElementById('sumInsuredInput').value = val.toLocaleString(); calculate('sum', true); }
function setQuickPremium(val) { document.getElementById('premiumInput').value = val.toLocaleString(); calculate('premium', true); }
function setQuickCashFlow(val) { const el = document.getElementById('cashFlowInput'); if(el) { el.value = val.toLocaleString(); calculate('cashflow', true); } }
function setWXNQuickCashFlow(val, type) {
    if (type === 1) { document.getElementById('cashFlowInput1').value = val.toLocaleString(); calculate('cashflow1', true); } 
    else if (type === 2) { document.getElementById('cashFlowInput2').value = val.toLocaleString(); calculate('cashflow2', true); }
}

// ==================== LOGIC: คำนวณหลัก (MASTER CALCULATION) ====================
function calculate(source, enforceMin = false) { 
    try {
        currentMode = source;
        let ageInput = document.getElementById('ageInput'); let age = parseInt(ageInput.value) || 0; 
        let fSum = 0, fPrem = 0; 
        const config = PLAN_CONFIG[currentAppPlan] || { minSum: 100000, minPrem: 4000 };
        
        const limits = getPlanAgeLimit(currentPlan, currentAppPlan);
        if (age < limits.min) { age = limits.min; ageInput.value = age; }
        if (age > limits.max) { age = limits.max; ageInput.value = age; }

        if (currentAppPlan === 'Whole Life Extra') {
            if (currentPlan === 'WXN10' && age > 50) { age = 50; ageInput.value = age; }
            if (currentPlan === 'WXN15') { if (age < 11) { age = 11; ageInput.value = age; } if (age > 45) { age = 45; ageInput.value = age; } }
        }
        if (currentAppPlan === '868 / 818 Elite Saving') { currentPlan = age <= 50 ? 'S868' : 'S818'; }

        if (source === 'sum') fSum = getSafeValue('sumInsuredInput');
        else if (source === 'premium') fPrem = getSafeValue('premiumInput');

        // ---------------- 1. Whole Life Extra (WXN) ----------------
        if (currentAppPlan === 'Whole Life Extra') {
            let clRate = LIFE_RATES[currentPlan]?.[currentGender]?.[age] || 0;
            if (clRate > 0) {
                let mfPrem = getHealthRate('MF', window.currentMF, age, currentGender);
                if (source === 'cashflow1') {
                    fSum = getSafeValue('cashFlowInput1') / 0.0225;
                    fPrem = Math.round((fSum / 1000) * (clRate - getDiscount(fSum, currentPlan))) + mfPrem;
                } else if (source === 'cashflow2') {
                    fSum = getSafeValue('cashFlowInput2') / 0.10;
                    fPrem = Math.round((fSum / 1000) * (clRate - getDiscount(fSum, currentPlan))) + mfPrem;
                } else if (source === 'sum') {
                    fPrem = Math.round((fSum / 1000) * (clRate - getDiscount(fSum, currentPlan))) + mfPrem;
                } else {
                    fPrem = getSafeValue('premiumInput') || 0; let basePrem = fPrem - mfPrem; if (basePrem < 0) basePrem = 0;
                    let baseDiscountArray = [5, 3, 1, 0];
                    for (let d_val of baseDiscountArray) { let s = (basePrem * 1000) / (clRate - d_val); if (getDiscount(s + 1, currentPlan) === d_val) { fSum = s; break; } } 
                    if (fSum === 0) fSum = clRate > 0 ? (basePrem * 1000) / clRate : 0;
                }
                
                if (enforceMin && fSum < config.minSum) {
                    fSum = config.minSum; showCustomError(`ทุนประกันขั้นต่ำ ${formatNum(config.minSum)} บาท`);
                    fPrem = Math.round((fSum / 1000) * (clRate - getDiscount(fSum, currentPlan))) + mfPrem;
                }
                if (enforceMin && fPrem < config.minPrem && config.minPrem > 0) {
                    showCustomError(`เบี้ยประกันขั้นต่ำ ต้องไม่น้อยกว่า ${config.minPrem.toLocaleString()} บาท/ปี`);
                    fPrem = config.minPrem; let basePrem = fPrem - mfPrem; fSum = clRate > 0 ? (basePrem * 1000) / clRate : 0;
                }
                
                document.getElementById('sumInsuredInput').value = formatNum(fSum);
                document.getElementById('premiumInput').value = Math.round(fPrem).toLocaleString();
                if(document.getElementById('cashFlowInput1')) document.getElementById('cashFlowInput1').value = Math.round(fSum * 0.0225).toLocaleString();
                if(document.getElementById('cashFlowInput2')) document.getElementById('cashFlowInput2').value = Math.round(fSum * 0.10).toLocaleString();
            }
        } 
        // ---------------- 2. 24TX และ Elite Saving ----------------
        else if (currentAppPlan === '24 TX' || currentAppPlan === '868 / 818 Elite Saving') {
            let rateKey = currentAppPlan === '24 TX' ? '24TX' : currentPlan;
            let clRate = LIFE_RATES[rateKey]?.[currentGender]?.[age] || 0;
            if (clRate > 0) {
                let mfPrem = getHealthRate('MF', window.currentMF, age, currentGender);
                if (source === 'cashflow') {
                    let cf = getSafeValue('cashFlowInput'); fSum = currentAppPlan === '24 TX' ? (cf / 0.01) : (cf / 0.12);
                    fPrem = Math.round((fSum / 1000) * clRate) + mfPrem;
                } else if (source === 'sum') {
                    fPrem = Math.round((fSum / 1000) * clRate) + mfPrem;
                } else { 
                    fPrem = getSafeValue('premiumInput') || 0; let basePrem = fPrem - mfPrem; if (basePrem < 0) basePrem = 0;
                    fSum = clRate > 0 ? (basePrem * 1000) / clRate : 0;
                }
                
                const maxSumAllowed = config.getMaxSum ? config.getMaxSum(age) : Infinity;
                if (fSum > maxSumAllowed) { fSum = maxSumAllowed; fPrem = Math.round((fSum / 1000) * clRate) + mfPrem; showCustomError(`ทุนประกันสูงสุด ${formatNum(maxSumAllowed)} บาท`); }
                if (enforceMin && fSum < config.minSum) { fSum = config.minSum; fPrem = Math.round((fSum / 1000) * clRate) + mfPrem; showCustomError(`ทุนประกันขั้นต่ำ ${formatNum(config.minSum)} บาท`); }
                if (enforceMin && fPrem < config.minPrem && config.minPrem > 0) {
                    showCustomError(`เบี้ยประกันขั้นต่ำ ต้องไม่น้อยกว่า ${config.minPrem.toLocaleString()} บาท/ปี`);
                    fPrem = config.minPrem; let basePrem = fPrem - mfPrem; fSum = clRate > 0 ? (basePrem * 1000) / clRate : 0;
                }

                document.getElementById('sumInsuredInput').value = formatNum(fSum);
                document.getElementById('premiumInput').value = Math.round(fPrem).toLocaleString();
                let cfVal = currentAppPlan === '24 TX' ? fSum * 0.01 : fSum * 0.12;
                if(document.getElementById('cashFlowInput')) document.getElementById('cashFlowInput').value = Math.round(cfVal).toLocaleString();
            }
        }
        // ---------------- 3. 3D Health Excellence ----------------
        else if (currentAppPlan === '3D Health Excellence') {
            let clPlan = currentPlan; if (!clPlan.includes('CL')) clPlan = '20CL'; 
            let clRate = LIFE_RATES[clPlan]?.[currentGender]?.[age] || 0; 
            
            let hxVal = window.currentHX || 'HX15'; let hxoVal = window.currentHXO || 'ไม่เลือก';
            let hxdVal = window.currentHXD || 'ไม่เลือก'; if (hxoVal === 'ไม่เลือก') hxdVal = 'ไม่เลือก'; 
            let hbfVal = window.currentHBF || 'ไม่เลือก'; let mfVal = window.currentMF || 'ไม่เลือก';
            
            let hxPrem = getHealthRate('HX', hxVal, age, currentGender);
            let hxoPrem = getHealthRate('HXO', hxoVal, age, currentGender);
            let hxdPrem = getHealthRate('HXD', hxdVal, age, currentGender);
            let hbfPrem = getHealthRate('HBF', hbfVal, age, currentGender);
            let mfPrem = getHealthRate('MF', mfVal, age, currentGender);
            
            let totalHealthPrem = hxPrem + hxoPrem + hxdPrem + hbfPrem + mfPrem;

            if (source === 'sum') {
                let basePrem = clRate > 0 ? (fSum / 1000) * clRate : 0;
                fPrem = basePrem + totalHealthPrem;
                document.getElementById('premiumInput').value = Math.round(fPrem).toLocaleString();
            } else {
                fPrem = getSafeValue('premiumInput') || 0;
                let basePrem = fPrem - totalHealthPrem; if(basePrem < 0) basePrem = 0;
                fSum = clRate > 0 ? (basePrem / clRate) * 1000 : 0;
                
                if (enforceMin && fSum < config.minSum) {
                    fSum = config.minSum; basePrem = (fSum / 1000) * clRate; fPrem = basePrem + totalHealthPrem;
                    showCustomError(`ทุนประกันขั้นต่ำ ${formatNum(config.minSum)} บาท`);
                }
                if (enforceMin && fPrem < config.minPrem && config.minPrem > 0) {
                    showCustomError(`เบี้ยประกันขั้นต่ำ ต้องไม่น้อยกว่า ${config.minPrem.toLocaleString()} บาท/ปี`);
                    fPrem = config.minPrem; basePrem = fPrem - totalHealthPrem; fSum = clRate > 0 ? (basePrem / clRate) * 1000 : 0;
                }
                
                document.getElementById('sumInsuredInput').value = formatNum(fSum);
                document.getElementById('premiumInput').value = Math.round(fPrem).toLocaleString();
            }
        } 
        // ---------------- 4. แบบประกันทั่วไป (CX, TLA, LPB, SLB, CLA) ----------------
        else {
            let rateKey = currentPlan === 'TLA' ? 'TLA_RATES' : currentPlan;
            const lifeRate = LIFE_RATES[rateKey]?.[currentGender]?.[age] || 0;
            const ciRate = CI_RATES[rateKey]?.[currentGender]?.[age] || 0; 
            const totalRate = lifeRate + ciRate; 
            let mfPrem = getHealthRate('MF', window.currentMF, age, currentGender);
            
            if (totalRate > 0) {
                if (source === 'sum') { 
                    if (currentAppPlan === 'Signature Legacy') {
                        if (fSum < 5000000 && enforceMin) { fSum = 5000000; showCustomError("ทุนประกันขั้นต่ำ 5 ล้านบาท"); }
                        if (fSum > 500000000) { fSum = 500000000; showCustomError("ทุนประกันสูงสุด 500 ล้านบาท"); }
                    } else if (enforceMin && fSum < config.minSum) {
                        fSum = config.minSum; showCustomError(`ทุนประกันขั้นต่ำ ${formatNum(config.minSum)} บาท`);
                    }
                    
                    let basePrem = (fSum / 1000) * (totalRate - getDiscount(fSum, currentPlan));
                    fPrem = Math.round(basePrem) + mfPrem; 
                    
                    if (currentAppPlan !== 'Signature Legacy' && enforceMin && fPrem < config.minPrem && config.minPrem > 0) {
                        showCustomError(`เบี้ยประกันขั้นต่ำ ต้องไม่น้อยกว่า ${config.minPrem.toLocaleString()} บาท/ปี`);
                        fPrem = config.minPrem; let baseP = fPrem - mfPrem; fSum = (baseP * 1000) / totalRate;
                    }
                    
                    document.getElementById('sumInsuredInput').value = formatNum(fSum); 
                    document.getElementById('premiumInput').value = fPrem.toLocaleString(); 
                } else { 
                    fPrem = getSafeValue('premiumInput') || 0;
                    let basePrem = fPrem - mfPrem; if(basePrem < 0) basePrem = 0;
                    
                    let baseDiscountArray = [0];
                    if (currentPlan === '10CX') baseDiscountArray = [3, 2, 0];
                    else if (currentPlan === '20CX') baseDiscountArray = [1.5, 1, 0.5, 0];
                    
                    for (let d_val of baseDiscountArray) { let s = (basePrem * 1000) / (totalRate - d_val); if (getDiscount(s + 1, currentPlan) === d_val) { fSum = s; break; } } 
                    if (fSum === 0) fSum = (basePrem * 1000) / totalRate; 
                    
                    if (currentAppPlan === 'Signature Legacy') {
                        if (fSum < 5000000 && enforceMin) { fSum = 5000000; showCustomError("ทุนประกันขั้นต่ำ 5 ล้านบาท"); } 
                        if (fSum > 500000000) { fSum = 500000000; showCustomError("ทุนประกันสูงสุด 500 ล้านบาท"); }
                        fPrem = Math.round(((fSum / 1000) * (totalRate - getDiscount(fSum, currentPlan)))) + mfPrem;
                    } else {
                        const maxSumAllowed = config.getMaxSum ? config.getMaxSum(age) : Infinity;
                        if (fSum > maxSumAllowed) {
                            showCustomError(`ทุนประกันสูงสุด ${maxSumAllowed === Infinity ? 'ไม่จำกัด' : formatNum(maxSumAllowed)} บาท`);
                            fSum = maxSumAllowed; fPrem = Math.round(((fSum / 1000) * (totalRate - getDiscount(fSum, currentPlan)))) + mfPrem;
                        }
                        if (enforceMin && fSum < config.minSum) {
                            fSum = config.minSum; fPrem = Math.round(((fSum / 1000) * (totalRate - getDiscount(fSum, currentPlan)))) + mfPrem;
                            showCustomError(`ทุนประกันขั้นต่ำ ${formatNum(config.minSum)} บาท`);
                        }
                        if (enforceMin && fPrem < config.minPrem && config.minPrem > 0) {
                            showCustomError(`เบี้ยประกันขั้นต่ำ ต้องไม่น้อยกว่า ${config.minPrem.toLocaleString()} บาท/ปี`);
                            fPrem = config.minPrem; let baseP = fPrem - mfPrem; fSum = (baseP * 1000) / totalRate;
                        }
                    }
                    document.getElementById('premiumInput').value = fPrem.toLocaleString();
                    document.getElementById('sumInsuredInput').value = formatNum(fSum); 
                } 
            }
        }
        
        let yearsStr = '20'; const matchYears = currentPlan.match(/\d+/); if (matchYears) yearsStr = matchYears[0];
        let cashFlowVal = 0;
        if(currentAppPlan === 'Whole Life Extra') cashFlowVal = getSafeValue('cashFlowInput1');
        else cashFlowVal = getSafeValue('cashFlowInput');
        
        highlightActivePills(fSum, fPrem, cashFlowVal);
        lastCalculationData = { premium: fPrem, sum: fSum, gender: currentGender==='male'?'ชาย':'หญิง', age: age, years: yearsStr, cashFlow: cashFlowVal }; 
        
        if (typeof refreshAllDisplays === 'function') refreshAllDisplays(); 
        
        return lastCalculationData; 
    } catch (err) { console.error("[Calculate Error]: ", err); return null; }
}
