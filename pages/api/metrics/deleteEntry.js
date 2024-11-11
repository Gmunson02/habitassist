// pages/api/metrics/deleteEntry.js
import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Only DELETE requests are allowed' });
  }

  const { entryId } = req.query;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  // Verify JWT
  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // Retrieve the entry from Airtable to verify ownership
    const entryRecord = await base('Entries').find(entryId);
    const entryUserId = entryRecord.fields['User ID'][0];

    // Check if the entry belongs to the authenticated user
    if (entryUserId !== userId) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this entry.' });
    }

    // Delete the entry from Airtable
    await base('Entries').destroy(entryId);
    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entry', error: error.message });
  }
}
