import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  console.log('Request received with method:', req.method); // Log the HTTP method
  console.log('Query parameters:', req.query); // Log the query parameters for token and entryId

  if (req.method === 'DELETE') {
    const { token, entryId } = req.query;

    // Log token and entryId to confirm they're being received
    console.log('Received token:', token);
    console.log('Received entryId:', entryId);

    // Verify JWT and extract userId
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
      console.log('Decoded user ID from token:', userId); // Log the extracted user ID
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ message: 'Invalid token', error: error.message });
    }

    try {
      // Fetch the entry to verify ownership
      const record = await base('Entries').find(entryId);
      console.log('Fetched record:', record.fields); // Log the fetched entry fields

      // Ensure the entry belongs to the authenticated user
      if (!record.fields['User ID']?.includes(userId)) {
        console.warn('User ID mismatch - user does not own this entry');
        return res.status(403).json({ message: 'You do not have permission to delete this entry' });
      }

      // Delete the entry
      await base('Entries').destroy(entryId);
      console.log('Entry deleted successfully:', entryId); // Log successful deletion
      res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (error) {
      console.error('Error deleting entry:', error.message);
      res.status(500).json({ message: 'Error deleting entry', error: error.message });
    }
  } else {
    console.warn('Invalid request method:', req.method);
    res.status(405).json({ message: 'Only DELETE requests are allowed' });
  }
}
