// pages/api/metrics/addEntry.js
import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

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

  let { metricId, entryDate, value } = req.body;
  console.log("Received data - Metric ID:", metricId, "Entry Date:", entryDate, "Value:", value);

  // Ensure value is a number
  value = Number(value);
  if (isNaN(value)) {
    console.error("Value must be a number");
    return res.status(400).json({ message: 'Value must be a number' });
  }

  try {
    const newEntry = await base('Entries').create({
      'User ID': [userId],
      'Metric ID': [metricId],
      'Entry Date': entryDate,
      'Value': value,
    });

    console.log("Entry successfully added:", newEntry.fields);
    res.status(201).json({ message: 'Entry added', entry: newEntry.fields });
  } catch (error) {
    console.error("Error adding entry:", error.message);
    res.status(500).json({ message: 'Error adding entry', error: error.message });
  }
}
