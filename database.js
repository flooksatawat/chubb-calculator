// database.js
const PLANS_DB = {
    "20CX": {
        name: "CI Extra Plus 20CX",
        desc: "ออมเงิน : ชดเชยโรคร้าย+วงเงินพิเศษ",
        type: "Packaged", // แบบสำเร็จรูป ห้ามแยกซื้ออนุสัญญา
        allowRiders: false,
        minAge: 0,
        maxAge: 65,
        maxSumAdult: 10000000,
        maxSumChild: 3000000,
        rates: {
            total: {
                male: [16.21, 16.33, 16.75, 16.96, /* ใส่เรทให้ครบตามอายุ 0-65 */ 20.00], 
                female: [14.39, 14.69, 14.84, 15.01, /* ใส่เรทให้ครบตามอายุ 0-65 */ 18.00]
            }
        },
        comRates: [0.30, 0.16, 0.10, 0.02, 0.01, 0.01, 0.01, 0.01],
        getDiscount: function(sum) {
            if (sum >= 5000000) return 1.5;
            if (sum >= 1000000) return 1.0;
            if (sum >= 800000) return 0.5;
            return 0;
        }
    },
    // สามารถเพิ่มแบบอื่นๆ เช่น 90/20, Term, Legacy ต่อท้ายได้เลย
};
