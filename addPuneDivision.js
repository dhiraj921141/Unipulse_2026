const fs = require('fs');
const path = require('path');

const existing = JSON.parse(fs.readFileSync(path.join(__dirname, 'colleges.json'), 'utf8'));
const existingNames = new Set(existing.map(c => c.name));
const newColleges = [];

function add(name, type, district, category, branches, cutoffRanks, cutoffMarks, fees, established, rating) {
    if (existingNames.has(name)) return;
    newColleges.push({ name, type, district, category, branches, cutoffRanks, cutoffMarks: cutoffMarks || undefined, fees, established, rating });
}

// ==================== PUNE DISTRICT ====================

// --- Pune City ---
add("Savitribai Phule Pune University Department of Technology", "Government", "Pune", "engineering",
    ["Computer Science", "Information Technology", "Electronics & Telecommunication"],
    { CET: { General: 2000, OBC: 4500, SC: 14000, ST: 25000 }, JEE: { General: 14000, OBC: 30000, SC: 80000, ST: 135000 } },
    { CET: { General: 186, OBC: 176, SC: 155, ST: 135 } }, "₹52,000/year", 1970, 4.5);

add("Army Institute of Technology, Pune", "Private", "Pune", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Electronics & Telecommunication"],
    { CET: { General: 3500, OBC: 7000, SC: 20000, ST: 35000 }, JEE: { General: 22000, OBC: 48000, SC: 115000, ST: 190000 } },
    { CET: { General: 180, OBC: 170, SC: 145, ST: 122 } }, "₹1,35,000/year", 1994, 4.3);

add("Maharashtra Institute of Technology (MIT), Pune", "Private", "Pune", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication", "Electrical Engineering"],
    { CET: { General: 5000, OBC: 10000, SC: 28000, ST: 48000 }, JEE: { General: 35000, OBC: 65000, SC: 155000, ST: 255000 } },
    { CET: { General: 175, OBC: 162, SC: 135, ST: 110 } }, "₹1,45,000/year", 1983, 4.2);

add("Sinhgad College of Engineering, Vadgaon", "Private", "Pune", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication", "Electrical Engineering"],
    { CET: { General: 8000, OBC: 15000, SC: 35000, ST: 60000 }, JEE: { General: 52000, OBC: 95000, SC: 195000, ST: 315000 } },
    { CET: { General: 168, OBC: 155, SC: 125, ST: 98 } }, "₹1,20,000/year", 1996, 4.0);

add("Sinhgad Institute of Technology, Lonavala", "Private", "Pune (Lonavala)", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 30000, OBC: 45000, SC: 72000, ST: 120000 }, JEE: { General: 185000, OBC: 260000, SC: 380000, ST: 550000 } },
    { CET: { General: 132, OBC: 120, SC: 88, ST: 65 } }, "₹95,000/year", 2002, 3.6);

add("Marathwada Mitra Mandal's College of Engineering, Pune", "Private", "Pune", "engineering",
    ["Computer Science", "Information Technology", "Electronics & Telecommunication", "Mechanical Engineering"],
    { CET: { General: 10000, OBC: 18000, SC: 40000, ST: 68000 }, JEE: { General: 65000, OBC: 120000, SC: 220000, ST: 350000 } },
    { CET: { General: 162, OBC: 148, SC: 118, ST: 92 } }, "₹1,15,000/year", 2000, 3.9);

add("Zeal College of Engineering and Research, Pune", "Private", "Pune", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 22000, OBC: 35000, SC: 60000, ST: 100000 }, JEE: { General: 140000, OBC: 200000, SC: 320000, ST: 480000 } },
    { CET: { General: 142, OBC: 130, SC: 95, ST: 72 } }, "₹1,05,000/year", 2007, 3.7);

add("JSPM's Rajarshi Shahu College of Engineering, Pune", "Private", "Pune", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Electronics & Telecommunication", "Civil Engineering"],
    { CET: { General: 12000, OBC: 22000, SC: 45000, ST: 75000 }, JEE: { General: 78000, OBC: 130000, SC: 240000, ST: 380000 } },
    { CET: { General: 158, OBC: 145, SC: 112, ST: 88 } }, "₹1,10,000/year", 2001, 3.8);

add("Dr. D.Y. Patil Institute of Technology, Pimpri", "Private", "Pune", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 15000, OBC: 25000, SC: 50000, ST: 82000 }, JEE: { General: 95000, OBC: 155000, SC: 270000, ST: 410000 } },
    { CET: { General: 152, OBC: 140, SC: 108, ST: 82 } }, "₹1,25,000/year", 2002, 3.8);

add("NBN Sinhgad School of Engineering, Ambegaon", "Private", "Pune (Ambegaon)", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
    { CET: { General: 35000, OBC: 50000, SC: 80000, ST: 130000 }, JEE: { General: 210000, OBC: 290000, SC: 400000, ST: 580000 } },
    { CET: { General: 128, OBC: 115, SC: 82, ST: 60 } }, "₹90,000/year", 2005, 3.5);

add("G.H. Raisoni College of Engineering and Management, Pune", "Private", "Pune", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Electronics & Telecommunication"],
    { CET: { General: 20000, OBC: 32000, SC: 58000, ST: 95000 }, JEE: { General: 130000, OBC: 190000, SC: 310000, ST: 470000 } },
    { CET: { General: 145, OBC: 132, SC: 100, ST: 75 } }, "₹1,08,000/year", 2008, 3.7);

add("Indira College of Engineering and Management, Pune", "Private", "Pune", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 25000, OBC: 38000, SC: 65000, ST: 108000 }, JEE: { General: 155000, OBC: 220000, SC: 340000, ST: 500000 } },
    { CET: { General: 138, OBC: 125, SC: 92, ST: 68 } }, "₹1,02,000/year", 2007, 3.6);

add("Genba Sopanrao Moze College of Engineering, Balewadi", "Private", "Pune", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering"],
    { CET: { General: 40000, OBC: 58000, SC: 90000, ST: 150000 }, JEE: { General: 250000, OBC: 330000, SC: 460000, ST: 620000 } },
    { CET: { General: 118, OBC: 108, SC: 78, ST: 55 } }, "₹88,000/year", 2009, 3.4);

// --- Pune Rural ---
add("Alandi College of Engineering, Alandi (Devachi)", "Private", "Pune (Alandi)", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 50000, OBC: 70000, SC: 110000, ST: 180000 }, JEE: { General: 300000, OBC: 390000, SC: 530000, ST: 710000 } },
    { CET: { General: 105, OBC: 95, SC: 72, ST: 50 } }, "₹82,000/year", 2010, 3.3);

add("Smt. Kashibai Navale College of Engineering, Vadgaon", "Private", "Pune (Vadgaon)", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 6000, OBC: 12000, SC: 30000, ST: 52000 }, JEE: { General: 40000, OBC: 80000, SC: 170000, ST: 280000 } },
    { CET: { General: 172, OBC: 158, SC: 132, ST: 105 } }, "₹1,28,000/year", 2001, 4.1);

add("Jayawantrao Sawant College of Engineering, Hadapsar", "Private", "Pune (Hadapsar)", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 18000, OBC: 28000, SC: 55000, ST: 90000 }, JEE: { General: 115000, OBC: 175000, SC: 300000, ST: 450000 } },
    { CET: { General: 148, OBC: 135, SC: 102, ST: 78 } }, "₹1,05,000/year", 2001, 3.7);

add("Siddhant College of Engineering, Sudumbare (Maval)", "Private", "Pune (Maval)", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 55000, OBC: 75000, SC: 115000, ST: 185000 }, JEE: { General: 330000, OBC: 420000, SC: 560000, ST: 740000 } },
    { CET: { General: 102, OBC: 92, SC: 70, ST: 50 } }, "₹78,000/year", 2008, 3.2);

add("Sinhgad Academy of Engineering, Kondhwa", "Private", "Pune (Kondhwa)", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Electronics & Telecommunication"],
    { CET: { General: 15000, OBC: 25000, SC: 50000, ST: 82000 }, JEE: { General: 95000, OBC: 155000, SC: 270000, ST: 410000 } },
    { CET: { General: 152, OBC: 140, SC: 108, ST: 82 } }, "₹1,12,000/year", 2001, 3.8);

add("AISSMS Institute of Information Technology, Pune", "Private", "Pune", "engineering",
    ["Computer Science", "Information Technology", "Electronics & Telecommunication"],
    { CET: { General: 4000, OBC: 8500, SC: 22000, ST: 38000 }, JEE: { General: 28000, OBC: 55000, SC: 130000, ST: 215000 } },
    { CET: { General: 178, OBC: 168, SC: 142, ST: 118 } }, "₹1,32,000/year", 1999, 4.2);

add("BVDU College of Engineering, Pune", "Private (Deemed)", "Pune", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication", "Electrical Engineering"],
    { CET: { General: 7000, OBC: 14000, SC: 32000, ST: 55000 }, JEE: { General: 48000, OBC: 90000, SC: 180000, ST: 295000 } },
    { CET: { General: 170, OBC: 158, SC: 130, ST: 105 } }, "₹1,50,000/year", 1983, 4.1);

add("Pimpri Chinchwad College of Engineering, Nigdi", "Private", "Pune (Pimpri-Chinchwad)", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication", "Electrical Engineering"],
    { CET: { General: 5500, OBC: 11000, SC: 28000, ST: 48000 }, JEE: { General: 38000, OBC: 72000, SC: 158000, ST: 255000 } },
    { CET: { General: 174, OBC: 162, SC: 135, ST: 110 } }, "₹1,18,000/year", 1990, 4.2);

// --- Pune Rural (Baramati, Junnar, Shirur, Indapur, Bhor) ---
add("Vidya Pratishthan's Kamalnayan Bajaj Institute of Engg, Baramati", "Private", "Pune (Baramati)", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics & Telecommunication"],
    { CET: { General: 20000, OBC: 32000, SC: 58000, ST: 95000 }, JEE: { General: 130000, OBC: 190000, SC: 310000, ST: 470000 } },
    { CET: { General: 145, OBC: 132, SC: 100, ST: 75 } }, "₹95,000/year", 1983, 3.9);

add("Sharadchandra Pawar College of Engineering, Dumbarwadi (Junnar)", "Private", "Pune (Junnar)", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 60000, OBC: 82000, SC: 125000, ST: 200000 }, JEE: { General: 360000, OBC: 450000, SC: 600000, ST: 780000 } },
    { CET: { General: 95, OBC: 85, SC: 62, ST: 42 } }, "₹72,000/year", 2010, 3.1);

add("Sinhgad Institute of Technology & Science, Narhe", "Private", "Pune (Narhe)", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Electronics & Telecommunication"],
    { CET: { General: 12000, OBC: 22000, SC: 45000, ST: 75000 }, JEE: { General: 78000, OBC: 130000, SC: 240000, ST: 380000 } },
    { CET: { General: 158, OBC: 145, SC: 112, ST: 88 } }, "₹1,10,000/year", 2002, 3.8);

add("MAEER's MIT College of Engineering, Kothrud", "Private", "Pune", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 3000, OBC: 6500, SC: 18000, ST: 32000 }, JEE: { General: 20000, OBC: 42000, SC: 105000, ST: 175000 } },
    { CET: { General: 182, OBC: 172, SC: 148, ST: 128 } }, "₹1,48,000/year", 1983, 4.4);

// --- Pune Medical & Pharmacy ---
add("Armed Forces Medical College (AFMC), Pune", "Government", "Pune", "medical",
    ["MBBS", "MD", "MS"],
    { NEET: { General: 200, OBC: 800, SC: 3000, ST: 5000 } },
    { NEET: { General: 690, OBC: 665, SC: 600, ST: 560 } }, "₹56,000/year", 1948, 4.9);

add("Dr. D.Y. Patil Medical College, Pimpri", "Private (Deemed)", "Pune", "medical",
    ["MBBS", "MD", "MS", "BDS"],
    { NEET: { General: 20000, OBC: 35000, SC: 60000, ST: 90000 } },
    { NEET: { General: 530, OBC: 490, SC: 390, ST: 330 } }, "₹15,00,000/year", 1996, 4.0);

add("Sassoon General Hospital / GMC Pune", "Government", "Pune", "medical",
    ["MBBS", "MD", "MS"],
    { NEET: { General: 3500, OBC: 8000, SC: 25000, ST: 45000 } },
    { NEET: { General: 615, OBC: 575, SC: 475, ST: 415 } }, "₹48,000/year", 1946, 4.7);

add("Symbiosis Medical College for Women, Pune", "Private (Deemed)", "Pune", "medical",
    ["MBBS"],
    { NEET: { General: 15000, OBC: 28000, SC: 52000, ST: 80000 } },
    { NEET: { General: 550, OBC: 510, SC: 410, ST: 350 } }, "₹18,00,000/year", 2020, 4.0);

add("Sinhgad Dental College and Hospital, Pune", "Private", "Pune", "medical",
    ["BDS", "MDS"],
    { NEET: { General: 40000, OBC: 60000, SC: 90000, ST: 130000 } },
    { NEET: { General: 440, OBC: 400, SC: 320, ST: 270 } }, "₹5,00,000/year", 2002, 3.6);

add("Maharashtra Institute of Pharmacy, Pune", "Private", "Pune", "pharmacy",
    ["B.Pharm", "D.Pharm", "M.Pharm"],
    { CET: { General: 5000, OBC: 12000, SC: 28000, ST: 48000 } },
    { CET: { General: 165, OBC: 150, SC: 120, ST: 95 } }, "₹1,00,000/year", 1981, 4.1);

add("Sinhgad College of Pharmacy, Vadgaon", "Private", "Pune", "pharmacy",
    ["B.Pharm", "D.Pharm", "M.Pharm"],
    { CET: { General: 8000, OBC: 16000, SC: 35000, ST: 58000 } },
    { CET: { General: 160, OBC: 145, SC: 115, ST: 90 } }, "₹90,000/year", 1998, 3.9);

add("Dr. D.Y. Patil College of Pharmacy, Akurdi", "Private", "Pune", "pharmacy",
    ["B.Pharm", "D.Pharm", "M.Pharm", "Pharm.D"],
    { CET: { General: 6000, OBC: 14000, SC: 32000, ST: 52000 } },
    { CET: { General: 162, OBC: 148, SC: 118, ST: 92 } }, "₹1,10,000/year", 2000, 4.0);

add("JSPM's Charak College of Pharmacy, Wagholi", "Private", "Pune (Wagholi)", "pharmacy",
    ["B.Pharm", "D.Pharm"],
    { CET: { General: 15000, OBC: 25000, SC: 48000, ST: 78000 } },
    { CET: { General: 148, OBC: 135, SC: 105, ST: 80 } }, "₹78,000/year", 2008, 3.5);

add("Bharati Vidyapeeth College of Pharmacy, Kolhapur Road", "Private", "Pune", "pharmacy",
    ["B.Pharm", "D.Pharm", "M.Pharm"],
    { CET: { General: 4000, OBC: 10000, SC: 25000, ST: 42000 } },
    { CET: { General: 170, OBC: 155, SC: 125, ST: 100 } }, "₹1,05,000/year", 1985, 4.2);

// ==================== SATARA DISTRICT ====================

add("Annasaheb Dange College of Engineering, Ashta", "Private", "Satara (Ashta)", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 18000, OBC: 28000, SC: 55000, ST: 90000 }, JEE: { General: 115000, OBC: 175000, SC: 300000, ST: 450000 } },
    { CET: { General: 148, OBC: 135, SC: 102, ST: 78 } }, "₹95,000/year", 1999, 3.8);

add("Padmabhooshan Vasantdada Patil Institute of Technology, Budhgaon", "Private", "Satara (Budhgaon)", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 25000, OBC: 38000, SC: 65000, ST: 108000 }, JEE: { General: 155000, OBC: 220000, SC: 340000, ST: 500000 } },
    { CET: { General: 138, OBC: 125, SC: 92, ST: 68 } }, "₹88,000/year", 2001, 3.6);

add("Satara College of Engineering, Satara", "Private", "Satara", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
    { CET: { General: 40000, OBC: 58000, SC: 90000, ST: 150000 }, JEE: { General: 250000, OBC: 330000, SC: 460000, ST: 620000 } },
    { CET: { General: 118, OBC: 108, SC: 78, ST: 55 } }, "₹82,000/year", 2008, 3.4);

add("Sanjeevan Engineering and Technology Institute, Panhala", "Private", "Satara (Panhala)", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 52000, OBC: 72000, SC: 112000, ST: 180000 }, JEE: { General: 310000, OBC: 400000, SC: 540000, ST: 720000 } },
    { CET: { General: 104, OBC: 94, SC: 72, ST: 50 } }, "₹75,000/year", 2010, 3.2);

add("Yashoda Technical Campus, Satara", "Private", "Satara", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
    { CET: { General: 48000, OBC: 68000, SC: 105000, ST: 170000 }, JEE: { General: 290000, OBC: 380000, SC: 520000, ST: 700000 } },
    { CET: { General: 108, OBC: 98, SC: 75, ST: 52 } }, "₹78,000/year", 2009, 3.3);

add("Sinhgad College of Engineering, Korti (Pandharpur Road)", "Private", "Satara (Korti)", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 55000, OBC: 75000, SC: 115000, ST: 185000 }, JEE: { General: 330000, OBC: 420000, SC: 560000, ST: 740000 } },
    { CET: { General: 102, OBC: 92, SC: 70, ST: 50 } }, "₹72,000/year", 2012, 3.1);

add("Krishna Institute of Pharmacy, Karad", "Private", "Satara (Karad)", "pharmacy",
    ["B.Pharm", "D.Pharm", "M.Pharm", "Pharm.D"],
    { CET: { General: 5000, OBC: 12000, SC: 28000, ST: 48000 } },
    { CET: { General: 165, OBC: 150, SC: 120, ST: 95 } }, "₹95,000/year", 2000, 4.1);

add("Satara College of Pharmacy, Satara", "Private", "Satara", "pharmacy",
    ["B.Pharm", "D.Pharm"],
    { CET: { General: 18000, OBC: 30000, SC: 55000, ST: 88000 } },
    { CET: { General: 140, OBC: 128, SC: 95, ST: 72 } }, "₹68,000/year", 2005, 3.5);

add("Krishna Institute of Nursing, Karad", "Private (Deemed)", "Satara (Karad)", "medical",
    ["B.Sc Nursing", "M.Sc Nursing", "GNM"],
    { NEET: { General: 22000, OBC: 38000, SC: 65000, ST: 95000 } },
    { NEET: { General: 520, OBC: 480, SC: 380, ST: 320 } }, "₹6,00,000/year", 1998, 3.9);

// ==================== SANGLI DISTRICT ====================

add("Tatyasaheb Kore Institute of Engineering, Warananagar", "Private", "Sangli (Warananagar)", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication", "Electrical Engineering"],
    { CET: { General: 10000, OBC: 18000, SC: 40000, ST: 68000 }, JEE: { General: 65000, OBC: 120000, SC: 220000, ST: 350000 } },
    { CET: { General: 162, OBC: 148, SC: 118, ST: 92 } }, "₹1,00,000/year", 1983, 4.1);

add("Bharati Vidyapeeth's College of Engineering, Sangli", "Private", "Sangli", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 15000, OBC: 25000, SC: 50000, ST: 82000 }, JEE: { General: 95000, OBC: 155000, SC: 270000, ST: 410000 } },
    { CET: { General: 152, OBC: 140, SC: 108, ST: 82 } }, "₹1,05,000/year", 1998, 3.8);

add("D.Y. Patil College of Engineering, Kasaba Bawada, Kolhapur Road", "Private", "Sangli", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 35000, OBC: 50000, SC: 80000, ST: 130000 }, JEE: { General: 210000, OBC: 290000, SC: 400000, ST: 580000 } },
    { CET: { General: 128, OBC: 115, SC: 82, ST: 60 } }, "₹88,000/year", 2005, 3.5);

add("Ashokrao Mane Group of Institutions, Vathar", "Private", "Sangli (Vathar)", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
    { CET: { General: 45000, OBC: 65000, SC: 100000, ST: 165000 }, JEE: { General: 275000, OBC: 360000, SC: 500000, ST: 680000 } },
    { CET: { General: 112, OBC: 102, SC: 75, ST: 52 } }, "₹78,000/year", 2008, 3.3);

add("Yashwant College of Engineering, Sangli (Wadi Ratnagiri Road)", "Private", "Sangli", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 55000, OBC: 75000, SC: 115000, ST: 185000 }, JEE: { General: 330000, OBC: 420000, SC: 560000, ST: 740000 } },
    { CET: { General: 102, OBC: 92, SC: 70, ST: 50 } }, "₹72,000/year", 2010, 3.1);

add("Sangli Miraj Medical College (Government)", "Government", "Sangli", "medical",
    ["MBBS", "MD", "MS"],
    { NEET: { General: 8500, OBC: 17000, SC: 38000, ST: 62000 } },
    { NEET: { General: 580, OBC: 540, SC: 440, ST: 380 } }, "₹48,000/year", 1962, 4.4);

add("Bharati Vidyapeeth's Medical College, Sangli", "Private", "Sangli", "medical",
    ["MBBS", "MD", "MS", "BDS"],
    { NEET: { General: 22000, OBC: 38000, SC: 65000, ST: 95000 } },
    { NEET: { General: 525, OBC: 485, SC: 385, ST: 325 } }, "₹12,00,000/year", 1989, 3.9);

add("Appasaheb Birnale College of Pharmacy, Sangli", "Private", "Sangli", "pharmacy",
    ["B.Pharm", "D.Pharm", "M.Pharm"],
    { CET: { General: 8000, OBC: 16000, SC: 35000, ST: 58000 } },
    { CET: { General: 160, OBC: 145, SC: 115, ST: 90 } }, "₹72,000/year", 1990, 3.8);

add("Government College of Pharmacy, Karad", "Government", "Sangli (Karad)", "pharmacy",
    ["B.Pharm", "M.Pharm"],
    { CET: { General: 2000, OBC: 5000, SC: 15000, ST: 28000 } },
    { CET: { General: 180, OBC: 168, SC: 140, ST: 115 } }, "₹25,000/year", 1965, 4.3);

// ==================== KOLHAPUR DISTRICT ====================

add("KIT's College of Engineering, Kolhapur", "Private", "Kolhapur", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication"],
    { CET: { General: 12000, OBC: 22000, SC: 45000, ST: 75000 }, JEE: { General: 78000, OBC: 130000, SC: 240000, ST: 380000 } },
    { CET: { General: 158, OBC: 145, SC: 112, ST: 88 } }, "₹1,05,000/year", 1983, 4.0);

add("Sanjay Ghodawat Group of Institutions, Atigre", "Private", "Kolhapur (Atigre)", "engineering",
    ["Computer Science", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Electronics & Telecommunication", "Electrical Engineering"],
    { CET: { General: 18000, OBC: 28000, SC: 55000, ST: 90000 }, JEE: { General: 115000, OBC: 175000, SC: 300000, ST: 450000 } },
    { CET: { General: 148, OBC: 135, SC: 102, ST: 78 } }, "₹1,15,000/year", 2009, 3.8);

add("Kolhapur Institute of Technology, Kolhapur", "Private", "Kolhapur", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Electronics & Telecommunication"],
    { CET: { General: 20000, OBC: 32000, SC: 58000, ST: 95000 }, JEE: { General: 130000, OBC: 190000, SC: 310000, ST: 470000 } },
    { CET: { General: 145, OBC: 132, SC: 100, ST: 75 } }, "₹98,000/year", 1993, 3.7);

add("Sharad Institute of Technology, College of Engineering, Ichalkaranji", "Private", "Kolhapur (Ichalkaranji)", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Textile Technology"],
    { CET: { General: 30000, OBC: 45000, SC: 72000, ST: 120000 }, JEE: { General: 185000, OBC: 260000, SC: 380000, ST: 550000 } },
    { CET: { General: 132, OBC: 120, SC: 88, ST: 65 } }, "₹85,000/year", 2001, 3.6);

add("Dattajirao Kadam Technical Education Society's Engineering College, Ichalkaranji", "Private", "Kolhapur (Ichalkaranji)", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 42000, OBC: 60000, SC: 95000, ST: 155000 }, JEE: { General: 260000, OBC: 350000, SC: 480000, ST: 650000 } },
    { CET: { General: 115, OBC: 105, SC: 78, ST: 55 } }, "₹78,000/year", 2005, 3.4);

add("Annasaheb Dange College of Engineering, Ashta (Walwa)", "Private", "Kolhapur (Ashta)", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
    { CET: { General: 22000, OBC: 35000, SC: 60000, ST: 100000 }, JEE: { General: 140000, OBC: 200000, SC: 320000, ST: 480000 } },
    { CET: { General: 142, OBC: 130, SC: 95, ST: 72 } }, "₹92,000/year", 2000, 3.7);

add("Chhatrapati Shivaji Maharaj Institute of Technology, Panvel Road, Kolhapur", "Private", "Kolhapur", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 48000, OBC: 68000, SC: 105000, ST: 170000 }, JEE: { General: 290000, OBC: 380000, SC: 520000, ST: 700000 } },
    { CET: { General: 108, OBC: 98, SC: 75, ST: 52 } }, "₹75,000/year", 2009, 3.3);

add("Rajaram College of Pharmacy, Kolhapur", "Private", "Kolhapur", "pharmacy",
    ["B.Pharm", "D.Pharm", "M.Pharm"],
    { CET: { General: 6000, OBC: 14000, SC: 32000, ST: 52000 } },
    { CET: { General: 162, OBC: 148, SC: 118, ST: 92 } }, "₹78,000/year", 1990, 3.9);

add("D.Y. Patil College of Pharmacy, Kolhapur", "Private", "Kolhapur", "pharmacy",
    ["B.Pharm", "D.Pharm", "M.Pharm", "Pharm.D"],
    { CET: { General: 8000, OBC: 16000, SC: 35000, ST: 58000 } },
    { CET: { General: 160, OBC: 145, SC: 115, ST: 90 } }, "₹85,000/year", 2002, 3.7);

add("Sanjay Ghodawat Group - Pharmacy, Atigre", "Private", "Kolhapur (Atigre)", "pharmacy",
    ["B.Pharm", "D.Pharm"],
    { CET: { General: 12000, OBC: 22000, SC: 42000, ST: 68000 } },
    { CET: { General: 150, OBC: 135, SC: 105, ST: 80 } }, "₹80,000/year", 2010, 3.6);

add("D.Y. Patil Medical College, Kolhapur", "Private (Deemed)", "Kolhapur", "medical",
    ["MBBS", "MD", "MS", "BDS"],
    { NEET: { General: 18000, OBC: 32000, SC: 58000, ST: 88000 } },
    { NEET: { General: 540, OBC: 498, SC: 398, ST: 340 } }, "₹14,00,000/year", 1996, 4.0);

add("Rajaram Medical College (Government), Kolhapur", "Government", "Kolhapur", "medical",
    ["MBBS", "MD", "MS"],
    { NEET: { General: 9000, OBC: 18000, SC: 40000, ST: 65000 } },
    { NEET: { General: 575, OBC: 535, SC: 435, ST: 375 } }, "₹48,000/year", 1946, 4.5);

// ==================== SOLAPUR DISTRICT ====================

add("Siddheshwar Women's College of Engineering, Solapur", "Private", "Solapur", "engineering",
    ["Computer Science", "Information Technology", "Electronics & Telecommunication"],
    { CET: { General: 35000, OBC: 50000, SC: 80000, ST: 130000 }, JEE: { General: 210000, OBC: 290000, SC: 400000, ST: 580000 } },
    { CET: { General: 128, OBC: 115, SC: 82, ST: 60 } }, "₹82,000/year", 2005, 3.5);

add("Punyashlok Ahilyadevi Holkar Solapur University Engineering College", "Government", "Solapur", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
    { CET: { General: 15000, OBC: 25000, SC: 50000, ST: 82000 }, JEE: { General: 95000, OBC: 155000, SC: 275000, ST: 420000 } },
    { CET: { General: 152, OBC: 140, SC: 108, ST: 82 } }, "₹45,000/year", 2012, 3.7);

add("Fabtech College of Engineering and Research, Sangola", "Private", "Solapur (Sangola)", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 55000, OBC: 75000, SC: 115000, ST: 185000 }, JEE: { General: 330000, OBC: 420000, SC: 560000, ST: 740000 } },
    { CET: { General: 102, OBC: 92, SC: 70, ST: 50 } }, "₹72,000/year", 2010, 3.2);

add("BVP's Institute of Management & Rural Development, Sangli-Solapur Road", "Private", "Solapur", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering"],
    { CET: { General: 48000, OBC: 68000, SC: 105000, ST: 170000 }, JEE: { General: 290000, OBC: 380000, SC: 520000, ST: 700000 } },
    { CET: { General: 108, OBC: 98, SC: 75, ST: 52 } }, "₹78,000/year", 2007, 3.3);

add("Shri Vithal Education & Research Institute's COE, Pandharpur", "Private", "Solapur (Pandharpur)", "engineering",
    ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
    { CET: { General: 50000, OBC: 70000, SC: 110000, ST: 180000 }, JEE: { General: 300000, OBC: 390000, SC: 530000, ST: 710000 } },
    { CET: { General: 105, OBC: 95, SC: 72, ST: 50 } }, "₹75,000/year", 2008, 3.3);

add("Solapur University Pharmacy College", "Government", "Solapur", "pharmacy",
    ["B.Pharm", "M.Pharm"],
    { CET: { General: 3000, OBC: 8000, SC: 22000, ST: 40000 } },
    { CET: { General: 175, OBC: 160, SC: 130, ST: 105 } }, "₹28,000/year", 2005, 3.9);

add("Sangola Taluka College of Pharmacy, Sangola", "Private", "Solapur (Sangola)", "pharmacy",
    ["B.Pharm", "D.Pharm"],
    { CET: { General: 20000, OBC: 32000, SC: 58000, ST: 92000 } },
    { CET: { General: 138, OBC: 125, SC: 92, ST: 68 } }, "₹62,000/year", 2008, 3.3);

add("Pandharpur Medical College (Government)", "Government", "Solapur (Pandharpur)", "medical",
    ["MBBS"],
    { NEET: { General: 15000, OBC: 28000, SC: 52000, ST: 80000 } },
    { NEET: { General: 550, OBC: 510, SC: 410, ST: 350 } }, "₹48,000/year", 2018, 3.8);

add("Ashwini Sahakari Rugnalaya's Medical College, Solapur", "Private", "Solapur", "medical",
    ["MBBS", "MD"],
    { NEET: { General: 28000, OBC: 45000, SC: 72000, ST: 105000 } },
    { NEET: { General: 510, OBC: 470, SC: 370, ST: 310 } }, "₹13,00,000/year", 2005, 3.6);

// Merge and write
const all = [...existing, ...newColleges];
fs.writeFileSync(path.join(__dirname, 'colleges.json'), JSON.stringify(all, null, 4), 'utf8');

// Summary
const districtCount = {};
newColleges.forEach(c => {
    const d = c.district.split('(')[0].trim();
    if (!districtCount[d]) districtCount[d] = { eng: 0, med: 0, phar: 0 };
    districtCount[d][c.category === 'engineering' ? 'eng' : c.category === 'medical' ? 'med' : 'phar']++;
});

console.log(`\n✅ Added ${newColleges.length} new colleges. Total: ${all.length}`);
console.log('\n📊 New colleges by district:');
Object.entries(districtCount).sort().forEach(([d, c]) => {
    console.log(`  ${d}: Eng=${c.eng}, Med=${c.med}, Phar=${c.phar}`);
});
