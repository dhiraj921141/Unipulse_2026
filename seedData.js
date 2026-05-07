/**
 * Seed Script — Imports colleges from colleges.json into MongoDB (unipulse_db)
 * 
 * Usage:
 *   node seedData.js              (adds new colleges, keeps existing ones)
 *   node seedData.js --reset      (deletes ALL existing colleges first, then adds)
 * 
 * Data file: colleges.json (must be in the same directory)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const College = require('./models/College');

const JSON_FILE = path.join(__dirname, 'colleges.json');
const RESET_FLAG = process.argv.includes('--reset');
const BATCH_SIZE = 100; // Insert in batches for speed

async function seed() {
    try {
        // 1. Read JSON file
        if (!fs.existsSync(JSON_FILE)) {
            console.error('❌ File not found: colleges.json');
            console.log('   Create a colleges.json file with your college data.');
            process.exit(1);
        }

        const rawData = fs.readFileSync(JSON_FILE, 'utf-8');
        let colleges;
        try {
            colleges = JSON.parse(rawData);
        } catch (parseErr) {
            console.error('❌ Invalid JSON in colleges.json:', parseErr.message);
            process.exit(1);
        }

        if (!Array.isArray(colleges)) {
            console.error('❌ colleges.json must contain an array of college objects.');
            process.exit(1);
        }

        console.log(`📄 Loaded ${colleges.length} colleges from colleges.json`);

        // 2. Connect to MongoDB (unipulse_db)
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/unipulse_db';
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');
        console.log('📦 Database: ' + mongoose.connection.db.databaseName);

        // 3. Optionally reset existing data
        if (RESET_FLAG) {
            const deleted = await College.deleteMany({});
            console.log(`🗑️  Cleared ${deleted.deletedCount} existing college records`);
        }

        // 4. Batch insert for speed
        console.log(`📦 Inserting ${colleges.length} colleges in batches of ${BATCH_SIZE}...`);

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (let i = 0; i < colleges.length; i += BATCH_SIZE) {
            const batch = colleges.slice(i, i + BATCH_SIZE);
            try {
                const result = await College.insertMany(batch, { ordered: false });
                successCount += result.length;
                const progress = Math.min(100, Math.round(((i + batch.length) / colleges.length) * 100));
                process.stdout.write(`\r   Progress: ${progress}% (${successCount} inserted)`);
            } catch (err) {
                // insertMany with ordered:false continues on error
                if (err.insertedDocs) {
                    successCount += err.insertedDocs.length;
                }
                if (err.writeErrors) {
                    err.writeErrors.forEach(we => {
                        errorCount++;
                        errors.push({
                            index: i + we.index + 1,
                            name: batch[we.index] ? batch[we.index].name : '(unknown)',
                            error: we.errmsg || we.message
                        });
                    });
                } else {
                    // Fallback to one-by-one insert for this batch
                    for (let j = 0; j < batch.length; j++) {
                        try {
                            const doc = new College(batch[j]);
                            await doc.save();
                            successCount++;
                        } catch (saveErr) {
                            errorCount++;
                            errors.push({
                                index: i + j + 1,
                                name: batch[j].name || '(no name)',
                                error: saveErr.message
                            });
                        }
                    }
                }
            }
        }

        // 5. Summary
        console.log('\n\n========== SEED RESULTS ==========');
        console.log(`✅ Successfully added: ${successCount} colleges`);
        if (errorCount > 0) {
            console.log(`❌ Failed: ${errorCount} colleges`);
            console.log('\nFailed entries (first 20):');
            errors.slice(0, 20).forEach(e => {
                console.log(`   #${e.index} "${e.name}" → ${e.error}`);
            });
            if (errors.length > 20) {
                console.log(`   ... and ${errors.length - 20} more errors`);
            }
        }

        // Category breakdown
        const total = await College.countDocuments();
        const eng = await College.countDocuments({ category: 'engineering' });
        const med = await College.countDocuments({ category: 'medical' });
        const pha = await College.countDocuments({ category: 'pharmacy' });
        console.log(`\n📊 Total in database: ${total}`);
        console.log(`   Engineering: ${eng} | Medical: ${med} | Pharmacy: ${pha}`);

        // List collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`\n🗃️  Collections in ${mongoose.connection.db.databaseName}:`);
        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`   📁 ${col.name}: ${count} documents`);
        }
        console.log('==================================\n');

    } catch (err) {
        console.error('❌ Seed failed:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seed();
