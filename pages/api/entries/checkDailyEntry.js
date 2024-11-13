import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

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
    console.log("Decoded User ID:", userId);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // Step 1: Retrieve only essential fields (User ID and Entered Today?) for the first 100 records
    const records = await base('DailyStatus')
      .select({
        fields: ['User ID', 'Entered Today?'],
        maxRecords: 100,
      })
      .firstPage();

    console.log("Retrieved records for minimal data:", records);

    // Step 2: Filter records on the server side by matching the User ID
    const matchingRecord = records.find(record => {
      const userIds = record.fields['User ID'] || [];
      return userIds.includes(userId);
    });

    if (!matchingRecord) {
      console.log("No daily status record found for this user.");
      return res.status(200).json({ hasEntryForToday: false });
    }

    // Check the 'Entered Today?' field in the matching record
    const enteredToday = matchingRecord.fields['Entered Today?'] || false;
    console.log("User's status - Entered Today:", enteredToday);

    res.status(200).json({ hasEntryForToday: enteredToday });
  } catch (error) {
    console.error("Error checking daily entry status:", error);
    res.status(500).json({ message: "Error checking daily entry status" });
  }
}
