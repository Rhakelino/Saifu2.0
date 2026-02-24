import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import pg from "pg";
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
    const client = await pool.connect();

    try {
        // Get first user
        const userRes = await client.query('SELECT id FROM "user" LIMIT 1');
        if (userRes.rows.length === 0) {
            console.log("❌ Tidak ada user. Login dulu via Google.");
            return;
        }
        const userId = userRes.rows[0].id;
        console.log("👤 User ID:", userId);

        // Get wallets
        const walletRes = await client.query("SELECT id, name FROM wallets WHERE user_id = $1", [userId]);
        if (walletRes.rows.length === 0) {
            console.log("❌ Tidak ada dompet. Buat dompet dulu di app.");
            return;
        }

        const wallets = walletRes.rows;
        console.log("💰 Dompet:", wallets.map((w) => w.name).join(", "));

        const descriptions = {
            income: [
                "Gaji bulanan", "Freelance project", "Bonus kerja", "Cashback promo",
                "Transfer dari teman", "Dividen saham", "Hadiah", "Refund belanja",
            ],
            expense: [
                "Makan siang", "Kopi Starbucks", "Belanja Shopee", "Bensin motor",
                "Pulsa & internet", "Langganan Netflix", "Laundry", "Parkir",
                "Grab/Gojek", "Groceries Indomaret", "Tagihan listrik", "Makan malam",
                "Beli buku", "Top up game", "Snack & minuman", "Ojol ke kantor",
            ],
        };

        const transactions = [];
        const now = new Date();

        for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
            const day = new Date(now);
            day.setDate(day.getDate() - dayOffset);

            // 2-5 transactions per day
            const txCount = 2 + Math.floor(Math.random() * 4);

            for (let j = 0; j < txCount; j++) {
                const wallet = wallets[Math.floor(Math.random() * wallets.length)];
                const isIncome = Math.random() < 0.35; // 35% chance income
                const type = isIncome ? "income" : "expense";

                const descList = descriptions[type];
                const description = descList[Math.floor(Math.random() * descList.length)];

                let amount;
                if (isIncome) {
                    // Income: 50k - 5jt
                    const incomeAmounts = [50000, 100000, 150000, 200000, 500000, 750000, 1000000, 2000000, 3000000, 5000000];
                    amount = incomeAmounts[Math.floor(Math.random() * incomeAmounts.length)];
                } else {
                    // Expense: 5k - 500k
                    const expenseAmounts = [5000, 10000, 15000, 20000, 25000, 30000, 35000, 50000, 75000, 100000, 150000, 200000, 300000, 500000];
                    amount = expenseAmounts[Math.floor(Math.random() * expenseAmounts.length)];
                }

                // Random time of day
                const hour = 7 + Math.floor(Math.random() * 14); // 07:00 - 21:00
                const minute = Math.floor(Math.random() * 60);
                const txDate = new Date(day);
                txDate.setHours(hour, minute, 0, 0);

                transactions.push({
                    wallet_id: wallet.id,
                    user_id: userId,
                    type,
                    amount,
                    description,
                    created_at: txDate.toISOString(),
                });
            }
        }

        // Insert all
        for (const tx of transactions) {
            await client.query(
                `INSERT INTO transactions (wallet_id, user_id, type, amount, description, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [tx.wallet_id, tx.user_id, tx.type, tx.amount, tx.description, tx.created_at]
            );
        }

        console.log(`\n✅ Berhasil insert ${transactions.length} transaksi dummy!`);
        console.log("📊 Refresh dashboard untuk lihat grafiknya.");
    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
