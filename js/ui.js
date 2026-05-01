// js/ui.js

const setText = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };
const formatNum = (num) => { const rounded = Math.round(num * 100) / 100; return Number.isInteger(rounded) ? rounded.toLocaleString() : rounded.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}); };
const formatPct = (num) => { return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + '%'; };

let currentPlanOptions = ['10CX', '20CX'];
let currentAppPlan = "CI Extra Plus";
const allInsurancePlans = [ /* ... อาร์เรย์ allInsurancePlans เดิม ... */ ];

// ฟังก์ชัน Modal และ UI เบื้องต้น
function openPopup(id) { const modal = document.getElementById(id); if (modal) { modal.classList.remove('hidden'); setTimeout(() => { modal.classList.add('show'); }, 10); } }
function closePopup(id) { const modal = document.getElementById(id); if (modal) { modal.classList.remove('show'); setTimeout(() => { modal.classList.add('hidden'); }, 300); } }
function handleModalClick(e, modalId) { if (e.target.closest('button, input, select, textarea, a, .list-row, .interactive-btn')) return; closePopup(modalId); }
function showCustomError(msg) { /* ... โค้ดเดิม ... */ }
function showCongratsToast(msg) { /* ... โค้ดเดิม ... */ }

// ฟังก์ชันควบคุม UI อื่นๆ (คัดลอกของเดิมมาทั้งหมด)
// handleHeaderClick, highlightActivePills, adjustAge, setGender,
// handlePremiumInput, handleSumInput, setQuickSum, setQuickPremium,
// updatePlanOptionsForApp, setPlan, selectAppPlan,
// renderUnifiedPlanList, handleUnifiedPlanSearch, updateQuickPills,
// switchView, generatePolicyTableData, toggleBreakevenDisplay,
// refreshAllDisplays, startVoiceRecognition, showDefinition, 
// setupLongPress, setupScrollHideNav

// === INIT ===
window.onload = async () => { 
    // โหลดข้อมูลก่อนเริ่มทำงาน
    await loadAppData();

    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
    
    setTimeout(() => {
        setGender(currentGender);
        setPlan(currentPlan);
    }, 50);

    calculate('sum'); 
    setupLongPress(); 
    setupScrollHideNav(); 
};
