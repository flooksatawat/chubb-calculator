// app.js
let currentPlan = "20CX";
let currentGender = "male";

// 1. ระบบคำนวณแบบ Universal (รองรับทุกแผน)
function calculateUniversal() {
    const age = parseInt(document.getElementById('ageInput').value) || 0;
    const planData = PLANS_DB[currentPlan];
    
    // ดึงเรทเบี้ยประกันจากฐานข้อมูล
    const totalRate = planData.rates.total[currentGender][age];
    
    if (!totalRate) {
        alert("ไม่พบเรทเบี้ยสำหรับอายุนี้");
        return;
    }

    const fSum = parseFloat(document.getElementById('sumInput').value.replace(/,/g, '')) || 0;
    
    // ตรวจสอบเงื่อนไขแบบ Dynamic (เด็ก vs ผู้ใหญ่)
    if (age <= 15 && fSum > planData.maxSumChild) {
        alert(`เด็กทำทุนสูงสุดได้ ${planData.maxSumChild.toLocaleString()} บาท`);
        return;
    }

    // คำนวณเบี้ย
    const discount = planData.getDiscount(fSum);
    const premium = Math.round((fSum / 1000) * (totalRate - discount));
    
    document.getElementById('premiumResult').innerText = premium.toLocaleString();
}

// 2. ระบบแชร์ข้อมูลผ่าน LINE LIFF (Share Target Picker)
async function shareViaLine() {
    const sum = document.getElementById('sumInput').value;
    const prem = document.getElementById('premiumResult').innerText;
    const planName = PLANS_DB[currentPlan].name;
    
    const message = `📊 สรุปแผน: ${planName}\n👤 เพศ: ${currentGender === 'male' ? 'ชาย' : 'หญิง'}\nทุนประกัน: ${sum} บาท\nออมเงิน: ${prem} บาท/ปี`;

    if (liff.isApiAvailable('shareTargetPicker')) {
        try {
            await liff.shareTargetPicker([{ type: "text", text: message }]);
            alert("แชร์ข้อมูลไปยังแชทเรียบร้อยแล้ว!");
        } catch (error) {
            console.log("ผู้ใช้ยกเลิกการแชร์ หรือเกิดข้อผิดพลาด", error);
        }
    } else {
        // กรณีไม่ได้เปิดผ่าน LIFF
        navigator.clipboard.writeText(message);
        alert("คัดลอกข้อความเรียบร้อยแล้ว (ไม่ได้เปิดผ่าน LINE)");
    }
}
