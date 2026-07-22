const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ================= WALLETS =================
async function getWallets() {
  const res = await pool.query(
    `SELECT w.id, w.name, w.type, w.created_at,
      COALESCE((
        SELECT SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END)
        - SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END)
        - SUM(CASE WHEN t.type = 'transfer' THEN t.amount ELSE 0 END)
        FROM transactions t WHERE t.wallet_id = w.id
      ), 0) + COALESCE((
        SELECT SUM(t.amount) FROM transactions t
        WHERE t.to_wallet_id = w.id AND t.type = 'transfer'
      ), 0) as balance
    FROM wallets w
    WHERE w.user_id = $1
    ORDER BY w.created_at`,
    [process.argv[2]]
  );
  return res.rows;
}

async function getWalletByName(userId, name) {
  const res = await pool.query(
    'SELECT * FROM wallets WHERE user_id = $1 AND LOWER(name) = LOWER($2)',
    [userId, name]
  );
  return res.rows[0] || null;
}

async function getAllWalletNames(userId) {
  const res = await pool.query('SELECT id, name, type FROM wallets WHERE user_id = $1 ORDER BY name', [userId]);
  return res.rows;
}

// ================= TRANSACTIONS =================
async function createTransaction({ userId, walletId, type, amount, category, description }) {
  const res = await pool.query(
    `INSERT INTO transactions (wallet_id, user_id, type, category, amount, description, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
    [walletId, userId, type, category || 'Lainnya', amount, description || null]
  );
  return res.rows[0];
}

async function transferBetweenWallets({ userId, fromWalletId, toWalletId, amount, description }) {
  const res = await pool.query(
    `INSERT INTO transactions (wallet_id, to_wallet_id, user_id, type, category, amount, description, created_at)
     VALUES ($1, $2, $3, 'transfer', 'Transfer', $4, $5, NOW()) RETURNING *`,
    [fromWalletId, toWalletId, userId, amount, description || 'Transfer antar dompet']
  );
  return res.rows[0];
}

async function getRecentTransactions(userId, limit = 10) {
  const res = await pool.query(
    `SELECT t.*, w.name as wallet_name,
      COALESCE(tw.name, '') as to_wallet_name
    FROM transactions t
    LEFT JOIN wallets w ON t.wallet_id = w.id
    LEFT JOIN wallets tw ON t.to_wallet_id = tw.id
    WHERE t.user_id = $1
    ORDER BY t.created_at DESC LIMIT $2`,
    [userId, limit]
  );
  return res.rows;
}

// ================= SUMMARY =================
async function getSummary(userId) {
  const wallets = await getWallets(userId);
  const totalBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayRes = await pool.query(
    `SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as today_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as today_expense
    FROM transactions
    WHERE user_id = $1 AND created_at >= $2`,
    [userId, today]
  );

  return {
    totalBalance,
    wallets,
    todayIncome: Number(todayRes.rows[0].today_income),
    todayExpense: Number(todayRes.rows[0].today_expense),
  };
}

// ================= PARSER (simple) =================
function parseTransaction(text, wallets) {
  text = text.toLowerCase().trim();

  // Detect wallet mentions
  let targetWallet = null;
  for (const w of wallets) {
    if (text.includes(w.name.toLowerCase())) {
      targetWallet = w;
      break;
    }
  }

  // Default wallet: first wallet that matches "cash" or just use CASH
  if (!targetWallet) {
    targetWallet = wallets.find(w => w.name.toLowerCase() === 'cash') || wallets[0];
  }

  // Extract amount (look for numbers)
  const amountMatch = text.match(/(\d[\d.,]*)\s*(rb|k|ribu)?/i);
  let amount = 0;
  if (amountMatch) {
    amount = parseInt(amountMatch[1].replace(/[.,]/g, ''));
    if (amountMatch[2] && (amountMatch[2].toLowerCase() === 'rb' || amountMatch[2].toLowerCase() === 'k' || amountMatch[2].toLowerCase() === 'ribu')) {
      amount *= 1000;
    }
  }

  // Detect type
  let type = 'expense';
  let description = text;

  const incomeKeywords = ['gaji', 'pemasukan', 'income', 'dapet', 'dapat', 'rezeki', 'uang masuk', 'dari', 'transfer masuk', 'pemberian', 'kado', 'bonus'];
  const expenseKeywords = ['beli', 'bayar', 'makan', 'minum', 'bensin', 'kopi', 'rokok', 'jajan', 'ongkos', 'pulsa', 'kuota', 'shopping'];

  for (const kw of incomeKeywords) {
    if (text.includes(kw)) { type = 'income'; break; }
  }

  // Auto-categorize
  let category = 'Lainnya';
  const categoryMap = {
    'Makan & Minum': ['makan', 'minum', 'kopi', 'nasi', 'mie', 'indomie', 'susu', 'sarapan', 'makan siang', 'makan malam', 'jajan', 'cafe', 'restoran', 'goreng', 'bakso', 'soto', 'ayam', 'telur', 'roti', 'kue'],
    'Transportasi': ['bensin', 'solar', 'bahan bakar', 'bbm', 'transport', 'ojek', 'grab', 'gojek', 'taxi', 'angkot', 'bus', 'kereta', 'toll', 'parkir', 'bengkel', 'ban', 'service motor', 'servis'],
    'Belanja': ['beli', 'belanja', 'shopping', 'baju', 'sepatu', 'tas', 'rokok', 'pulsa', 'kuota', 'paket data'],
    'Kesehatan': ['obat', 'dokter', 'klinik', 'rumah sakit', 'rs', 'vitamin', 'masker'],
    'Tagihan & Bils': ['listrik', 'air', 'pdam', 'pln', 'internet', 'wifi', 'tagihan', 'bills', 'indihome', 'firstmedia'],
    'Hiburan': ['nonton', 'film', 'game', 'voucher', 'steam', 'netflix', 'spotify', 'youtube', 'musik'],
    'Pendidikan': ['kursus', 'les', 'buku', 'kuliah', 'belajar', 'course', 'skill'],
    'Pemberian': ['pemberian', 'kado', 'hadiah', 'dari', 'rezeki', 'bonus', 'tips'],
  };

  for (const [cat, keywords] of Object.entries(categoryMap)) {
    for (const kw of keywords) {
      if (text.includes(kw)) { category = cat; break; }
    }
    if (category !== 'Lainnya') break;
  }

  // Clean description from wallet name and amount
  description = text
    .replace(targetWallet.name.toLowerCase(), '')
    .replace(amountMatch?.[0] || '', '')
    .trim()
    .replace(/\s+/g, ' ');

  return { type, amount, category, description: description || text, walletId: targetWallet.id, walletName: targetWallet.name };
}

// ================= MAIN =================
async function main() {
  const command = process.argv[3] || 'help';
  const userId = process.argv[2]; // First arg is always userId

  if (!userId || userId === 'help') {
    console.log(`
Saifu Hermes CLI Usage:
  node hermes-saifu.js <userId> <command> [args]

Commands:
  wallets                     - List all wallets
  balance                     - Show balance summary
  recent [limit]              - Show recent transactions
  add <wallet> <type> <amount> <category> <desc>  - Add transaction
  transfer <from> <to> <amount> [desc] - Transfer between wallets
  parse "<text>"              - Parse natural language transaction
    `);
    return;
  }

  switch (command) {
    case 'wallets': {
      const wallets = await getAllWalletNames(userId);
      console.log(JSON.stringify(wallets, null, 2));
      break;
    }
    case 'balance': {
      const summary = await getSummary(userId);
      console.log(JSON.stringify(summary, null, 2));
      break;
    }
    case 'recent': {
      const limit = parseInt(process.argv[4]) || 10;
      const txns = await getRecentTransactions(userId, limit);
      console.log(JSON.stringify(txns, null, 2));
      break;
    }
    case 'add': {
      const walletName = process.argv[4];
      const type = process.argv[5];
      const amount = parseInt(process.argv[6]);
      const category = process.argv[7] || 'Lainnya';
      const description = process.argv.slice(8).join(' ') || '';

      const wallets = await getAllWalletNames(userId);
      const wallet = wallets.find(w => w.name.toLowerCase() === walletName.toLowerCase());
      if (!wallet) {
        console.log(JSON.stringify({ error: `Wallet "${walletName}" not found. Available: ${wallets.map(w => w.name).join(', ')}` }));
        return;
      }

      const txn = await createTransaction({ userId, walletId: wallet.id, type, amount, category, description });
      console.log(JSON.stringify(txn, null, 2));
      break;
    }
    case 'transfer': {
      const fromName = process.argv[4];
      const toName = process.argv[5];
      const amount = parseInt(process.argv[6]);
      const desc = process.argv.slice(7).join(' ') || 'Transfer antar dompet';

      const wallets = await getAllWalletNames(userId);
      const fromWallet = wallets.find(w => w.name.toLowerCase() === fromName.toLowerCase());
      const toWallet = wallets.find(w => w.name.toLowerCase() === toName.toLowerCase());
      if (!fromWallet) { console.log(JSON.stringify({ error: `Source wallet "${fromName}" not found` })); return; }
      if (!toWallet) { console.log(JSON.stringify({ error: `Destination wallet "${toName}" not found` })); return; }

      const txn = await transferBetweenWallets({ userId, fromWalletId: fromWallet.id, toWalletId: toWallet.id, amount, description: desc });
      console.log(JSON.stringify(txn, null, 2));
      break;
    }
    case 'parse': {
      const text = process.argv[4];
      const wallets = await getAllWalletNames(userId);
      const result = parseTransaction(text, wallets);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    default:
      console.log(JSON.stringify({ error: `Unknown command: ${command}` }));
  }
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }));
}).finally(() => pool.end());