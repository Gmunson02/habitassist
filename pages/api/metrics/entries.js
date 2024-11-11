import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token, metricId, entryDate, value } = req.body;

    // Verify JWT
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    try {
      // Create a new entry in Airtable's Entries table
      const newEntry = await base('Entries').create({
        'User ID': [userId], // Link to Users table
        'Metric ID': [metricId], // Link to Metrics table
        'Entry Date': entryDate,
        'Value': value
      });

      res.status(201).json({ message: 'Entry added', entry: newEntry.fields });
    } catch (error) {
      res.status(500).json({ message: 'Error adding entry', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Only POST requests are allowed' });
  }
}
