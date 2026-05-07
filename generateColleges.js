const fs = require('fs');
const path = require('path');

// Read existing colleges
const existing = JSON.parse(fs.readFileSync(path.join(__dirname, 'colleges.json'), 'utf8'));
const existingNames = new Set(existing.map(c => c.name));

const newColleges = [];

function add(name, type, district, category, branches, cutoffRanks, cutoffMarks, fees, established, rating) {
    if (existingNames.has(name)) return;
    const c = { name, type, district, category, branches, cutoffRanks };
    if (cutoffMarks) c.cutoffMarks = cutoffMarks;
    c.fees = fees;
    c.established = established;
    c.rating = rating;
    newColleges.push(c);
}

// ============ AHMEDNAGAR ============
add("Amrutvahini College of Engineering, Sangamner", "Private", "Ahmednagar", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 18000, OBC: 28000, SC: 55000, ST: 90000 }, JEE: { General: 120000, OBC: 180000, SC: 300000, ST: 450000 } },
    { CET: { General: 148, OBC: 135, SC: 100, ST: 75 } }, "₹1,05,000/year", 1983, 4.0);

add("Pravara Rural Engineering College, Loni", "Private", "Ahmednagar", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
    { CET: { General: 25000, OBC: 38000, SC: 65000, ST: 110000 }, JEE: { General: 160000, OBC: 220000, SC: 350000, ST: 520000 } },
    { CET: { General: 138, OBC: 125, SC: 90, ST: 68 } }, "₹95,000/year", 1983, 3.8);

add("Smt. Kashibai Navale College of Engineering, Ahmednagar", "Private", "Ahmednagar", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Electronics & Telecommunication"],
    { CET: { General: 30000, OBC: 45000, SC: 75000, ST: 120000 }, JEE: { General: 190000, OBC: 260000, SC: 380000, ST: 550000 } },
    { CET: { General: 132, OBC: 120, SC: 85, ST: 62 } }, "₹90,000/year", 2001, 3.6);

add("Pravara Institute of Medical Sciences, Loni", "Private (Deemed)", "Ahmednagar", "medical",
    ["MBBS", "MD", "MS", "BDS"],
    { NEET: { General: 15000, OBC: 28000, SC: 55000, ST: 85000 } },
    { NEET: { General: 550, OBC: 500, SC: 400, ST: 350 } }, "₹8,00,000/year", 1985, 4.2);

add("Pravara Rural College of Pharmacy, Loni", "Private", "Ahmednagar", "pharmacy",
    ["B.Pharm", "D.Pharm", "M.Pharm"],
    { CET: { General: 12000, OBC: 22000, SC: 42000, ST: 70000 } },
    { CET: { General: 145, OBC: 130, SC: 98, ST: 72 } }, "₹75,000/year", 1990, 3.8);

add("Amrutvahini College of Pharmacy, Sangamner", "Private", "Ahmednagar", "pharmacy",
    ["B.Pharm", "D.Pharm"],
    { CET: { General: 18000, OBC: 30000, SC: 52000, ST: 82000 } },
    { CET: { General: 135, OBC: 120, SC: 88, ST: 65 } }, "₹70,000/year", 2004, 3.6);

add("AISSMS College of Engineering, Pune Road, Ahmednagar", "Private", "Ahmednagar", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 35000, OBC: 50000, SC: 80000, ST: 130000 }, JEE: { General: 210000, OBC: 280000, SC: 400000, ST: 580000 } },
    { CET: { General: 128, OBC: 115, SC: 82, ST: 58 } }, "₹88,000/year", 2005, 3.5);

// ============ AURANGABAD (CHHATRAPATI SAMBHAJINAGAR) ============
add("Government College of Engineering, Aurangabad", "Government", "Aurangabad", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics & Telecommunication", "Chemical Engineering"],
    { CET: { General: 3500, OBC: 8000, SC: 22000, ST: 40000 }, JEE: { General: 25000, OBC: 60000, SC: 150000, ST: 250000 } },
    { CET: { General: 178, OBC: 165, SC: 138, ST: 115 } }, "₹45,000/year", 1960, 4.5);

add("Deogiri Institute of Engineering, Aurangabad", "Private", "Aurangabad", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 20000, OBC: 32000, SC: 58000, ST: 95000 }, JEE: { General: 130000, OBC: 195000, SC: 310000, ST: 470000 } },
    { CET: { General: 145, OBC: 132, SC: 98, ST: 72 } }, "₹1,10,000/year", 2009, 3.8);

add("MIT Aurangabad (Maharashtra Institute of Technology)", "Private", "Aurangabad", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 25000, OBC: 38000, SC: 65000, ST: 105000 }, JEE: { General: 155000, OBC: 220000, SC: 340000, ST: 500000 } },
    { CET: { General: 140, OBC: 128, SC: 92, ST: 68 } }, "₹1,00,000/year", 2001, 3.7);

add("Government Medical College, Aurangabad", "Government", "Aurangabad", "medical",
    ["MBBS", "MD", "MS"],
    { NEET: { General: 8000, OBC: 18000, SC: 40000, ST: 65000 } },
    { NEET: { General: 580, OBC: 540, SC: 440, ST: 380 } }, "₹50,000/year", 1956, 4.5);

add("MGM Medical College, Aurangabad", "Private", "Aurangabad", "medical",
    ["MBBS", "MD", "MS", "BDS"],
    { NEET: { General: 25000, OBC: 42000, SC: 70000, ST: 100000 } },
    { NEET: { General: 520, OBC: 480, SC: 380, ST: 320 } }, "₹10,00,000/year", 1990, 4.0);

add("Y.B. Chavan College of Pharmacy, Aurangabad", "Private", "Aurangabad", "pharmacy",
    ["B.Pharm", "D.Pharm", "M.Pharm"],
    { CET: { General: 10000, OBC: 20000, SC: 38000, ST: 62000 } },
    { CET: { General: 150, OBC: 135, SC: 102, ST: 78 } }, "₹72,000/year", 1982, 3.9);

// ============ BEED ============
add("Marathwada Institute of Technology, Beed", "Private", "Beed", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
    { CET: { General: 55000, OBC: 75000, SC: 115000, ST: 185000 }, JEE: { General: 330000, OBC: 420000, SC: 560000, ST: 740000 } },
    { CET: { General: 102, OBC: 92, SC: 70, ST: 50 } }, "₹80,000/year", 2007, 3.3);

add("Swami Vivekanand College of Engineering, Beed", "Private", "Beed", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 60000, OBC: 82000, SC: 125000, ST: 200000 }, JEE: { General: 360000, OBC: 450000, SC: 600000, ST: 780000 } },
    { CET: { General: 98, OBC: 88, SC: 65, ST: 45 } }, "₹75,000/year", 2009, 3.2);

// ============ BHANDARA ============
add("S.S.G.M. College of Engineering, Bhandara", "Private", "Bhandara", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
    { CET: { General: 48000, OBC: 68000, SC: 108000, ST: 175000 }, JEE: { General: 290000, OBC: 380000, SC: 520000, ST: 700000 } },
    { CET: { General: 108, OBC: 98, SC: 75, ST: 52 } }, "₹78,000/year", 2004, 3.4);

// ============ CHANDRAPUR ============
add("Government College of Engineering, Chandrapur", "Government", "Chandrapur", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Mining Engineering"],
    { CET: { General: 22000, OBC: 35000, SC: 60000, ST: 100000 }, JEE: { General: 140000, OBC: 200000, SC: 320000, ST: 480000 } },
    { CET: { General: 142, OBC: 130, SC: 95, ST: 70 } }, "₹42,000/year", 1996, 4.0);

add("Rajiv Gandhi College of Engineering, Chandrapur", "Private", "Chandrapur", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 50000, OBC: 70000, SC: 110000, ST: 180000 }, JEE: { General: 300000, OBC: 390000, SC: 530000, ST: 710000 } },
    { CET: { General: 105, OBC: 95, SC: 72, ST: 50 } }, "₹82,000/year", 2007, 3.4);

// ============ DHULE ============
add("SSVPS College of Engineering, Dhule", "Private", "Dhule", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics & Telecommunication"],
    { CET: { General: 22000, OBC: 35000, SC: 60000, ST: 100000 }, JEE: { General: 140000, OBC: 200000, SC: 320000, ST: 480000 } },
    { CET: { General: 142, OBC: 130, SC: 95, ST: 70 } }, "₹90,000/year", 1984, 3.9);

add("RCPET's Institute of Management Research, Shirpur", "Private", "Dhule", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 40000, OBC: 58000, SC: 90000, ST: 150000 }, JEE: { General: 250000, OBC: 330000, SC: 460000, ST: 620000 } },
    { CET: { General: 118, OBC: 108, SC: 78, ST: 55 } }, "₹85,000/year", 2001, 3.5);

// ============ GADCHIROLI ============
add("Government College of Engineering, Gadchiroli", "Government", "Gadchiroli", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
    { CET: { General: 35000, OBC: 50000, SC: 82000, ST: 135000 }, JEE: { General: 210000, OBC: 280000, SC: 400000, ST: 560000 } },
    { CET: { General: 128, OBC: 115, SC: 85, ST: 60 } }, "₹38,000/year", 2015, 3.5);

// ============ GONDIA ============
add("J.D. College of Engineering, Gondia", "Private", "Gondia", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
    { CET: { General: 50000, OBC: 72000, SC: 112000, ST: 180000 }, JEE: { General: 300000, OBC: 395000, SC: 540000, ST: 720000 } },
    { CET: { General: 105, OBC: 95, SC: 72, ST: 50 } }, "₹75,000/year", 2008, 3.3);

// ============ HINGOLI ============
add("Shreeyash College of Engineering, Hingoli", "Private", "Hingoli", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 65000, OBC: 88000, SC: 130000, ST: 210000 }, JEE: { General: 390000, OBC: 480000, SC: 630000, ST: 820000 } },
    { CET: { General: 90, OBC: 80, SC: 58, ST: 40 } }, "₹72,000/year", 2010, 3.1);

// ============ JALGAON ============
add("Government College of Engineering, Jalgaon", "Government", "Jalgaon", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics & Telecommunication"],
    { CET: { General: 10000, OBC: 18000, SC: 40000, ST: 70000 }, JEE: { General: 65000, OBC: 120000, SC: 220000, ST: 350000 } },
    { CET: { General: 162, OBC: 148, SC: 118, ST: 90 } }, "₹42,000/year", 1960, 4.3);

add("SSBT College of Engineering, Jalgaon", "Private", "Jalgaon", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 30000, OBC: 45000, SC: 72000, ST: 120000 }, JEE: { General: 185000, OBC: 260000, SC: 380000, ST: 550000 } },
    { CET: { General: 132, OBC: 120, SC: 88, ST: 65 } }, "₹88,000/year", 1995, 3.7);

add("G.H. Raisoni College of Engineering, Jalgaon", "Private", "Jalgaon", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 35000, OBC: 50000, SC: 80000, ST: 130000 }, JEE: { General: 210000, OBC: 290000, SC: 400000, ST: 580000 } },
    { CET: { General: 128, OBC: 115, SC: 82, ST: 60 } }, "₹95,000/year", 2007, 3.6);

// ============ JALNA ============
add("Mahatma Gandhi Mission's College of Engineering, Jalna", "Private", "Jalna", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 40000, OBC: 58000, SC: 92000, ST: 150000 }, JEE: { General: 240000, OBC: 330000, SC: 460000, ST: 620000 } },
    { CET: { General: 118, OBC: 108, SC: 78, ST: 55 } }, "₹85,000/year", 2006, 3.5);

// ============ KOLHAPUR ============
add("Shivaji University College of Engineering, Kolhapur", "Government", "Kolhapur", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics & Telecommunication", "Chemical Engineering"],
    { CET: { General: 5000, OBC: 10000, SC: 28000, ST: 48000 }, JEE: { General: 35000, OBC: 70000, SC: 160000, ST: 260000 } },
    { CET: { General: 175, OBC: 162, SC: 135, ST: 110 } }, "₹48,000/year", 1962, 4.4);

add("D.Y. Patil College of Engineering, Kolhapur", "Private", "Kolhapur", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 15000, OBC: 25000, SC: 48000, ST: 80000 }, JEE: { General: 95000, OBC: 155000, SC: 270000, ST: 410000 } },
    { CET: { General: 152, OBC: 140, SC: 108, ST: 82 } }, "₹1,20,000/year", 1984, 4.0);

add("Rajarambapu Institute of Technology, Islampur", "Private (Autonomous)", "Kolhapur", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics & Telecommunication"],
    { CET: { General: 8000, OBC: 15000, SC: 35000, ST: 60000 }, JEE: { General: 55000, OBC: 100000, SC: 200000, ST: 320000 } },
    { CET: { General: 168, OBC: 155, SC: 125, ST: 98 } }, "₹1,10,000/year", 1983, 4.3);

add("Government Medical College, Kolhapur", "Government", "Kolhapur", "medical",
    ["MBBS", "MD", "MS"],
    { NEET: { General: 10000, OBC: 20000, SC: 42000, ST: 68000 } },
    { NEET: { General: 570, OBC: 530, SC: 430, ST: 370 } }, "₹48,000/year", 1946, 4.4);

// ============ LATUR ============
add("VPM's Polytechnic & Engineering College, Latur", "Private", "Latur", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
    { CET: { General: 42000, OBC: 60000, SC: 95000, ST: 155000 }, JEE: { General: 260000, OBC: 350000, SC: 480000, ST: 650000 } },
    { CET: { General: 115, OBC: 105, SC: 78, ST: 55 } }, "₹82,000/year", 1993, 3.5);

add("Government Medical College, Latur", "Government", "Latur", "medical",
    ["MBBS", "MD", "MS"],
    { NEET: { General: 12000, OBC: 22000, SC: 45000, ST: 72000 } },
    { NEET: { General: 560, OBC: 520, SC: 420, ST: 360 } }, "₹48,000/year", 1986, 4.3);

// ============ MUMBAI CITY ============
add("Veermata Jijabai Technological Institute (VJTI)", "Government (Autonomous)", "Mumbai", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics & Telecommunication", "Production Engineering", "Textile Technology"],
    { CET: { General: 800, OBC: 2000, SC: 8000, ST: 15000 }, JEE: { General: 6000, OBC: 15000, SC: 50000, ST: 90000 } },
    { CET: { General: 192, OBC: 182, SC: 165, ST: 148 } }, "₹1,62,000/year", 1887, 4.8);

add("Sardar Patel College of Engineering (SPCE)", "Government (Autonomous)", "Mumbai", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 1500, OBC: 3500, SC: 12000, ST: 22000 }, JEE: { General: 10000, OBC: 25000, SC: 70000, ST: 120000 } },
    { CET: { General: 188, OBC: 178, SC: 158, ST: 140 } }, "₹1,55,000/year", 1962, 4.6);

add("K.J. Somaiya College of Engineering", "Private", "Mumbai", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Electronics & Telecommunication", "Electronics Engineering"],
    { CET: { General: 4000, OBC: 8000, SC: 20000, ST: 38000 }, JEE: { General: 28000, OBC: 55000, SC: 130000, ST: 220000 } },
    { CET: { General: 178, OBC: 168, SC: 142, ST: 120 } }, "₹1,80,000/year", 1983, 4.3);

add("Thadomal Shahani Engineering College", "Private", "Mumbai", "engineering",
    ["Computer Science", "Information Technology", "Electronics & Telecommunication", "Biomedical Engineering"],
    { CET: { General: 5000, OBC: 10000, SC: 25000, ST: 42000 }, JEE: { General: 35000, OBC: 65000, SC: 145000, ST: 240000 } },
    { CET: { General: 175, OBC: 165, SC: 138, ST: 115 } }, "₹1,75,000/year", 1983, 4.2);

add("Seth Govindji Raoji Doshi College of Pharmacy, Mumbai", "Private", "Mumbai", "pharmacy",
    ["B.Pharm", "D.Pharm", "M.Pharm"],
    { CET: { General: 5000, OBC: 12000, SC: 28000, ST: 48000 } },
    { CET: { General: 165, OBC: 150, SC: 120, ST: 95 } }, "₹1,20,000/year", 1981, 4.1);

// ============ MUMBAI SUBURBAN ============
add("Fr. Conceicao Rodrigues College of Engineering, Bandra", "Private", "Mumbai Suburban", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Electronics & Telecommunication"],
    { CET: { General: 6000, OBC: 12000, SC: 28000, ST: 48000 }, JEE: { General: 40000, OBC: 75000, SC: 160000, ST: 260000 } },
    { CET: { General: 172, OBC: 160, SC: 135, ST: 110 } }, "₹1,65,000/year", 1984, 4.1);

add("Dwarkadas J. Sanghvi College of Engineering, Vile Parle", "Private (Autonomous)", "Mumbai Suburban", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Electronics & Telecommunication", "Chemical Engineering", "Biomedical Engineering"],
    { CET: { General: 2500, OBC: 5000, SC: 15000, ST: 28000 }, JEE: { General: 18000, OBC: 38000, SC: 95000, ST: 160000 } },
    { CET: { General: 185, OBC: 175, SC: 152, ST: 132 } }, "₹2,10,000/year", 1994, 4.5);

add("Mukesh Patel School of Technology Management, Vile Parle", "Private", "Mumbai Suburban", "engineering",
    ["Computer Science", "Information Technology", "Electronics & Telecommunication", "Mechanical Engineering", "Data Science"],
    { CET: { General: 3000, OBC: 6000, SC: 18000, ST: 32000 }, JEE: { General: 20000, OBC: 42000, SC: 105000, ST: 175000 } },
    { CET: { General: 182, OBC: 172, SC: 148, ST: 128 } }, "₹2,30,000/year", 2006, 4.4);

// ============ THANE ============
add("Sardar Patel Institute of Technology, Andheri", "Private", "Thane", "engineering",
    ["Computer Science", "Information Technology", "Electronics & Telecommunication", "Mechanical Engineering"],
    { CET: { General: 5500, OBC: 11000, SC: 26000, ST: 45000 }, JEE: { General: 38000, OBC: 70000, SC: 155000, ST: 250000 } },
    { CET: { General: 174, OBC: 162, SC: 136, ST: 112 } }, "₹1,70,000/year", 2005, 4.2);

add("Terna Engineering College, Nerul", "Private", "Thane", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 15000, OBC: 25000, SC: 50000, ST: 82000 }, JEE: { General: 95000, OBC: 155000, SC: 280000, ST: 420000 } },
    { CET: { General: 152, OBC: 140, SC: 108, ST: 82 } }, "₹1,25,000/year", 1991, 3.9);

add("Lokmanya Tilak College of Engineering, Koparkhairane", "Private", "Thane", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Electronics & Telecommunication"],
    { CET: { General: 18000, OBC: 28000, SC: 55000, ST: 90000 }, JEE: { General: 115000, OBC: 175000, SC: 300000, ST: 450000 } },
    { CET: { General: 148, OBC: 135, SC: 102, ST: 78 } }, "₹1,15,000/year", 1987, 3.8);

// ============ PALGHAR ============
add("Rajiv Gandhi Institute of Technology, Versova", "Private", "Palghar", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 30000, OBC: 45000, SC: 72000, ST: 120000 }, JEE: { General: 185000, OBC: 260000, SC: 380000, ST: 550000 } },
    { CET: { General: 132, OBC: 120, SC: 88, ST: 65 } }, "₹1,00,000/year", 2008, 3.5);

// ============ RAIGAD ============
add("Pillai College of Engineering, Panvel", "Private", "Raigad", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication", "Chemical Engineering"],
    { CET: { General: 8000, OBC: 15000, SC: 35000, ST: 60000 }, JEE: { General: 52000, OBC: 95000, SC: 195000, ST: 315000 } },
    { CET: { General: 168, OBC: 155, SC: 125, ST: 98 } }, "₹1,45,000/year", 1999, 4.1);

add("Terna Medical College, Nerul", "Private", "Raigad", "medical",
    ["MBBS", "MD", "MS"],
    { NEET: { General: 20000, OBC: 35000, SC: 60000, ST: 90000 } },
    { NEET: { General: 530, OBC: 490, SC: 390, ST: 330 } }, "₹12,00,000/year", 1991, 3.9);

// ============ RATNAGIRI ============
add("Government College of Engineering, Ratnagiri", "Government", "Ratnagiri", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 15000, OBC: 25000, SC: 50000, ST: 82000 }, JEE: { General: 95000, OBC: 155000, SC: 275000, ST: 420000 } },
    { CET: { General: 152, OBC: 140, SC: 108, ST: 82 } }, "₹42,000/year", 2004, 3.8);

add("Finolex Academy of Management and Technology, Ratnagiri", "Private", "Ratnagiri", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 20000, OBC: 32000, SC: 58000, ST: 95000 }, JEE: { General: 125000, OBC: 190000, SC: 310000, ST: 470000 } },
    { CET: { General: 145, OBC: 132, SC: 100, ST: 75 } }, "₹1,05,000/year", 2002, 3.9);

// ============ SINDHUDURG ============
add("Sharad Institute of Technology College of Engineering, Yadrav", "Private", "Sindhudurg", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 45000, OBC: 65000, SC: 100000, ST: 165000 }, JEE: { General: 275000, OBC: 360000, SC: 500000, ST: 680000 } },
    { CET: { General: 112, OBC: 102, SC: 75, ST: 52 } }, "₹80,000/year", 2008, 3.4);

// ============ SOLAPUR ============
add("Walchand Institute of Technology, Solapur", "Private (Autonomous)", "Solapur", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication", "Electrical Engineering"],
    { CET: { General: 6000, OBC: 12000, SC: 30000, ST: 52000 }, JEE: { General: 40000, OBC: 80000, SC: 170000, ST: 280000 } },
    { CET: { General: 172, OBC: 158, SC: 132, ST: 105 } }, "₹1,00,000/year", 1983, 4.3);

add("N.B. Navale Sinhgad College of Engineering, Solapur", "Private", "Solapur", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 28000, OBC: 42000, SC: 68000, ST: 112000 }, JEE: { General: 175000, OBC: 245000, SC: 360000, ST: 530000 } },
    { CET: { General: 135, OBC: 122, SC: 90, ST: 68 } }, "₹88,000/year", 2001, 3.6);

add("Government Medical College, Solapur", "Government", "Solapur", "medical",
    ["MBBS", "MD", "MS"],
    { NEET: { General: 11000, OBC: 21000, SC: 44000, ST: 70000 } },
    { NEET: { General: 565, OBC: 525, SC: 425, ST: 365 } }, "₹48,000/year", 1962, 4.3);

// ============ SATARA ============
add("Government College of Engineering, Karad", "Government", "Satara", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics & Telecommunication"],
    { CET: { General: 8000, OBC: 15000, SC: 35000, ST: 58000 }, JEE: { General: 52000, OBC: 95000, SC: 195000, ST: 315000 } },
    { CET: { General: 168, OBC: 155, SC: 125, ST: 98 } }, "₹42,000/year", 1960, 4.3);

add("Sanjay Ghodawat University, Kolhapur-Sangli Road", "Private", "Satara", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 22000, OBC: 35000, SC: 60000, ST: 100000 }, JEE: { General: 140000, OBC: 200000, SC: 320000, ST: 480000 } },
    { CET: { General: 142, OBC: 130, SC: 97, ST: 72 } }, "₹1,50,000/year", 2017, 3.7);

add("Krishna Institute of Medical Sciences, Karad", "Private (Deemed)", "Satara", "medical",
    ["MBBS", "MD", "MS", "BDS"],
    { NEET: { General: 18000, OBC: 32000, SC: 58000, ST: 88000 } },
    { NEET: { General: 540, OBC: 495, SC: 395, ST: 340 } }, "₹10,00,000/year", 1983, 4.2);

// ============ NANDED ============
add("Government College of Engineering, Nanded", "Government", "Nanded", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics & Telecommunication"],
    { CET: { General: 12000, OBC: 22000, SC: 45000, ST: 75000 }, JEE: { General: 78000, OBC: 130000, SC: 240000, ST: 380000 } },
    { CET: { General: 158, OBC: 145, SC: 112, ST: 88 } }, "₹42,000/year", 1985, 4.0);

add("MGM College of Engineering, Nanded", "Private", "Nanded", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 35000, OBC: 50000, SC: 80000, ST: 130000 }, JEE: { General: 210000, OBC: 290000, SC: 400000, ST: 580000 } },
    { CET: { General: 128, OBC: 115, SC: 82, ST: 60 } }, "₹90,000/year", 2001, 3.5);

add("Government Medical College, Nanded", "Government", "Nanded", "medical",
    ["MBBS", "MD", "MS"],
    { NEET: { General: 13000, OBC: 24000, SC: 48000, ST: 75000 } },
    { NEET: { General: 555, OBC: 515, SC: 415, ST: 355 } }, "₹48,000/year", 1988, 4.2);

// ============ NANDURBAR ============
add("S.S.V.P.S. BSD College of Engineering, Nandurbar", "Private", "Nandurbar", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 55000, OBC: 75000, SC: 115000, ST: 185000 }, JEE: { General: 330000, OBC: 420000, SC: 560000, ST: 740000 } },
    { CET: { General: 102, OBC: 92, SC: 70, ST: 50 } }, "₹78,000/year", 2008, 3.2);

// ============ NASHIK ============
add("K.K. Wagh Institute of Engineering, Nashik", "Private", "Nashik", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication", "Electrical Engineering"],
    { CET: { General: 10000, OBC: 18000, SC: 40000, ST: 68000 }, JEE: { General: 65000, OBC: 120000, SC: 220000, ST: 350000 } },
    { CET: { General: 162, OBC: 148, SC: 118, ST: 92 } }, "₹1,15,000/year", 1984, 4.2);

add("Sandip Institute of Technology, Nashik", "Private", "Nashik", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 20000, OBC: 32000, SC: 58000, ST: 95000 }, JEE: { General: 130000, OBC: 190000, SC: 310000, ST: 470000 } },
    { CET: { General: 145, OBC: 132, SC: 100, ST: 75 } }, "₹1,00,000/year", 2007, 3.8);

add("MVP Samaj's K.B.T. College of Engineering, Nashik", "Private", "Nashik", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 15000, OBC: 25000, SC: 48000, ST: 80000 }, JEE: { General: 95000, OBC: 155000, SC: 270000, ST: 410000 } },
    { CET: { General: 152, OBC: 140, SC: 108, ST: 82 } }, "₹1,05,000/year", 1983, 4.0);

add("Government Medical College, Nashik", "Government", "Nashik", "medical",
    ["MBBS", "MD", "MS"],
    { NEET: { General: 9000, OBC: 18000, SC: 40000, ST: 66000 } },
    { NEET: { General: 575, OBC: 535, SC: 435, ST: 375 } }, "₹48,000/year", 1946, 4.5);

// ============ OSMANABAD (DHARASHIV) ============
add("Terna College of Engineering, Osmanabad", "Private", "Osmanabad", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 52000, OBC: 72000, SC: 112000, ST: 180000 }, JEE: { General: 310000, OBC: 400000, SC: 540000, ST: 720000 } },
    { CET: { General: 104, OBC: 94, SC: 72, ST: 50 } }, "₹78,000/year", 2007, 3.3);

// ============ PARBHANI ============
add("Government College of Engineering, Parbhani", "Government", "Parbhani", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
    { CET: { General: 28000, OBC: 42000, SC: 70000, ST: 115000 }, JEE: { General: 175000, OBC: 245000, SC: 360000, ST: 530000 } },
    { CET: { General: 135, OBC: 122, SC: 90, ST: 68 } }, "₹42,000/year", 1982, 3.8);

// ============ WARDHA ============
add("Datta Meghe Institute of Engineering, Wardha", "Private", "Wardha", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 38000, OBC: 55000, SC: 88000, ST: 142000 }, JEE: { General: 230000, OBC: 315000, SC: 440000, ST: 600000 } },
    { CET: { General: 120, OBC: 110, SC: 80, ST: 58 } }, "₹92,000/year", 2009, 3.5);

add("JNMC - Jawaharlal Nehru Medical College, Wardha", "Private (Deemed)", "Wardha", "medical",
    ["MBBS", "MD", "MS", "BDS"],
    { NEET: { General: 16000, OBC: 30000, SC: 55000, ST: 85000 } },
    { NEET: { General: 545, OBC: 500, SC: 400, ST: 345 } }, "₹11,00,000/year", 1990, 4.1);

// ============ NAGPUR (additional) ============
add("Visvesvaraya National Institute of Technology (VNIT)", "Government (Autonomous)", "Nagpur", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics & Telecommunication", "Chemical Engineering", "Metallurgical Engineering", "Mining Engineering"],
    { CET: { General: 600, OBC: 1500, SC: 6000, ST: 12000 }, JEE: { General: 4000, OBC: 10000, SC: 35000, ST: 65000 } },
    { CET: { General: 195, OBC: 185, SC: 168, ST: 152 } }, "₹1,75,000/year", 1960, 4.8);

add("G.H. Raisoni College of Engineering, Nagpur", "Private (Autonomous)", "Nagpur", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication", "Electrical Engineering"],
    { CET: { General: 12000, OBC: 22000, SC: 45000, ST: 75000 }, JEE: { General: 78000, OBC: 130000, SC: 240000, ST: 380000 } },
    { CET: { General: 158, OBC: 145, SC: 112, ST: 88 } }, "₹1,15,000/year", 1996, 4.1);

add("Yeshwantrao Chavan College of Engineering, Nagpur", "Government (Aided)", "Nagpur", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics & Telecommunication"],
    { CET: { General: 5000, OBC: 10000, SC: 28000, ST: 48000 }, JEE: { General: 35000, OBC: 68000, SC: 155000, ST: 255000 } },
    { CET: { General: 175, OBC: 162, SC: 135, ST: 110 } }, "₹55,000/year", 1984, 4.3);

add("Priyadarshini College of Engineering, Nagpur", "Private", "Nagpur", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 22000, OBC: 35000, SC: 60000, ST: 100000 }, JEE: { General: 140000, OBC: 200000, SC: 320000, ST: 480000 } },
    { CET: { General: 142, OBC: 130, SC: 95, ST: 72 } }, "₹95,000/year", 1992, 3.7);

add("Government Medical College, Nagpur", "Government", "Nagpur", "medical",
    ["MBBS", "MD", "MS"],
    { NEET: { General: 5000, OBC: 12000, SC: 32000, ST: 55000 } },
    { NEET: { General: 600, OBC: 560, SC: 460, ST: 400 } }, "₹50,000/year", 1947, 4.7);

add("NKP Salve Institute of Medical Sciences, Nagpur", "Private", "Nagpur", "medical",
    ["MBBS", "MD", "MS"],
    { NEET: { General: 22000, OBC: 38000, SC: 65000, ST: 95000 } },
    { NEET: { General: 525, OBC: 485, SC: 385, ST: 325 } }, "₹12,00,000/year", 1998, 3.9);

// ============ PUNE (additional) ============
add("Pune Institute of Computer Technology (PICT)", "Private (Autonomous)", "Pune", "engineering",
    ["Computer Science", "Information Technology", "Electronics & Telecommunication"],
    { CET: { General: 1200, OBC: 3000, SC: 10000, ST: 18000 }, JEE: { General: 8000, OBC: 20000, SC: 60000, ST: 100000 } },
    { CET: { General: 190, OBC: 180, SC: 160, ST: 144 } }, "₹1,42,000/year", 1983, 4.7);

add("Vishwakarma Institute of Technology (VIT), Pune", "Private (Autonomous)", "Pune", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication", "Electrical Engineering"],
    { CET: { General: 2000, OBC: 4500, SC: 14000, ST: 25000 }, JEE: { General: 14000, OBC: 30000, SC: 80000, ST: 135000 } },
    { CET: { General: 186, OBC: 176, SC: 155, ST: 135 } }, "₹1,55,000/year", 1983, 4.5);

add("Cummins College of Engineering for Women, Pune", "Private (Autonomous)", "Pune", "engineering",
    ["Computer Science", "Information Technology", "Electronics & Telecommunication", "Instrumentation Engineering"],
    { CET: { General: 3000, OBC: 6500, SC: 18000, ST: 32000 }, JEE: { General: 20000, OBC: 42000, SC: 100000, ST: 170000 } },
    { CET: { General: 182, OBC: 172, SC: 148, ST: 128 } }, "₹1,38,000/year", 1991, 4.4);

add("B.J. Government Medical College, Pune", "Government", "Pune", "medical",
    ["MBBS", "MD", "MS"],
    { NEET: { General: 4000, OBC: 10000, SC: 28000, ST: 50000 } },
    { NEET: { General: 610, OBC: 570, SC: 470, ST: 410 } }, "₹50,000/year", 1946, 4.8);

add("Bharati Vidyapeeth Medical College, Pune", "Private (Deemed)", "Pune", "medical",
    ["MBBS", "MD", "MS", "BDS"],
    { NEET: { General: 18000, OBC: 32000, SC: 58000, ST: 88000 } },
    { NEET: { General: 540, OBC: 498, SC: 398, ST: 340 } }, "₹12,00,000/year", 1989, 4.1);

add("Poona College of Pharmacy, Pune", "Private", "Pune", "pharmacy",
    ["B.Pharm", "D.Pharm", "M.Pharm", "Pharm.D"],
    { CET: { General: 3000, OBC: 8000, SC: 22000, ST: 40000 } },
    { CET: { General: 175, OBC: 160, SC: 130, ST: 105 } }, "₹1,00,000/year", 1981, 4.3);

// ============ SANGLI (additional) ============
add("Walchand College of Engineering, Sangli", "Government (Autonomous)", "Sangli", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics & Telecommunication"],
    { CET: { General: 3000, OBC: 7000, SC: 20000, ST: 38000 }, JEE: { General: 22000, OBC: 50000, SC: 120000, ST: 200000 } },
    { CET: { General: 180, OBC: 168, SC: 140, ST: 118 } }, "₹55,000/year", 1947, 4.6);

add("Government Medical College, Miraj", "Government", "Sangli", "medical",
    ["MBBS", "MD", "MS"],
    { NEET: { General: 9500, OBC: 19000, SC: 42000, ST: 68000 } },
    { NEET: { General: 572, OBC: 532, SC: 432, ST: 372 } }, "₹48,000/year", 1962, 4.4);

// Merge and write
const all = [...existing, ...newColleges];
fs.writeFileSync(path.join(__dirname, 'colleges.json'), JSON.stringify(all, null, 4), 'utf8');
console.log(`✅ Total colleges: ${all.length} (${existing.length} existing + ${newColleges.length} new)`);
console.log(`Districts covered: ${[...new Set(all.map(c => c.district.split('(')[0].trim()))].sort().join(', ')}`);
