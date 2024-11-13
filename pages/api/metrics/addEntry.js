// pages/api/metrics/addEntry.js
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
    console.error("Token is missing in the request header");
    return res.status(401).json({ message: 'Token is missing' });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
    console.log("Decoded User ID:", userId);
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }

  const { entries } = req.body;

  // Validate entries array
  if (!Array.isArray(entries) || entries.length === 0) {
    console.error("Entries must be a non-empty array");
    return res.status(400).json({ message: 'Entries must be a non-empty array' });
  }

  console.log("Received entries:", entries);

  try {
    // Step 1: Add each entry to the Entries table
    const entryPromises = entries.map(({ metricId, entryDate, value }) => {
      // Ensure value is a number
      const numericValue = Number(value);
      if (isNaN(numericValue)) {
        throw new Error("Value must be a number");
      }

      return base('Entries').create({
        'User ID': [userId],
        'Metric ID': [metricId],
        'Entry Date': entryDate,
        'Value': numericValue,
      });
    });

    await Promise.all(entryPromises);
    console.log("Entries successfully added");

    // Step 2: Update or create the DailyStatus record for the user
    const today = dayjs().format('YYYY-MM-DD');
    const dailyStatusRecords = await base('DailyStatus')
      .select({
        fields: ['User ID'],
        maxRecords: 100,
      })
      .firstPage();

    const existingStatusRecord = dailyStatusRecords.find(record => {
      const userIds = record.fields['User ID'] || [];
      return userIds.includes(userId);
    });

    if (existingStatusRecord) {
      // Update the existing DailyStatus record
      await base('DailyStatus').update(existingStatusRecord.id, {
        'Last Entry Date': today,
        'Entered Today?': true,
      });
      console.log("DailyStatus record updated for user.");
    } else {
      // Create a new DailyStatus record if one doesn’t exist
      await base('DailyStatus').create({
        'User ID': [userId],
        'Last Entry Date': today,
        'Entered Today?': true,
      });
      console.log("New DailyStatus record created for user.");
    }

    res.status(201).json({ message: 'Entries added and DailyStatus updated' });
  } catch (error) {
    console.error("Error adding entries or updating DailyStatus:", error.message);
    res.status(500).json({ message: 'Error adding entries or updating DailyStatus', error: error.message });
  }
}
