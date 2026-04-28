// ==================== app.js ====================
const setText = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };
const formatNum = (num) => { const rounded = Math.round(num * 100) / 100; return Number.isInteger(rounded) ? rounded.toLocaleString() : rounded.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}); };

let currentPlan = '20CX', currentGender = 'male', lastCalculationData = null, currentMode = 'sum';
let currentPlanOptions = ['10CX', '20CX'];
let cvDataLookup = {};
let currentAppPlan = "CI Extra Plus";

function openPopup(id) { const modal = document.getElementById(id); if (modal) { modal.classList.remove('hidden'); setTimeout(() => { modal.classList.add('show'); }, 10); } }
function closePopup(id) { const modal = document.getElementById(id); if (modal) { modal.classList.remove('show'); setTimeout(() => { modal.classList.add('hidden'); }, 300); } }
function handleModalClick(e, modalId) { if (e.target.closest('button, input, select, textarea, a, .list-row, .interactive-btn')) return; closePopup(modalId); }
function showCustomError(msg) { const toast = document.createElement('div'); toast.className = "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600/95 text-white px-8 py-5 rounded-2xl text-sm font-bold z-[1000] shadow-2xl text-center backdrop-blur-sm transition-all"; toast.innerHTML = `<i class='fas fa-exclamation-triangle mb-3 block text-3xl text-red-200'></i><span class="whitespace-nowrap">${msg}</span>`; document.body.appendChild(toast); setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 1500); }

function adjustAge(delta) { const input = document.getElementById('ageInput'); let val = parseInt(input.value) + delta; if (val >= 0 && val <= 65) { input.value = val; calculate(currentMode); } }

function setGender(gender) { 
    currentGender = gender; 
    const btnM = document.getElementById('btnMale');
    const btnF = document.getElementById('btnFemale');
    if(gender === 'male') {
        btnM.className = 'flex-1 rounded-[14px] text-[15px] font-bold active-male text-white transition-all';
        btnF.className = 'flex-1 rounded-[14px] text-[15px] font-bold text-slate-500 hover:bg-slate-50 transition-all';
    } else {
        btnM.className = 'flex-1 rounded-[14px] text-[15px] font-bold text-slate-500 hover:bg-slate-50 transition-all';
        btnF.className = 'flex-1 rounded-[14px] text-[15px] font-bold active-female text-white transition-all';
    }
    calculate(currentMode); 
}

function handlePremiumInput(el) { let v = el.value.replace(/,/g, '').split('.')[0]; if (!isNaN(v) && v !== '') { el.value = Number(v).toLocaleString(); calculate('premium'); } }
function handleSumInput(el) { let v = el.value.replace(/,/g, '').split('.')[0]; if (!isNaN(v) && v !== '') { el.value = Number(v).toLocaleString(); calculate('sum'); } }
function setQuickSum(val) { document.getElementById('sumInsuredInput').value = val.toLocaleString(); calculate('sum'); }
function setQuickPremium(val) { document.getElementById('premiumInput').value = val.toLocaleString(); calculate('premium'); }
function handleCashFlowInput(el) { let v = el.value.replace(/,/g, '').split('.')[0]; if (!isNaN(v) && v !== '') { el.value = Number(v).toLocaleString(); calculate(currentMode); } }
function setQuickCashFlow(val) { const el = document.getElementById('cashFlowInput'); if(el) { el.value = val.toLocaleString(); calculate(currentMode); } }

function updatePlanOptionsForApp(appPlanName) {
    if (appPlanName === 'CI Extra Plus') { currentPlanOptions = ['10CX', '20CX']; } 
    else if (appPlanName === 'Century Life + TPD') { currentPlanOptions = ['60', '90']; } 
    else if (appPlanName === 'Whole Life Extra') { currentPlanOptions = ['WXN10', 'WXN15']; } 
    else if (appPlanName === 'Signature Legacy') { currentPlanOptions = ['5SLB', '10SLB']; } 
    else { currentPlanOptions = [getPlanAbbr(appPlanName)]; }
    
    if (!currentPlanOptions.includes(currentPlan)) { currentPlan = currentPlanOptions[0] || ''; }
}

function setPlan(plan) { 
    currentPlan = plan; 
    const btns = [document.getElementById('btnPlan1'), document.getElementById('btnPlan2'), document.getElementById('btnPlan3'), document.getElementById('btnPlan4')];
    btns.forEach((btn, idx) => {
        if (!btn) return;
        if (idx < currentPlanOptions.length) {
            btn.innerText = currentPlanOptions[idx];
            btn.classList.remove('hidden');
            btn.onclick = () => setPlan(currentPlanOptions[idx]);
            const isTarget = plan === currentPlanOptions[idx];
            btn.className = isTarget ? 'flex-1 rounded-[14px] text-[14px] font-bold active-blue text-white transition-all' : 'flex-1 rounded-[14px] text-[14px] font-bold text-slate-500 hover:bg-slate-50 transition-all';
        } else {
            btn.classList.add('hidden');
        }
    });
    calculate(currentMode); 
}

function setHXPlan(hxPlan, displayText) { currentPlan = hxPlan; const btn1 = document.getElementById('btnPlan1'); if (btn1) { btn1.innerHTML = `${displayText} <i class="fas fa-chevron-down text-[10px] ml-1"></i>`; } closePopup('hxPlanModal'); calculate(currentMode); }
function setExtraPlan(val) { currentExtra = val; const btn = document.getElementById('btnExtra'); if (btn) btn.innerHTML = `${val !== '-' ? val : 'ไม่เลือก'} <i class="fas fa-chevron-down text-[10px] ml-1 opacity-70"></i>`; closePopup('extraPlanModal'); }
function setAdvancePlan(val) { currentAdvance = val; const btn = document.getElementById('btnAdvance'); if (btn) btn.innerHTML = `${val !== '-' ? val : 'ไม่เลือก'} <i class="fas fa-chevron-down text-[10px] ml-1 opacity-70"></i>`; closePopup('advancePlanModal'); }

function getDiscount(sum, plan) { 
    if (plan === '10CX') { if (sum >= 5000000) return 3.0; if (sum >= 1000000) return 2.0; } 
    else { if (sum >= 5000000) return 1.5; if (sum >= 1000000) return 1.0; if (sum >= 800000) return 0.5; } 
    return 0; 
}

function calculate(source) { 
    currentMode = source;
    const age = parseInt(document.getElementById('ageInput').value) || 0; 
    const totalRate = (LIFE_RATES[currentPlan]?.[currentGender]?.[age] || 0) + (CI_RATES[currentPlan]?.[currentGender]?.[age] || 0); 
    
    let fSum = 0, fPrem = 0; 
    
    if (totalRate <= 0) {
        fSum = parseFloat(document.getElementById('sumInsuredInput').value.replace(/,/g, '')) || 0; 
        fPrem = parseFloat(document.getElementById('premiumInput').value.replace(/,/g, '')) || 0; 
    } else {
        if (source === 'sum') { 
            fSum = parseFloat(document.getElementById('sumInsuredInput').value.replace(/,/g, '')) || 0; 
            if (age >= 0 && age <= 15 && fSum > 3000000) { showCustomError("อายุ 0-15 ปี ทำทุนประกันสูงสุดได้ 3 ล้านบาท"); return null; } 
            if (age >= 16 && fSum > 10000000) { showCustomError("อายุ 16 ปีขึ้นไป ทำทุนประกันสูงสุดได้ 10 ล้านบาท"); return null; }
            fPrem = Math.round((fSum / 1000) * (totalRate - getDiscount(fSum, currentPlan))); 
            document.getElementById('premiumInput').value = fPrem.toLocaleString(); 
        } else { 
            fPrem = parseFloat(document.getElementById('premiumInput').value.replace(/,/g, '')) || 50000; 
            for (let d_val of (currentPlan === '10CX' ? [3, 2, 0] : [1.5, 1, 0.5, 0])) { 
                let s = (fPrem * 1000) / (totalRate - d_val); 
                if (getDiscount(s + 1, currentPlan) === d_val) { fSum = s; break; } 
            } 
            if (fSum === 0) fSum = (fPrem * 1000) / totalRate; 
            if (age >= 0 && age <= 15 && fSum > 3000000) { showCustomError("เบี้ยที่ระบุทำให้ทุนประกันเกิน 3 ล้านบาท สำหรับเด็ก"); return null; } 
            if (age >= 16 && fSum > 10000000) { showCustomError("อายุ 16-65 ปี ทำทุนประกันสูงสุดได้ 10 ล้านบาท"); return null; }
            document.getElementById('sumInsuredInput').value = formatNum(fSum); 
        } 
    }
    
    const cashFlowInput = document.getElementById('cashFlowInput');
    const cashFlowVal = parseFloat(cashFlowInput ? cashFlowInput.value.replace(/,/g, '') : 0) || 0;
    
    let yearsStr = '20'; const matchYears = currentPlan.match(/\d+/); if (matchYears) yearsStr = matchYears[0];
    
    lastCalculationData = { premium: fPrem, sum: fSum, gender: currentGender==='male'?'ชาย':'หญิง', age: age, years: yearsStr, cashFlow: cashFlowVal }; 
    if (totalRate > 0) refreshAllDisplays(); 
    return lastCalculationData; 
}

function manualTriggerPopup() { const calcData = calculate('sum'); if (calcData) openModal(calcData); }

function openModal(d) { 
    if(!d) return; 
    setText('modalGender', d.gender); setText('modalAge', d.age + " ปี"); setText('modalYears', d.years + " ปี"); 
    setText('modalPremium', Math.round(d.premium).toLocaleString()); setText('modalSum', formatNum(d.sum)); 
    
    const childRow = document.getElementById('modalChildRow'); 
    if (d.age >= 0 && d.age <= 15) { childRow.classList.remove('hidden'); childRow.classList.add('flex'); setText('modalChildCI', formatNum(d.sum)); } 
    else { childRow.classList.add('hidden'); childRow.classList.remove('flex'); } 
    
    setText('modalExtraCI', formatNum(d.sum * 0.25)); setText('modalMajorCI', formatNum(d.sum * 0.75)); 
    setText('modalMedExtra1Popup', formatNum(d.sum * 0.10)); setText('modalMaturity', formatNum(d.sum * 1.05));
    setText('modalMaturityExtraPopup', formatNum(d.sum * 0.05));
    openPopup('resultModal'); 
}

function switchView(targetView) {
    const views = { 'main': document.getElementById('mainView'), 'table': document.getElementById('tableView'), 'cash': document.getElementById('cashView'), 'ai': document.getElementById('aiView') };
    const navBtns = { 'main': document.getElementById('navMainBtn'), 'table': document.getElementById('navTableBtn'), 'cash': document.getElementById('navCashBtn'), 'ai': document.getElementById('navAiBtn') };

    if ((targetView === 'table' || targetView === 'cash' || targetView === 'ai') && !lastCalculationData) { showCustomError("กรุณาคำนวณก่อนใช้งานเมนูนี้"); return; }

    if (targetView === 'table') generatePolicyTableData();
    if (targetView === 'cash') refreshAllDisplays();
    if (targetView === 'ai') generateAIAnalysis();

    Object.values(views).forEach(view => { if (view) view.classList.add('hidden'); });
    Object.values(navBtns).forEach(btn => { if (btn) btn.classList.remove('active'); });

    if (views[targetView]) views[targetView].classList.remove('hidden');
    if (navBtns[targetView]) navBtns[targetView].classList.add('active');
    
    const bottomNav = document.getElementById('bottomNavContainer');
    if (bottomNav) { bottomNav.style.transform = 'translateY(0)'; bottomNav.style.opacity = '1'; }
}

function getPlanAbbr(planName) {
    const abbrMap = { "CI Extra Plus": "CX", "Life Protector 20": "LPB", "Supreme Life Protector": "SLPA", "Signature Legacy": "SLB", "Convertable Term": "TLA", "Century Life + TPD": "CLA", "3D Health Excellence": "3D", "Whole Life Extra": "WXN", "24 TX": "TX", "868 / 818 Elite Saving": "Elite" };
    return abbrMap[planName] || planName;
}

function openPlanModal() {
    const searchInput = document.getElementById('unifiedPlanSearchInput');
    if (searchInput) searchInput.value = '';
    renderUnifiedPlanList(allInsurancePlans);
    openPopup('planSelectModal');
}

function renderUnifiedPlanList(plans) {
    const container = document.getElementById('unifiedPlanList');
    if (!container) return;
    if (plans.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-slate-400 flex flex-col items-center justify-center h-full"><div class="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-100"><i class="fas fa-search text-xl text-slate-300"></i></div><span class="font-medium text-[14px]">ไม่พบแบบประกัน</span></div>`;
        return;
    }
    container.innerHTML = plans.map(p => {
        const isActive = p.name === currentAppPlan;
        const cardClass = isActive ? 'border-blue-400 bg-blue-50/50 ring-2 ring-blue-500/10' : 'border-transparent bg-white hover:border-blue-200 hover:bg-slate-50 shadow-sm';
        const textClass = isActive ? 'text-blue-900' : 'text-slate-800';
        return `
        <button onclick="selectAppPlan('${p.name}')" class="w-full relative flex items-center text-left p-3.5 rounded-[20px] border ${cardClass} transition-all duration-200 active:scale-[0.98] group">
            <div class="w-12 h-12 rounded-[14px] ${p.bg} ${p.color} flex items-center justify-center text-[20px] shrink-0 mr-4 shadow-inner border border-white/50 group-hover:scale-105 transition-transform duration-300"><i class="${p.icon}"></i></div>
            <div class="flex-1 pr-8"><h4 class="text-[15px] font-bold ${textClass} leading-tight mb-0.5">${p.name}</h4><p class="text-[11px] text-slate-500 font-medium leading-tight">${p.desc}</p></div>
            ${isActive ? `<div class="absolute right-4 text-blue-500 text-xl"><i class="fas fa-check-circle"></i></div>` : ''}
        </button>`;
    }).join('');
}

function handleUnifiedPlanSearch() {
    const query = document.getElementById('unifiedPlanSearchInput').value.toLowerCase();
    const filtered = allInsurancePlans.filter(p => p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query));
    renderUnifiedPlanList(filtered);
}

function updateQuickPills(planName) {
    const highValuePlans = ["Whole Life Extra", "868 / 818 Elite Saving", "24 TX", "Supreme Life Protector", "Life Protector 20"];
    const btnSum1 = document.getElementById('sumPill1'); const btnSum2 = document.getElementById('sumPill2'); const btnSum3 = document.getElementById('sumPill3'); const btnSum4 = document.getElementById('sumPill4'); const btnSum5 = document.getElementById('sumPill5');
    const btnPrem1 = document.getElementById('premPill1'); const btnPrem2 = document.getElementById('premPill2'); const btnPrem3 = document.getElementById('premPill3'); const btnPrem4 = document.getElementById('premPill4'); const btnPrem5 = document.getElementById('premPill5');

    if (!btnSum1 || !btnPrem1) return;
    [btnPrem1, btnPrem2, btnPrem3, btnPrem4, btnPrem5].forEach(btn => btn.classList.remove('disabled-pill'));

    if (planName === 'Signature Legacy' || planName === 'Convertable Term') {
        if (planName === 'Signature Legacy') {
            btnSum1.innerText = '5 ล้าน'; btnSum1.setAttribute('onclick', 'setQuickSum(5000000)'); btnSum2.innerText = '10 ล้าน'; btnSum2.setAttribute('onclick', 'setQuickSum(10000000)'); btnSum3.innerText = '50 ล้าน'; btnSum3.setAttribute('onclick', 'setQuickSum(50000000)'); btnSum4.innerText = '100 ล้าน'; btnSum4.setAttribute('onclick', 'setQuickSum(100000000)'); btnSum5.innerText = '500 ล้าน'; btnSum5.setAttribute('onclick', 'setQuickSum(500000000)');
        } else {
            btnSum1.innerText = '1 แสน'; btnSum1.setAttribute('onclick', 'setQuickSum(100000)'); btnSum2.innerText = '5 แสน'; btnSum2.setAttribute('onclick', 'setQuickSum(500000)'); btnSum3.innerText = '1 ล้าน'; btnSum3.setAttribute('onclick', 'setQuickSum(1000000)'); btnSum4.innerText = '3 ล้าน'; btnSum4.setAttribute('onclick', 'setQuickSum(3000000)'); btnSum5.innerText = '5 ล้าน'; btnSum5.setAttribute('onclick', 'setQuickSum(5000000)');
        }
    } else if (highValuePlans.includes(planName)) {
        btnSum1.innerText = '5 แสน'; btnSum1.setAttribute('onclick', 'setQuickSum(500000)'); btnSum2.innerText = '1 ล้าน'; btnSum2.setAttribute('onclick', 'setQuickSum(1000000)'); btnSum3.innerText = '3 ล้าน'; btnSum3.setAttribute('onclick', 'setQuickSum(3000000)'); btnSum4.innerText = '5 ล้าน'; btnSum4.setAttribute('onclick', 'setQuickSum(5000000)'); btnSum5.innerText = '10 ล้าน'; btnSum5.setAttribute('onclick', 'setQuickSum(10000000)');
        btnPrem1.innerText = '1 แสน'; btnPrem1.setAttribute('onclick', 'setQuickPremium(100000)'); btnPrem2.innerText = '2 แสน'; btnPrem2.setAttribute('onclick', 'setQuickPremium(200000)'); btnPrem3.innerText = '4 แสน'; btnPrem3.setAttribute('onclick', 'setQuickPremium(400000)'); btnPrem4.innerText = '6 แสน'; btnPrem4.setAttribute('onclick', 'setQuickPremium(600000)'); btnPrem5.innerText = '1 ล้าน'; btnPrem5.setAttribute('onclick', 'setQuickPremium(1000000)');
    } else {
        btnSum1.innerText = '1 แสน'; btnSum1.setAttribute('onclick', 'setQuickSum(100000)'); btnSum2.innerText = '5 แสน'; btnSum2.setAttribute('onclick', 'setQuickSum(500000)'); btnSum3.innerText = '1 ล้าน'; btnSum3.setAttribute('onclick', 'setQuickSum(1000000)'); btnSum4.innerText = '3 ล้าน'; btnSum4.setAttribute('onclick', 'setQuickSum(3000000)'); btnSum5.innerText = '5 ล้าน'; btnSum5.setAttribute('onclick', 'setQuickSum(5000000)');
        btnPrem1.innerText = '12,000'; btnPrem1.setAttribute('onclick', 'setQuickPremium(12000)'); btnPrem2.innerText = '24,000'; btnPrem2.setAttribute('onclick', 'setQuickPremium(24000)'); btnPrem3.innerText = '36,000'; btnPrem3.setAttribute('onclick', 'setQuickPremium(36000)'); btnPrem4.innerText = '48,000'; btnPrem4.setAttribute('onclick', 'setQuickPremium(48000)'); btnPrem5.innerText = '60,000'; btnPrem5.setAttribute('onclick', 'setQuickPremium(60000)');
    }
}

function selectAppPlan(planName) {
    closePopup('planSelectModal'); currentAppPlan = planName; document.getElementById('headerTitleText').innerText = planName;
    const planInfo = allInsurancePlans.find(p => p.name === planName);
    if (planInfo && document.getElementById('headerDescText')) document.getElementById('headerDescText').innerText = planInfo.desc;
    
    const pLabel = document.getElementById('premiumLabel'); const pPills = document.getElementById('premiumPillContainer');
    const mainActionBtn = document.getElementById('mainActionBtn'); const cashFlowContainer = document.getElementById('cashFlowContainer');
    const sumInsuredContainer = document.getElementById('sumInsuredContainer'); const extraOptions = document.getElementById('threeDExtraOptions');
    const planSelectionWrapper = document.getElementById('planSelectionWrapper');
    const premiumContainer = document.getElementById('premiumContainer');

    if(pLabel) pLabel.innerText = "ออมเงิน (บาท/ปี)"; if(pPills) pPills.classList.remove('hidden');
    if(cashFlowContainer) cashFlowContainer.classList.add('hidden'); if(sumInsuredContainer) sumInsuredContainer.classList.remove('hidden');
    if(extraOptions) { extraOptions.classList.remove('grid'); extraOptions.classList.add('hidden'); }
    if(premiumContainer) premiumContainer.classList.remove('hidden'); if(planSelectionWrapper) planSelectionWrapper.classList.remove('hidden');

    const targetPlans = ["Life Protector 20", "Supreme Life Protector", "Whole Life Extra", "24 TX", "868 / 818 Elite Saving"];
    if (targetPlans.includes(planName)) {
        mainActionBtn.innerHTML = `<i class="fas fa-table text-xl"></i> ดูรายละเอียด`; mainActionBtn.onclick = function() { switchView('table'); };
        if (["Whole Life Extra", "24 TX", "868 / 818 Elite Saving"].includes(planName)) { if(cashFlowContainer) cashFlowContainer.classList.remove('hidden'); if(sumInsuredContainer) sumInsuredContainer.classList.add('hidden'); }
    } else if (planName === 'CI Extra Plus' || planName === 'Century Life + TPD') {
        mainActionBtn.innerHTML = `<i class="fas fa-file-alt text-xl"></i> ดูรายละเอียด`; mainActionBtn.onclick = function() { manualTriggerPopup(); };
    } else {
        mainActionBtn.innerHTML = `<i class="fas fa-file-alt text-xl"></i> ดูรายละเอียด`; mainActionBtn.onclick = function() { showCustomError(`กำลังพัฒนาระบบสำหรับ : ${planName}`); };
    }

    if (planName === 'Signature Legacy' || planName === 'Convertable Term') {
        if(pLabel) pLabel.innerText = "เบี้ยประกัน (บาท)"; if(pPills) pPills.classList.add('hidden'); if(planSelectionWrapper) planSelectionWrapper.classList.add('hidden');
    }
    
    if (planName === '3D Health Excellence') {
        if(extraOptions) { extraOptions.classList.remove('hidden'); extraOptions.classList.add('grid'); }
        if(sumInsuredContainer) sumInsuredContainer.classList.add('hidden'); 
        if(premiumContainer) premiumContainer.classList.add('hidden');
        if(planSelectionWrapper) planSelectionWrapper.classList.add('hidden');
    }
    
    updateQuickPills(planName);
    
    if (planName !== '3D Health Excellence') { 
        updatePlanOptionsForApp(planName);
        setPlan(currentPlan); 
    } else { 
        calculate(currentMode); 
    }
}

// ==================== CASH MODULE ====================
function updateMBDisplay() { 
    const effectivePlan = COM_RATES[currentPlan] ? currentPlan : currentAppPlan; if (!lastCalculationData || !COM_RATES[effectivePlan]) return; 
    const fycFromCase = Math.round(lastCalculationData.premium * COM_RATES[effectivePlan][0]); const existingFYC = parseFloat(document.getElementById('existingFYCInput')?.value.replace(/,/g, '')) || 0; const totalFYC = fycFromCase + existingFYC; 
    const tiers = [{min:8000, max: 16000, rate:0.20, id:"mb-tier1"}, {min:16001, max: 32000, rate:0.25, id:"mb-tier2"}, {min:32001, max: 64000, rate:0.30, id:"mb-tier3"}, {min:64001, max: Infinity, rate:0.35, id:"mb-tier4"}]; 
    let curIdx = -1; tiers.forEach((t, i) => { if (totalFYC >= t.min) curIdx = i; }); 
    const currentRate = curIdx >= 0 ? tiers[curIdx].rate : 0; const totalBonus = Math.round(totalFYC * currentRate); const caseBonus = Math.round(fycFromCase * currentRate); window.currentMBBonus = caseBonus; 
    
    let tierHtml = '';
    tiers.forEach((t, i) => {
        const isActive = (curIdx === i);
        const activeClass = isActive ? 'border-[#10b981] bg-[#ecfdf5] ring-1 ring-[#10b981]' : 'border-slate-100 bg-white';
        const pctClass = isActive ? 'bg-[#10b981]/20 text-[#047857]' : 'text-slate-800';
        tierHtml += `<div class="flex justify-between items-center p-3 rounded-[16px] border ${activeClass} mb-2 shadow-sm transition-all"><span class="text-[14px] font-bold ${isActive ? 'text-[#065f46]' : 'text-slate-600'}">${t.min.toLocaleString()} - ${t.max === Infinity ? 'ขึ้นไป' : t.max.toLocaleString()}</span><span class="text-[14px] font-black px-4 py-1.5 rounded-xl ${pctClass}">${(t.rate * 100)}%</span></div>`;
    });
    const mbTierList = document.getElementById('mbTierList'); if(mbTierList) mbTierList.innerHTML = tierHtml;
    
    setText('caseIncomeBonusCalc', `(${fycFromCase.toLocaleString()} x ${currentRate * 100}%)`); setText('mbCaseFYCDisplay', fycFromCase.toLocaleString()); setText('mbExistingFYCDisplay', existingFYC.toLocaleString()); setText('mbTotalFYCDisplay', totalFYC.toLocaleString()); setText('mbBonusCalcMethod', `(${totalFYC.toLocaleString()} x ${currentRate * 100}%)`); setText('mbCalculatedBonus', totalBonus.toLocaleString() + " บาท"); 
    const adviceBox = document.getElementById('mbAdviceText'); 
    if (adviceBox) { if (curIdx < 3) { const next = tiers[curIdx + 1]; adviceBox.innerHTML = `<strong>เพิ่มอีก <span class="whitespace-nowrap">${(Math.max(0, next.min - totalFYC)).toLocaleString()} บาท</span></strong><br><span>เพื่อรับโบนัสระดับถัดไป ${(next.rate * 100)}%</span>`; } else { adviceBox.innerHTML = `<strong>ยินดีด้วย!</strong> คุณได้รับโบนัสระดับสูงสุด 35% แล้ว`; } } 
}

function handleMBInput(el) { let v = el.value.replace(/,/g, '').split('.')[0]; if (!isNaN(v) && v !== '') el.value = Number(v).toLocaleString(); refreshAllDisplays(); }

function updateMYBDisplay() { 
    const effectivePlan = COM_RATES[currentPlan] ? currentPlan : currentAppPlan; if (!lastCalculationData || !COM_RATES[effectivePlan]) return; 
    const fycFromCase = Math.round(lastCalculationData.premium * COM_RATES[effectivePlan][0]); const existingMBFYC = parseFloat(document.getElementById('existingFYCInput')?.value.replace(/,/g, '')) || 0; const existingHalfYearFYC = parseFloat(document.getElementById('existingHalfYearFYCInput')?.value.replace(/,/g, '')) || 0; 
    const totalFYC = fycFromCase + existingMBFYC + existingHalfYearFYC; 
    const tiers = [{min:40000, max: 60000, rate:0.175, id:"myb-tier1"}, {min:60001, max: 100000, rate:0.20, id:"myb-tier2"}, {min:100001, max: 150000, rate:0.225, id:"myb-tier3"}, {min:150001, max: 200000, rate:0.25, id:"myb-tier4"}, {min:200001, max: 250000, rate:0.275, id:"myb-tier5"}, {min:250001, max: 300000, rate:0.30, id:"myb-tier6"}, {min:300001, max: 400000, rate:0.325, id:"myb-tier7"}, {min:400001, max: Infinity, rate:0.35, id:"myb-tier8"}]; 
    let curIdx = -1; tiers.forEach((t, i) => { if (totalFYC >= t.min) curIdx = i; }); 
    const currentRate = curIdx >= 0 ? tiers[curIdx].rate : 0; const totalBonus = Math.round(totalFYC * currentRate); const caseBonus = Math.round(fycFromCase * currentRate); window.currentMYBBonus = caseBonus; 
    
    let tierHtml = '';
    tiers.forEach((t, i) => {
        const isActive = (curIdx === i);
        const activeClass = isActive ? 'border-[#8b5cf6] bg-[#f5f3ff] ring-1 ring-[#8b5cf6]' : 'border-slate-100 bg-white';
        const pctClass = isActive ? 'bg-[#8b5cf6]/20 text-[#6d28d9]' : 'text-slate-800';
        tierHtml += `<div class="flex justify-between items-center p-3 rounded-[16px] border ${activeClass} mb-2 shadow-sm transition-all"><span class="text-[14px] font-bold ${isActive ? 'text-[#5b21b6]' : 'text-slate-600'}">${t.min.toLocaleString()} - ${t.max === Infinity ? 'ขึ้นไป' : t.max.toLocaleString()}</span><span class="text-[14px] font-black px-4 py-1.5 rounded-xl ${pctClass}">${(t.rate * 100)}%</span></div>`;
    });
    const mybTierList = document.getElementById('mybTierList'); if(mybTierList) mybTierList.innerHTML = tierHtml;

    setText('caseIncomeMYBonusCalc', `(${fycFromCase.toLocaleString()} x ${Number((currentRate * 100).toFixed(1))}%)`); setText('mybCaseFYCDisplay', fycFromCase.toLocaleString()); setText('mybMBFYCDisplay', (existingMBFYC + existingHalfYearFYC).toLocaleString()); setText('mybTotalFYCDisplay', totalFYC.toLocaleString()); setText('mybBonusCalcMethod', `(${totalFYC.toLocaleString()} x ${Number((currentRate * 100).toFixed(1))}%)`); setText('mybCalculatedBonus', totalBonus.toLocaleString() + " บาท"); 
    const adviceBox = document.getElementById('mybAdviceText'); 
    if (adviceBox) { if (curIdx < 7) { const next = tiers[curIdx + 1]; adviceBox.innerHTML = `<strong>เพิ่มอีก <span class="whitespace-nowrap">${(Math.max(0, next.min - totalFYC)).toLocaleString()} บาท</span></strong><br><span>เพื่อรับโบนัสระดับถัดไป ${(next.rate * 100).toFixed(1)}%</span>`; } else { adviceBox.innerHTML = `<strong>ยินดีด้วย!</strong> คุณได้รับโบนัสครึ่งปีสูงสุด 35% แล้ว`; } } 
}

function handleMYBInput(el) { let v = el.value.replace(/,/g, '').split('.')[0]; if (!isNaN(v) && v !== '') el.value = Number(v).toLocaleString(); refreshAllDisplays(); }

function updateNABDisplay() { 
    const effectivePlan = COM_RATES[currentPlan] ? currentPlan : currentAppPlan; if (!lastCalculationData || !COM_RATES[effectivePlan]) return; 
    const fycFromCase = Math.round(lastCalculationData.premium * COM_RATES[effectivePlan][0]); const existingMBFYC = parseFloat(document.getElementById('existingFYCInput')?.value.replace(/,/g, '')) || 0; const existingMYBFYC = parseFloat(document.getElementById('existingHalfYearFYCInput')?.value.replace(/,/g, '')) || 0; const existingCases = parseInt(document.getElementById('existingNABCases')?.value) || 0; const phase = document.getElementById('nabPhaseSelect')?.value || 'p1'; 
    const totalMBMYBFYC = existingMBFYC + existingMYBFYC; const totalFYC = fycFromCase + totalMBMYBFYC; const totalCases = 1 + existingCases; 
    let tiers = phase === 'p1' ? [{ minFYC: 20000, minCases: 3, bonus: 6000, label: "≥ 20,000 และ 3 ราย" },{ minFYC: 50000, minCases: 5, bonus: 15000, label: "≥ 50,000 และ 5 ราย" }] : [{ minFYC: 40000, minCases: 5, bonus: 10000, label: "≥ 40,000 และ 5 ราย" },{ minFYC: 100000, minCases: 10, bonus: 25000, label: "≥ 100,000 และ 10 ราย" }]; 
    let nabBonus = 0; let currentTierIdx = -1; tiers.forEach((t, i) => { if (totalFYC >= t.minFYC && totalCases >= t.minCases) { nabBonus = t.bonus; currentTierIdx = i; } }); 
    
    let tierHtml = '';
    tiers.forEach((t, i) => {
        const isActive = (currentTierIdx === i);
        const activeClass = isActive ? 'border-[#06b6d4] bg-[#ecfeff] ring-1 ring-[#06b6d4]' : 'border-slate-100 bg-white';
        const fycPassed = totalFYC >= t.minFYC; const casesPassed = totalCases >= t.minCases;
        const fycIcon = fycPassed ? '<i class="fas fa-check-circle text-[#10b981]"></i>' : '<i class="far fa-circle text-slate-300"></i>';
        const casesIcon = casesPassed ? '<i class="fas fa-check-circle text-[#10b981]"></i>' : '<i class="far fa-circle text-slate-300"></i>';
        tierHtml += `<div class="flex justify-between items-center p-4 rounded-[20px] border ${activeClass} mb-3 shadow-sm transition-all"><div class="flex flex-col gap-1.5"><span class="text-[14px] font-bold text-slate-800">${t.label}</span><div class="text-[11px] text-slate-500 flex flex-col gap-1 mt-1"><span class="flex items-center gap-1.5">${fycIcon} FYC: ${totalFYC.toLocaleString()} / ${t.minFYC.toLocaleString()}</span><span class="flex items-center gap-1.5">${casesIcon} ราย: ${totalCases} / ${t.minCases}</span></div></div><span class="text-[18px] font-black text-slate-800">${t.bonus.toLocaleString()}</span></div>`;
    });
    const nabTierList = document.getElementById('nabTierList'); if(nabTierList) nabTierList.innerHTML = tierHtml;

    window.currentNABBonus = nabBonus; 
    setText('nabCaseFYCDisplay', fycFromCase.toLocaleString()); setText('nabMBMYBFYCDisplay', totalMBMYBFYC.toLocaleString()); setText('nabTotalFYCDisplay', totalFYC.toLocaleString()); setText('nabCalculatedBonus', nabBonus.toLocaleString() + " บาท"); 
    const adviceBox = document.getElementById('nabAdviceText'); 
    if (adviceBox) { if (currentTierIdx < tiers.length - 1) { const nextTier = tiers[currentTierIdx + 1]; const fycNeed = Math.max(0, nextTier.minFYC - totalFYC); const casesNeed = Math.max(0, nextTier.minCases - totalCases); let adviceText = "<strong>เพิ่มอีก "; if (fycNeed > 0) adviceText += `<span class="whitespace-nowrap">${fycNeed.toLocaleString()} FYC</span> `; if (fycNeed > 0 && casesNeed > 0) adviceText += "และ "; if (casesNeed > 0) adviceText += `<span class="whitespace-nowrap">${casesNeed} ราย</span>`; adviceText += `</strong><br><span>เพื่อรับโบนัส <span class="whitespace-nowrap">${nextTier.bonus.toLocaleString()} บาท</span></span>`; adviceBox.innerHTML = adviceText; } else { adviceBox.innerHTML = `<strong>ยินดีด้วย!</strong> คุณได้รับโบนัสสูงสุด <span class="whitespace-nowrap">${nabBonus.toLocaleString()} บาท</span> แล้ว`; } } 
}

function refreshAllDisplays() { 
    if (!lastCalculationData) return; 
    const p = lastCalculationData.premium; 
    setText('sumMonthlyPopup', Math.round(p * 0.09).toLocaleString()); setText('sum3MonthPopup', Math.round(p * 0.27).toLocaleString()); setText('sum6MonthPopup', Math.round(p * 0.52).toLocaleString()); 

    if(COM_RATES[currentPlan] || COM_RATES[currentAppPlan]) {
        const effectivePlan = COM_RATES[currentPlan] ? currentPlan : currentAppPlan; const fyc = Math.round(p * COM_RATES[effectivePlan][0]); setText('caseIncomeComm', fyc.toLocaleString() + " บาท"); 
        let comH = `<h4 class="text-sm font-black text-[#0f172a] mb-4 tracking-wide text-center">ประมาณการคอมมิชชันรายปี</h4>`; let totalComAmt = 0; 
        COM_RATES[effectivePlan].forEach((r, i) => { const annualAmt = Math.round(p * r); totalComAmt += annualAmt; comH += `<div class="com-item-row"><span class="com-percent-label font-bold text-[#b45309]" style="margin-left: 0; margin-right: 12px; flex: none; width: 45px; text-align: left;">${(r*100).toFixed(1)}%</span><span class="com-year-pill">ปีที่ ${i+1}</span><span class="com-amount-value font-black text-[#0f172a] text-right" style="flex: 1;">${annualAmt.toLocaleString()}</span></div>`; }); 
        const totalPercent = p > 0 ? ((totalComAmt / p) * 100).toFixed(1) : 0; 
        comH += `<div class="mt-5 pt-4 border-t-2 border-amber-100 flex justify-between items-center"><div class="text-left"><div class="text-xl font-black text-amber-500">${totalPercent}%</div><div class="text-[9px] font-bold text-slate-400 uppercase">Percent รวม</div></div><div class="text-right"><div class="text-[11px] font-bold text-slate-400">คอมมิชชันรวมตลอดสัญญา</div><div class="text-xl font-black text-amber-600 whitespace-nowrap">${totalComAmt.toLocaleString()} บาท</div></div></div>`; 
        const comListEl = document.getElementById('comList'); if(comListEl) comListEl.innerHTML = comH; 
        
        updateMBDisplay(); updateMYBDisplay(); updateNABDisplay(); 
        
        setText('caseIncomeBonus', (window.currentMBBonus || 0).toLocaleString() + " บาท"); setText('caseIncomeMYBonus', (window.currentMYBBonus || 0).toLocaleString() + " บาท");
        const caseTotal = Math.round(fyc + (window.currentMBBonus || 0) + (window.currentMYBBonus || 0)); 
        setText('caseIncomeTotal', caseTotal.toLocaleString() + " บาท"); setText('caseIncomePercent', p > 0 ? "(" + ((caseTotal / p) * 100).toFixed(1) + "%)" : "(0%)"); 
    }
}

// ==================== TABLE & PDF MODULE ====================
function generatePolicyTableData() {
    if (!lastCalculationData) return;
    const d = lastCalculationData;
    const showCashFlow = ["Whole Life Extra", "24 TX", "868 / 818 Elite Saving"].includes(currentAppPlan);
    let sumDisplay = '';
    if (d.sum >= 1000000 && d.sum % 1000000 === 0) sumDisplay = (d.sum / 1000000) + ' ล้านบาท';
    else if (d.sum >= 100000 && d.sum % 100000 === 0 && d.sum < 1000000) sumDisplay = (d.sum / 100000) + ' แสนบาท';
    else sumDisplay = formatNum(d.sum) + ' บาท';
    
    document.getElementById('tableHeaderTitle').innerHTML = `<span class="truncate">${getPlanAbbr(currentAppPlan)} ${d.gender} ${d.age} ทุน ${sumDisplay}</span>`;
    document.getElementById('policyTableHead').innerHTML = `<tr class="text-slate-500 shadow-sm text-[10px] min-[380px]:text-[11px] sm:text-[12px]"><th class="py-3 px-1 font-bold bg-[#f8fafc] border-b border-slate-200 ${showCashFlow ? 'w-[10%]' : 'w-[15%]'}">อายุ</th><th class="py-3 px-1 font-bold bg-[#f8fafc] border-b border-slate-200 ${showCashFlow ? 'w-[20%]' : 'w-[28%]'}">ออมเงิน</th><th class="py-3 px-1 font-bold bg-[#f8fafc] text-blue-600 border-b border-slate-200 ${showCashFlow ? 'w-[22%]' : 'w-[28%]'}">ออมสะสม</th>${showCashFlow ? `<th class="py-3 px-1 font-bold bg-[#f8fafc] text-emerald-600 border-b border-slate-200 w-[24%]">กระแสเงินสด</th>` : ''}<th class="py-3 px-1 font-bold bg-[#f8fafc] text-amber-600 border-b border-slate-200 ${showCashFlow ? 'w-[24%]' : 'w-[29%]'}">เงินสดพร้อมใช้</th></tr>`;

    const maxYear = 90 - d.age; const payYears = parseInt(d.years);
    let html = ''; let totalPremium = 0; let foundBreakeven = false; let beYear = 0; let beAge = 0;
    const hasCVData = cvDataLookup && Object.keys(cvDataLookup).length > 0;

    for (let y = 1; y <= maxYear; y++) {
        let annualPremium = 0; if (y <= payYears) { annualPremium = d.premium; totalPremium += d.premium; }
        let cvTotal = 0;
        if (hasCVData) { try { let ratePer1000 = cvDataLookup[currentPlan][currentGender][d.age][y]; cvTotal = (d.sum / 1000) * ratePer1000; } catch(e) { cvTotal = 0; } } else { let cvPer1000 = 0; if (y > 1) { let progress = (y - 1) / (maxYear - 1); cvPer1000 = Math.round(Math.pow(progress, 1.4) * 1000); } if (y === maxYear) cvPer1000 = 1000; cvTotal = (d.sum / 1000) * cvPer1000; }
        let cashFlowAmt = showCashFlow ? d.cashFlow : 0;
        let isBeRow = false; if (!foundBreakeven && totalPremium > 0 && cvTotal >= totalPremium) { foundBreakeven = true; beYear = y; beAge = d.age + y; isBeRow = true; }
        let trClass = "border-b border-slate-100 transition-colors " + (isBeRow ? "breakeven-target" : "hover:bg-slate-50");
        html += `<tr class="${trClass}"><td class="py-3 px-1 text-slate-600 font-medium relative"><div class="be-badge absolute left-0 top-1/2 -translate-y-1/2 w-1 h-full bg-emerald-500 rounded-r-md hidden"></div>${d.age + y}</td><td class="py-3 px-1 text-slate-600">${y <= payYears ? Math.round(annualPremium).toLocaleString() : "-"}</td><td class="py-3 px-1 text-blue-600">${Math.round(totalPremium).toLocaleString()}</td>${showCashFlow ? `<td class="py-3 px-1 text-emerald-600 font-bold">${Math.round(cashFlowAmt).toLocaleString()}</td>` : ''}<td class="py-3 px-1 text-amber-600 font-bold">${Math.round(cvTotal).toLocaleString()}</td></tr>`;
    }
    document.getElementById('policyTableBody').innerHTML = html;
    
    if (foundBreakeven) { document.getElementById('breakevenSummary').innerHTML = `<div class="bg-emerald-100 border border-emerald-200 rounded-xl py-2 px-3 text-[12px] text-emerald-800 font-bold shadow-sm flex items-center justify-center gap-2"><i class="fas fa-bullseye text-emerald-600 text-lg"></i><span>จุดคุ้มทุนอยู่ที่: ปีที่ <span class="text-emerald-700 text-sm">${beYear}</span> (อายุ <span class="text-emerald-700 text-sm">${beAge}</span> ปี)</span></div>`; } else { document.getElementById('breakevenSummary').innerHTML = `<div class="bg-slate-100 border border-slate-200 rounded-xl py-2 px-3 text-[12px] text-slate-500 font-bold flex items-center justify-center gap-2"><i class="fas fa-info-circle text-slate-400"></i> ไม่พบจุดคุ้มทุนก่อนครบกำหนดสัญญา</div>`; }
    toggleBreakevenDisplay(false); 
}

function toggleBreakevenDisplay(smoothScroll = true) {
    const tableBody = document.getElementById('policyTableBody'); const summary = document.getElementById('breakevenSummary'); const isChecked = document.getElementById('toggleBreakeven')?.checked;
    if (isChecked) {
        tableBody.classList.add('show-breakeven'); if (summary) summary.classList.remove('hidden');
        if (smoothScroll) { setTimeout(() => { const beRow = tableBody.querySelector('.breakeven-target'); const pdfTableTarget = document.getElementById('pdfTableTarget'); if (beRow && pdfTableTarget) { const targetPos = beRow.offsetTop - (pdfTableTarget.clientHeight / 2) + 30; pdfTableTarget.scrollTo({ top: targetPos, behavior: 'smooth' }); } }, 100); }
    } else { tableBody.classList.remove('show-breakeven'); if (summary) summary.classList.add('hidden'); }
}

let thaiFontBase64 = null;
async function loadThaiFont() { if (thaiFontBase64) return thaiFontBase64; try { const response = await fetch('https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/sarabun/Sarabun-Regular.ttf'); const blob = await response.blob(); return new Promise((resolve) => { const reader = new FileReader(); reader.onloadend = () => { thaiFontBase64 = reader.result.split(',')[1]; resolve(thaiFontBase64); }; reader.readAsDataURL(blob); }); } catch (e) { return null; } }

async function exportTableToPDF(actionType = 'save') {
    if (!lastCalculationData) return showCustomError("กรุณาคำนวณเบี้ยประกันก่อน");
    const toast = document.createElement('div'); toast.className = "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-900 text-white px-8 py-5 rounded-2xl text-sm font-bold z-[1000] shadow-2xl text-center backdrop-blur-sm transition-all"; toast.innerHTML = `<i class='fas fa-spinner fa-spin mb-3 block text-3xl'></i><span>กำลังประมวลผล PDF...</span>`; document.body.appendChild(toast); 
    try {
        const fontBase64 = await loadThaiFont(); const { jsPDF } = window.jspdf; const doc = new jsPDF('p', 'mm', 'a4'); let fontName = 'helvetica'; 
        if (fontBase64) { try { doc.addFileToVFS('Sarabun-Regular.ttf', fontBase64); doc.addFont('Sarabun-Regular.ttf', 'Sarabun', 'normal'); fontName = 'Sarabun'; } catch (e) {} }
        
        const d = lastCalculationData; const tableRows = []; const trs = document.querySelectorAll('#policyTableBody tr'); const showBreakeven = document.getElementById('toggleBreakeven')?.checked; let beRowIndex = -1; let beAgeStr = '', beYearStr = '', beCVStr = ''; const showCashFlow = ["Whole Life Extra", "24 TX", "868 / 818 Elite Saving"].includes(currentAppPlan); let headRow = ['อายุ', 'ออมเงิน', 'ออมสะสม']; if (showCashFlow) headRow.push('กระแสเงินสด'); headRow.push('เงินสดพร้อมใช้'); headRow.push('ทุนประกัน');

        trs.forEach((tr, index) => { const tds = tr.querySelectorAll('td'); const rowData = []; tds.forEach(td => rowData.push(td.innerText.trim())); rowData.push(formatNum(d.sum)); tableRows.push(rowData); if (tr.classList.contains('breakeven-target')) { beRowIndex = index; beAgeStr = rowData[0]; beYearStr = beAgeStr - d.age; beCVStr = rowData[showCashFlow ? 4 : 3]; } });

        doc.autoTable({ startY: (showBreakeven && beRowIndex !== -1) ? 40 : 34, head: [headRow], body: tableRows, theme: 'plain', margin: { top: 34, bottom: 15, left: 15, right: 15 }, styles: { font: fontName, fontSize: 12, halign: 'center', valign: 'middle', cellPadding: 1.5, minCellHeight: 4.8 }, headStyles: { fillColor: [248, 250, 252], textColor: [100, 116, 139], fontStyle: 'bold', lineWidth: { top: 0, bottom: 0.1, left: 0, right: 0 }, lineColor: [226, 232, 240] }, bodyStyles: { textColor: [71, 85, 105], lineWidth: { top: 0, bottom: 0.1, left: 0, right: 0 }, lineColor: [241, 245, 249] }, didDrawPage: function (data) { doc.setFillColor(36, 60, 148); doc.rect(0, 0, 210, 20, 'F'); doc.setFont(fontName, 'normal'); doc.setFontSize(18); doc.setTextColor(255, 255, 255); doc.text('CI Extra Plus', 105, 13, { align: 'center' }); let sumDisplay = (d.sum >= 1000000 && d.sum % 1000000 === 0) ? (d.sum/1000000)+' ล้านบาท' : (d.sum >= 100000 && d.sum % 100000 === 0) ? (d.sum/100000)+' แสนบาท' : formatNum(d.sum)+' บาท'; doc.setFontSize(14); doc.setTextColor(30, 58, 138); doc.text(`${getPlanAbbr(currentAppPlan)} ${d.gender} ${d.age} ทุน ${sumDisplay}`, 105, 28, { align: 'center' }); if (data.pageNumber === 1 && showBreakeven && beRowIndex !== -1) { doc.setFont(fontName, 'normal'); doc.setFontSize(13); doc.setTextColor(6, 95, 70); doc.text(`🎯 จุดคุ้มทุน: ปีที่ ${beYearStr} (อายุ ${beAgeStr} ปี) | เงินสดพร้อมใช้: ${beCVStr} บาท`, 105, 35, { align: 'center' }); } } });

        const pageCount = doc.internal.getNumberOfPages(); doc.setFont(fontName, 'normal'); doc.setFontSize(11);
        for (let i = 1; i <= pageCount; i++) { doc.setPage(i); doc.setDrawColor(226, 232, 240); doc.line(15, 285, 195, 285); doc.setTextColor(148, 163, 184); doc.text(`หน้า ${i} / ${pageCount}`, 195, 290, { align: 'right' }); }

        const pdfFileName = `${getPlanAbbr(currentAppPlan)}_ตารางมูลค่า_อายุ${d.age}.pdf`;
        if (actionType === 'print') { doc.autoPrint(); window.open(doc.output('bloburl'), '_blank'); } 
        else if (actionType === 'line' || actionType === 'messenger') { const pdfBlob = doc.output('blob'); const file = new File([pdfBlob], pdfFileName, { type: 'application/pdf' }); if (navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: `ตารางมูลค่า ${getPlanAbbr(currentAppPlan)}`, text: `ตารางมูลค่า ${getPlanAbbr(currentAppPlan)}` }).catch(err => { if (err.name === 'NotAllowedError') doc.save(pdfFileName); }); } else { showCustomError("เบราว์เซอร์ไม่รองรับการแชร์ไฟล์"); doc.save(pdfFileName); } } else { doc.save(pdfFileName); }
    } catch (error) { showCustomError("เกิดข้อผิดพลาดในการสร้าง PDF"); } finally { toast.remove(); }
}

// ==================== AI ADVISOR MODULE ====================
async function generateAIAnalysis() {
    if (!lastCalculationData || lastCalculationData.premium === 0) return;
    const d = lastCalculationData;
    document.getElementById('aiLoadingState').classList.remove('hidden'); document.getElementById('aiLoadingState').classList.add('flex');
    document.getElementById('aiResultState').classList.add('hidden'); document.getElementById('aiResultState').innerHTML = '';
    const aiContent = await callGeminiAPI(d);
    document.getElementById('aiLoadingState').classList.add('hidden'); document.getElementById('aiLoadingState').classList.remove('flex');
    const resultState = document.getElementById('aiResultState');
    resultState.innerHTML = aiContent; resultState.classList.remove('hidden'); resultState.classList.add('flex');
}

async function callGeminiAPI(userData) {
    const apiKey = "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const systemPrompt = `คุณคือสุดยอดวิทยากรและนักขายระดับโลก ให้คำปรึกษาแก่ตัวแทนเพื่อไปเสนอขาย วิเคราะห์ข้อมูลอย่างเฉียบขาด ไม่ซ้ำเดิม
    กรุณาสร้างบทวิเคราะห์เป็น HTML เท่านั้น โดยใช้โครงสร้างนี้:
    <h4><i class="fas fa-heartbeat text-rose-500"></i> แรงจูงใจและจุดเจ็บปวด</h4>
    <ul><li><strong>[หัวข้อ]:</strong> [รายละเอียด]</li></ul>
    <h4><i class="fas fa-comment-dollar text-amber-500"></i> บทสนทนาเปิดใจ</h4>
    <div class="ai-quote">"[ประโยคคำพูดเปิดใจ]"</div>
    <h4><i class="fas fa-shield-alt text-indigo-500"></i> การตอบข้อโต้แย้ง</h4>
    <ul><li><strong>"[ข้อโต้แย้ง]":</strong><br><span class="text-slate-600">➡️ <em>"[วิธีตอบกลับ]"</em></span></li></ul>
    <h4><i class="fas fa-handshake text-emerald-500"></i> เทคนิคปิดการขาย</h4>
    <ul><li><strong>[เทคนิค]:</strong> [คำอธิบาย]</li></ul>
    ข้อห้าม: ห้ามใช้ภาษาอังกฤษ, ห้ามใช้คำว่า "เบี้ย" (ใช้ "ออม"), ห้ามใช้คำว่า "ทุน" (ใช้ "วงเงิน"), ห้ามระบุชื่อแผน, ห้ามมีคำว่า ลูกค้า ในหัวข้อ`;

    const userPrompt = `วิเคราะห์การนำเสนอสำหรับ:\nเพศ: ${userData.gender}\nอายุ: ${userData.age} ปี\nออม: ${formatNum(userData.premium)} บาทต่อปี\nวงเงินคุ้มครอง: ${formatNum(userData.sum)} บาท`;
    const payload = { contents: [{ parts: [{ text: userPrompt }] }], systemInstruction: { parts: [{ text: systemPrompt }] } };
    const delays = [1000, 2000, 4000, 8000, 16000];

    for (let attempt = 0; attempt <= 5; attempt++) {
        try {
            const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text.replace(/```html/g, '').replace(/```/g, '').trim() || '';
        } catch (error) {
            if (attempt === 5) { return `<div class="flex flex-col items-center justify-center py-10 text-center w-full h-full"><i class="fas fa-exclamation-triangle text-[45px] text-[#f43f5e] mb-4"></i><p class="text-[16px] font-medium text-[#f43f5e]">ไม่สามารถเชื่อมต่อระบบ AI ได้ โปรดลองอีกครั้ง</p></div>`; }
            await new Promise(resolve => setTimeout(resolve, delays[attempt]));
        }
    }
}

// ==================== SHARE & UTILS (อัปเกรด LINE LIFF) ====================
function triggerInstallmentShare(type) {
    if (!lastCalculationData) return; 
    const d = lastCalculationData; const p = d.premium; let amt = 0, label = ''; 
    if(type === 'monthly') { amt = Math.round(p * 0.09); label = 'รายเดือน'; } if(type === '3month') { amt = Math.round(p * 0.27); label = 'ราย 3 เดือน'; } if(type === '6month') { amt = Math.round(p * 0.52); label = 'ราย 6 เดือน'; } 
    const sumStr = formatNum(d.sum); const extraCI = formatNum(d.sum * 0.25); const majorCI = formatNum(d.sum * 0.75); const medExtra = formatNum(d.sum * 0.10); const maturityStr = formatNum(d.sum * 1.05); const maturityExtraStr = formatNum(d.sum * 0.05);
    const premOnlyText = `${amt.toLocaleString()}`;
    let allText = `👤 เพศ ${d.gender}\n🎂 อายุ ${d.age} ปี\n💰 ออมเงิน : ${amt.toLocaleString()} บาท (${label})\n⏳ ระยะเวลาออม ${d.years} ปี\n🛡️ วงเงิน ${sumStr} บาท\n\n--------------------------\n** ระยะเวลารอคอย 90 วัน\n--------------------------\n\n`; 
    if (d.age <= 15) allText += `🧸 ตรวจพบ 1 ใน 15 โรคเด็ก\nจ่าย ${sumStr} บาท\n**ดูแลถึงอายุ 15 ปี\n\n`; 
    allText += `🦠 ตรวจพบ 1 ใน 5 โรคร้าย\nจ่าย (สูงสุด 4 ครั้ง) ${extraCI} บาท\n\n🧬 ตรวจพบ 1 ใน 45 โรคร้าย (ภายหลัง)\nจ่าย ${majorCI} บาท\n** ยกเว้นการออมในครั้งถัดไป\nพร้อมดูแลค่ารักษาเพิ่มเติม ${medExtra} บาท\n\n🧬 ตรวจพบ 1 ใน 45 โรคร้าย (ก่อน)\nจ่าย ${sumStr} บาท\n** ยกเว้นการออมในครั้งถัดไป\nพร้อมดูแลค่ารักษาเพิ่มเติม ${medExtra} บาท\n\n🕊️ จากไปหรือครบสัญญา\nจ่าย ${maturityStr} บาท\n**ดูแลถึงอายุ 90 ปี\n(หากพบโรคร้ายก่อน จ่ายเพิ่ม ${maturityExtraStr} บาท)`; 
    pendingInstallmentData = { premOnly: premOnlyText, allText: allText, label: label };
    document.getElementById('installmentShareTitle').innerText = 'แชร์ยอดชำระ' + label;
    closePopup('installmentModal'); openPopup('installmentShareModal');
}

let currentShareType = '';
function openGenericShareModal(type) {
    if (type === 'all' && !lastCalculationData) return showCustomError("กรุณาคำนวณเบี้ยประกันก่อนแชร์");
    currentShareType = type; openPopup('genericShareModal');
}

function handleGenericShare(platform) {
    if (currentShareType === 'diseaseList') { const text = 'https://short-url.org/1nMQi'; if (platform === 'copy') copyToClipboard(text, 'คัดลอกลิงก์เรียบร้อยแล้ว'); else executeShare(text, platform); } 
    else if (currentShareType === 'premium' || currentShareType === 'all') { if (platform === 'copy') { handleCopyAndClose(currentShareType); } else { closePopup('resultModal'); shareResult(currentShareType, platform); } } 
    else if (currentShareType === 'installmentPrem' || currentShareType === 'installmentAll') { const textToShare = currentShareType === 'installmentPrem' ? pendingInstallmentData.premOnly : pendingInstallmentData.allText; if (platform === 'copy') copyToClipboard(textToShare, `คัดลอกเรียบร้อยแล้ว`); else executeShare(textToShare, platform); } 
    else if (['scb', 'bbl', 'bay', 'kbank'].includes(currentShareType)) { const bText = {"scb": "ธ.ไทยพาณิชย์ : 049-416-6866 สาขาถนนวิทยุ", "bbl": "ธ.กรุงเทพ : 147-312-5357 สาขาสุรวงศ์", "bay": "ธ.กรุงศรี : 001-016-4329 สาขาเพลินจิต", "kbank": "ธ.กสิกร : 099-132-6065 สาขาพหลโยธิน"}; if (platform === 'copy') copyToClipboard(bText[currentShareType], 'คัดลอกบัญชีเรียบร้อยแล้ว'); else shareText(bText[currentShareType], platform); }
    closePopup('genericShareModal');
}

function generateResultText(type) {
    if (!lastCalculationData) return ''; const d = lastCalculationData;
    if (type === 'premium') return `${Math.round(d.premium).toLocaleString()}`;
    const sumStr = formatNum(d.sum); const extraCI = formatNum(d.sum * 0.25); const majorCI = formatNum(d.sum * 0.75); const medExtra = formatNum(d.sum * 0.10); const maturityStr = formatNum(d.sum * 1.05); const maturityExtraStr = formatNum(d.sum * 0.05);
    let text = `👤 เพศ ${d.gender}\n🎂 อายุ ${d.age} ปี\n💰 ออม : ${Math.round(d.premium).toLocaleString()} บาท\n⏳ ระยะเวลาออม ${d.years} ปี\n🛡️ วงเงิน ${sumStr} บาท\n\n--------------------------\n** ระยะเวลารอคอย 90 วัน\n--------------------------\n\n`; 
    if (d.age <= 15) text += `🧸 ตรวจพบ 1 ใน 15 โรคเด็ก\nจ่าย ${sumStr} บาท\n**ดูแลถึงอายุ 15 ปี\n\n`; 
    text += `🦠 ตรวจพบ 1 ใน 5 โรคร้าย\nจ่าย (สูงสุด 4 ครั้ง) ${extraCI} บาท\n\n🧬 ตรวจพบ 1 ใน 45 โรคร้าย (ภายหลัง)\nจ่าย ${majorCI} บาท\n** ยกเว้นการออมในครั้งถัดไป\nพร้อมดูแลค่ารักษาเพิ่มเติม ${medExtra} บาท\n\n🕊️ จากไปหรือครบสัญญา\nจ่าย ${maturityStr} บาท\n**ดูแลถึงอายุ 90 ปี\n(หากพบโรคร้ายก่อน จ่ายเพิ่ม ${maturityExtraStr} บาท)`; 
    return text;
}

function copyToClipboard(text, msg) { const el = document.createElement('textarea'); el.value = text; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); const toast = document.createElement('div'); toast.className = "fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full text-xs font-bold z-[1000] shadow-xl transition-opacity duration-300"; toast.innerText = msg; document.body.appendChild(toast); setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 300); }, 2000); }
function copyToClipboardWithFeedback(text, callback, customHTML) { const el = document.createElement('textarea'); el.value = text; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); const toast = document.createElement('div'); toast.className = "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800/95 text-white px-8 py-6 rounded-3xl text-sm font-bold z-[1000] shadow-2xl text-center backdrop-blur-sm transition-all"; toast.innerHTML = customHTML; document.body.appendChild(toast); setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => { toast.remove(); if (callback) callback(); }, 300); }, 1800); }

// อัปเกรดระบบ Share ให้เชื่อมต่อกับ LIFF
async function executeShare(text, platform) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (platform === 'line') { 
        // เช็คว่าเปิดผ่าน LINE LIFF หรือไม่
        if (typeof liff !== 'undefined' && liff.isApiAvailable('shareTargetPicker')) {
            try {
                await liff.shareTargetPicker([{ type: "text", text: text }]);
                const toast = document.createElement('div'); toast.className = "fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-full text-xs font-bold z-[1000] shadow-xl"; toast.innerText = "ส่งเข้าแชทเรียบร้อยแล้ว!"; document.body.appendChild(toast);
                setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 300); }, 2000);
            } catch (e) {
                console.log("ยกเลิกการแชร์", e);
            }
        } else {
            // กรณีเปิดบน Browser ปกติ
            const lineUrl = 'https://line.me/R/msg/text/?' + encodeURIComponent(text); 
            if (isMobile) window.location.href = lineUrl; else window.open(lineUrl, '_blank'); 
        }
    } 
    else if (platform === 'messenger') { const fbHtml = `<div class="w-14 h-14 bg-[#0084FF] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"><i class='fab fa-facebook-messenger text-3xl text-white'></i></div><span class="text-base font-bold block mb-1">คัดลอกข้อความแล้ว</span><span class='text-xs font-medium opacity-90 block text-blue-200'>ระบบกำลังเปิด Messenger...<br>กรุณาวางข้อความในช่องแชท</span>`; copyToClipboardWithFeedback(text, () => { if (isMobile) { window.location.href = 'fb-messenger://'; setTimeout(() => { window.open('https://www.messenger.com/', '_blank'); }, 800); } else { window.open('https://www.messenger.com/', '_blank'); } }, fbHtml); } 
    else if (platform === 'copy') { copyToClipboard(text, "คัดลอกเรียบร้อยแล้ว"); }
}

function shareResult(type, platform) { const text = generateResultText(type); if (text) executeShare(text, platform); }
function shareText(text, platform) { if (text) executeShare(text, platform); }
function handleCopyAndClose(type = 'all') { const text = generateResultText(type); if (text) copyToClipboard(text, "คัดลอกเรียบร้อยแล้ว"); closePopup('resultModal'); }

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
function showMedExtraDef() { showDefinition('รายการค่ารักษาพยาบาลเพิ่มเติม', `1. ค่ารักษาพยาบาลโรคร้ายแรง\n2. ค่าเวชศาสตร์ฟื้นฟู\n3. ค่ารักษาความงามและศัลยกรรมตกแต่ง\n4. ค่ารักษาแพทย์ทางเลือก`); }

function setupLongPress() {
    const btn = document.getElementById('mainHeaderBtn');
    if (!btn) return;
    let pressTimer; let isLongPress = false; let startX, startY;
    const handleStart = (x, y) => { isLongPress = false; startX = x; startY = y; pressTimer = setTimeout(() => { isLongPress = true; openPopup('insuranceConditionsModal'); if (navigator.vibrate) navigator.vibrate(50); }, 500); };
    const handleMove = (x, y) => { if (!startX || !startY) return; if (Math.abs(x - startX) > 10 || Math.abs(y - startY) > 10) { clearTimeout(pressTimer); } };
    btn.addEventListener('touchstart', (e) => { handleStart(e.touches[0].clientX, e.touches[0].clientY); }, {passive: true});
    btn.addEventListener('touchmove', (e) => { handleMove(e.touches[0].clientX, e.touches[0].clientY); }, {passive: true});
    btn.addEventListener('touchend', (e) => { clearTimeout(pressTimer); if (isLongPress) e.preventDefault(); });
    btn.addEventListener('mousedown', (e) => { if (e.button !== 0) return; handleStart(e.clientX, e.clientY); });
    btn.addEventListener('mousemove', (e) => { handleMove(e.clientX, e.clientY); });
    btn.addEventListener('mouseup', () => clearTimeout(pressTimer));
    btn.addEventListener('mouseleave', () => clearTimeout(pressTimer));
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
    btn.addEventListener('click', (e) => { if (isLongPress) { e.preventDefault(); e.stopPropagation(); return; } openPlanModal(); });
}
        
function setupScrollHideNav() {
    const bottomNav = document.getElementById('bottomNavContainer');
    if (!bottomNav) return;
    document.querySelectorAll('.scrollable-view').forEach(el => {
        let lastScrollTop = 0;
        el.addEventListener('scroll', function() {
            let st = this.scrollTop;
            if (st <= 10) { bottomNav.style.transform = 'translateY(0)'; bottomNav.style.opacity = '1'; lastScrollTop = st; return; }
            if (st < 0) return;
            if (Math.abs(lastScrollTop - st) <= 5) return; 
            if (st > lastScrollTop) { bottomNav.style.transform = 'translateY(150%)'; bottomNav.style.opacity = '0'; } else { bottomNav.style.transform = 'translateY(0)'; bottomNav.style.opacity = '1'; }
            lastScrollTop = st;
        }, { passive: true });
    });
}

window.onload = async () => { 
    document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.add('hidden'));
    loadThaiFont(); calculate('sum'); 
    setupLongPress(); 
    setupScrollHideNav(); 

    // เริ่มต้นระบบเชื่อมต่อ LIFF
    try {
        await liff.init({ liffId: "ใส่_LIFF_ID_ของคุณที่นี่" });
        if (!liff.isLoggedIn()) {
            console.log("ยังไม่ได้ Login ผ่าน LINE");
            // liff.login(); // เอาคอมเมนต์ออกถ้าต้องการบังคับล็อกอิน
        }
    } catch (err) {
        console.error("เชื่อมต่อ LIFF ไม่สำเร็จ:", err);
    }
};
