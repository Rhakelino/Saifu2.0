import { db } from './lib/db';
import { transactions } from './lib/db';

export async function addCoffeeTransaction() {
  try {
    await db.insert(transactions).values({
      item: 'Kopi',
      amount: 20000,
    });
    return { success: true, message: 'Data kopi 20rb berhasil diinput!' };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, message: 'Gagal input database.' };
  }
}
