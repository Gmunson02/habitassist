import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { token, metricId } = req.query;

    // Verify JWT and extract userId
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token', error: error.message });
    }

    try {
      // Fetch all entries from Airtable
      const records = await base('Entries')
        .select({
          sort: [{ field: 'Entry Date', direction: 'asc' }],
        })
        .all();

      // Filter records by userId and metricId after retrieval
      const filteredEntries = records
        .filter((record) => 
          record.fields['User ID']?.includes(userId) && 
          record.fields['Metric ID']?.includes(metricId)
        )
        .map((record) => ({
          id: record.id,
          userId: record.fields['User ID'],
          metricId: record.fields['Metric ID'],
          entryDate: record.fields['Entry Date'],
          value: record.fields['Value'],
          createdDate: record.fields['Created Date'],
          entryId: record.fields['Entry ID'],
        }));

      res.status(200).json({ entries: filteredEntries });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving entries', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Only GET requests are allowed' });
  }
}
