// ==================== config.js ====================
// ไฟล์ตั้งค่ากฎและพฤติกรรมหน้าจอของแต่ละแบบประกัน

const PLANS_CONFIG = {
    "CI Extra Plus": {
        subtitle: "ออมเงิน : ชดเชยโรคร้าย + TPD 2 เท่า",
        subPlans: ["10CX", "20CX"],
        uiType: "modal", 
        labelPremium: "ออมเงิน (บาท/ปี)",
        showCashFlow: false,
        allowRiders: false,
        is3D: false,
        pills: [100000, 500000, 1000000, 3000000, 5000000],
        defaultSum: 1000000
    },
    "Life Protector 20": {
        subtitle: "มรดก + เงินคืนก้อนใหญ่ + TPD 2 เท่า",
        subPlans: ["20LPB"],
        uiType: "table", // ข้ามไปหน้าตารางมูลค่า
        labelPremium: "ออมเงิน (บาท/ปี)",
        showCashFlow: false,
        allowRiders: false,
        is3D: false,
        pills: [], // ซ่อนปุ่มลัดทุนประกัน
        defaultSum: 1000000
    },
    "Supreme Life Protector": {
        subtitle: "คุ้มครองชีวิตสูง + TPD 2 เท่า",
        subPlans: ["20SLPA"],
        uiType: "table",
        labelPremium: "ออมเงิน (บาท/ปี)",
        showCashFlow: false,
        allowRiders: false,
        is3D: false,
        pills: [], // ซ่อนปุ่มลัดทุนประกัน
        defaultSum: 1000000
    },
    "Whole Life Extra": {
        subtitle: "สร้างกระแสเงินสดตลอดชีพ + TPD 2 เท่า",
        subPlans: ["WXN10", "WXN15"],
        uiType: "table",
        labelPremium: "ออมเงิน (บาท/ปี)",
        showCashFlow: true, // แสดงช่องกระแสเงินสด
        allowRiders: false,
        is3D: false,
        pills: [500000, 1000000, 3000000, 5000000],
        defaultSum: 1000000
    },
    "Signature Legacy": {
        subtitle: "ส่งต่อความมั่งคั่ง + TPD 2 เท่า",
        subPlans: ["SLB5", "SLB10"], // เพิ่ม SLB5, SLB10
        uiType: "table",
        labelPremium: "เบี้ยประกัน (บาท/ปี)", // เปลี่ยนคำว่าออมเงิน
        showCashFlow: false,
        allowRiders: false,
        is3D: false,
        pills: [5000000, 10000000, 50000000, 100000000],
        defaultSum: 5000000 // ทุนเริ่มต้น 5 ล้าน
    },
    "Century Life + TPD": {
        subtitle: "มรดก 100 ปี + TPD 2 เท่า",
        subPlans: ["10CL", "20CL", "60CL", "90CL"], // เพิ่ม CL ครบ 4 แผน
        uiType: "modal", 
        labelPremium: "ออมเงิน (บาท/ปี)",
        showCashFlow: false,
        allowRiders: false,
        is3D: false,
        pills: [100000, 500000, 1000000, 5000000],
        defaultSum: 1000000
    },
    "3D Health Excellence": {
        subtitle: "ประกันสุขภาพที่ออกแบบได้เอง + TPD",
        subPlans: ["10CL", "20CL", "60CL", "90CL"], // ใช้ CL เป็นสัญญาหลัก
        uiType: "table",
        labelPremium: "เบี้ยประกันรวม (บาท/ปี)",
        showCashFlow: false,
        allowRiders: true, // เปิด Extra/Advance
        is3D: true, // ใช้กฎ 3D (ซ่อนทุนหลัก, เพิ่ม HX)
        pills: [], 
        defaultSum: 0 
    },
    "24 TX": {
        subtitle: "สร้างเงินก้อนใน 24 ปี + TPD 2 เท่า",
        subPlans: ["TX24"],
        uiType: "table",
        labelPremium: "ออมเงิน (บาท/ปี)",
        showCashFlow: true,
        allowRiders: false,
        is3D: false,
        pills: [500000, 1000000, 3000000],
        defaultSum: 1000000
    },
    "868 / 818 Elite Saving": {
        subtitle: "ออมสั้น รับเงินคืนสูง + TPD 2 เท่า",
        subPlans: ["Elite868"],
        uiType: "table",
        labelPremium: "ออมเงิน (บาท/ปี)",
        showCashFlow: true,
        allowRiders: false,
        is3D: false,
        pills: [1000000, 2000000, 5000000],
        defaultSum: 1000000
    }
};

// ค่าคอมมิชชัน
const COM_RATES = { 
    "10CX": [0.20, 0.10, 0.07, 0.02, 0.01, 0.01], 
    "20CX": [0.30, 0.16, 0.10, 0.02, 0.01, 0.01, 0.01, 0.01], 
    "20LPB": [0.30, 0.15, 0.10, 0.05, 0.02], 
    "20SLPA": [0.35, 0.15, 0.10, 0.05, 0.02], 
    "WXN10": [0.20, 0.10, 0.05, 0.02, 0.01, 0.01], 
    "WXN15": [0.25, 0.12, 0.08, 0.02, 0.01, 0.01], 
    "10CL": [0.25, 0.10, 0.05, 0.02, 0.01, 0.01], 
    "20CL": [0.35, 0.15, 0.10, 0.05, 0.02, 0.01], 
    "60CL": [0.40, 0.20, 0.10, 0.05, 0.02, 0.01], 
    "90CL": [0.40, 0.20, 0.10, 0.05, 0.02, 0.01], 
    "SLB5": [0.15, 0.05, 0.05, 0.02, 0.01],
    "SLB10": [0.25, 0.10, 0.05, 0.02, 0.01, 0.01],
    "TX24": [0.10, 0.05, 0.02, 0.01],
    "Elite868": [0.12, 0.05, 0.02, 0.01] 
};

// รายชื่อเมนูให้ Dropdown
const allInsurancePlans = Object.keys(PLANS_CONFIG).map(key => ({
    name: key,
    desc: PLANS_CONFIG[key].subtitle,
    icon: key === "CI Extra Plus" ? "fas fa-shield-heart" : (key.includes("Health") ? "fas fa-hand-holding-medical" : "fas fa-star"),
    color: "text-blue-500",
    bg: "bg-blue-100"
}));
