// pages/api/metrics/updateEntry.js
import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Only PUT requests are allowed' });
  }

  const { entryId, value, entryDate } = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // Token verification
  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // Update entry in Airtable with error logging
    const updatedEntry = await base('Entries').update(entryId, {
      'Entry Date': entryDate,
      'Value': value,
    });

    console.log("Entry updated successfully:", updatedEntry.fields);
    res.status(200).json({ message: 'Entry updated successfully', entry: updatedEntry.fields });
  } catch (error) {
    console.error("Error updating entry:", error.message); // Improved logging
    res.status(500).json({ message: 'Error updating entry', error: error.message });
  }
}
