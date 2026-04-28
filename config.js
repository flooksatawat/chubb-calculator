// ==================== config.js ====================
const PLANS_CONFIG = {
    "CI Extra Plus": {
        subtitle: "ออมเงิน : ชดเชยโรคร้าย + วงเงินพิเศษ",
        subPlans: ["10CX", "20CX"],
        uiType: "modal", 
        showSum: true, showPrem: true, hasCash: false, is3D: false,
        sumPills: [100000, 500000, 1000000, 3000000, 5000000],
        premPills: [12000, 24000, 36000, 60000],
        defaultSum: 1000000
    },
    "Life Protector 20": {
        subtitle: "เปลี่ยนทุนประกัน เป็นบำนาญ",
        subPlans: ["20LPB"],
        uiType: "table",
        showSum: true, showPrem: true, hasCash: false, is3D: false,
        sumPills: [100000, 500000, 1000000, 3000000, 5000000], // คืนค่า Pills
        premPills: [20000, 50000, 100000],
        defaultSum: 1000000
    },
    "Supreme Life Protector": {
        subtitle: "เปลี่ยนทุนประกัน เป็นบำนาญ",
        subPlans: ["20SLPA"],
        uiType: "table",
        showSum: true, showPrem: true, hasCash: false, is3D: false,
        sumPills: [100000, 500000, 1000000, 3000000, 5000000], // คืนค่า Pills
        premPills: [50000, 100000, 200000],
        defaultSum: 1000000
    },
    "Signature Legacy": {
        subtitle: "แผนมรดก ลูกค้ามูลค่าสูง",
        subPlans: ["SLB5", "SLB10"],
        uiType: "table",
        labelPrem: "เบี้ยประกัน (บาท/ปี)",
        showSum: true, showPrem: true, hasCash: false, is3D: false,
        sumPills: [5000000, 10000000, 50000000, 100000000], // เริ่มต้น 5 ล้าน
        premPills: [], // ตัดเบี้ยประกันออก (กรอบแดง)
        defaultSum: 5000000
    },
    "Convertable Term": {
        subtitle: "จองสิทธิ เปลี่ยนแบบประกันได้",
        subPlans: ["10TLA", "20TLA"],
        uiType: "table",
        showSum: true, showPrem: true, hasCash: false, is3D: false,
        sumPills: [1000000, 3000000, 5000000, 10000000],
        defaultSum: 1000000
    },
    "Century Life + TPD": {
        subtitle: "แผนมรดก 100 ปี + TPD",
        subPlans: ["10CL", "20CL", "60CL", "90CL"],
        uiType: "modal",
        showSum: true, showPrem: true, hasCash: false, is3D: false,
        sumPills: [100000, 500000, 1000000, 5000000],
        defaultSum: 1000000
    },
    "3D Health Excellence": {
        subtitle: "ประกันสุขภาพ ที่เข้าใจทุกช่วงชีวิต",
        subPlans: ["10CL", "20CL", "60CL", "90CL"],
        uiType: "table",
        is3D: true, 
        showSum: true, labelSum: "ทุนประกันสัญญาหลัก (CL)",
        showPrem: false, // ตัดเบี้ยรวมออกตามภาพ
        hasCash: false,
        sumPills: [100000, 200000, 500000],
        defaultSum: 200000
    },
    "Whole Life Extra": {
        subtitle: "สินทรัพย์กระแสเงินสด",
        subPlans: ["WXN10", "WXN15"],
        uiType: "table",
        showSum: false, // ตัดวงเงินความคุ้มครองออก
        showPrem: true,
        hasCash: true,
        premPills: [100000, 300000, 500000, 1000000]
    },
    "24 TX": {
        subtitle: "สินทรัพย์กระแสเงินสด",
        subPlans: ["TX24"],
        uiType: "table",
        showSum: false, // ตัดวงเงินความคุ้มครองออก
        showPrem: true,
        hasCash: true,
        premPills: [50000, 100000, 200000]
    },
    "868 / 818 Elite Saving": {
        subtitle: "สินทรัพย์กระแสเงินสด",
        subPlans: ["Elite868"],
        uiType: "table",
        showSum: false, // ตัดวงเงินความคุ้มครองออก
        showPrem: true,
        hasCash: true,
        premPills: [500000, 1000000, 2000000]
    }
};

const CASH_PILLS = [120000, 300000, 600000, 1000000];
const allInsurancePlans = Object.keys(PLANS_CONFIG).map(key => ({
    name: key, desc: PLANS_CONFIG[key].subtitle, icon: key === "CI Extra Plus" ? "fas fa-shield-heart" : (key.includes("Health") ? "fas fa-hand-holding-medical" : "fas fa-star"), color: "text-blue-500", bg: "bg-blue-100"
}));
