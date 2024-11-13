import jwt from 'jsonwebtoken';
import Airtable from 'airtable';
import dayjs from 'dayjs';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
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
    console.log("Decoded User ID:", userId);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const today = dayjs().format('YYYY-MM-DD');

  try {
    // Step 1: Check if a DailyStatus record already exists for this user
    const records = await base('DailyStatus')
      .select({
        fields: ['User ID'],
        maxRecords: 100,
      })
      .firstPage();

    const existingRecord = records.find(record => {
      const userIds = record.fields['User ID'] || [];
      return userIds.includes(userId);
    });

    if (existingRecord) {
      // Step 2a: Update the existing record with today's date and mark Entered Today as true
      const recordId = existingRecord.id;
      await base('DailyStatus').update(recordId, {
        'Last Entry Date': today,
        'Entered Today?': true,
      });
      console.log("DailyStatus record updated for user.");
    } else {
      // Step 2b: Create a new record if none exists for the user
      await base('DailyStatus').create({
        'User ID': [userId], // Must be an array for linked records
        'Last Entry Date': today,
        'Entered Today?': true,
      });
      console.log("New DailyStatus record created for user.");
    }

    res.status(200).json({ message: 'Daily status updated successfully.' });
  } catch (error) {
    console.error("Error updating daily entry status:", error);
    res.status(500).json({ message: "Error updating daily entry status" });
  }
}
