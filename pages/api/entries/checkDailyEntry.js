// pages/api/entries/checkDailyEntry.js
import jwt from 'jsonwebtoken';
import Airtable from 'airtable';
import dayjs from 'dayjs';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests are allowed' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Format today’s start and end dates for range
  const todayStart = dayjs().startOf('day').format('MM/DD/YYYY');
  const todayEnd = dayjs().endOf('day').format('MM/DD/YYYY');
  console.log("Formatted today's date range:", todayStart, "to", todayEnd);

  try {
    console.log(`Checking entries with formula: AND({User ID} = '${userId}', IS_AFTER({Entry Date}, '${todayStart}'), IS_BEFORE({Entry Date}, '${todayEnd}'))`);

    const records = await base('Entries')
      .select({
        filterByFormula: `AND({User ID} = '${userId}', IS_AFTER({Entry Date}, '${todayStart}'), IS_BEFORE({Entry Date}, '${todayEnd}'))`,
      })
      .firstPage();

    // Log any records retrieved to see field data directly from Airtable
    console.log("Entries retrieved from Airtable:", records.map(record => ({
      entryDate: record.fields['Entry Date'],
      userId: record.fields['User ID'],
      value: record.fields['Value']
    })));

    const hasEntryForToday = records.length > 0;
    console.log("Has entry for today:", hasEntryForToday); 

    res.status(200).json({ hasEntryForToday });
  } catch (error) {
    console.error("Error checking daily entry:", error);
    res.status(500).json({ message: "Error checking daily entry" });
  }
}
