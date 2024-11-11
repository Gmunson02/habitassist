import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { token, entryId, entryDate, value } = req.body;

    // Verify JWT and extract userId
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token', error: error.message });
    }

    try {
      // Fetch the entry to verify ownership
      const record = await base('Entries').find(entryId);

      // Ensure the entry belongs to the authenticated user
      if (!record.fields['User ID']?.includes(userId)) {
        return res.status(403).json({ message: 'You do not have permission to update this entry' });
      }

      // Update the entry
      const updatedEntry = await base('Entries').update(entryId, {
        'Entry Date': entryDate,
        'Value': value
      });

      res.status(200).json({ message: 'Entry updated successfully', entry: updatedEntry.fields });
    } catch (error) {
      res.status(500).json({ message: 'Error updating entry', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Only PUT requests are allowed' });
  }
}
