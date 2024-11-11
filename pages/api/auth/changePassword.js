// pages/api/auth/changePassword.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Only PUT requests are allowed' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const { password } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const userRecords = await base('Users')
      .select({ filterByFormula: `{ID} = '${userId}'` })
      .firstPage();

    if (userRecords.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userRecordId = userRecords[0].id;
    const hashedPassword = await bcrypt.hash(password, 10);

    await base('Users').update(userRecordId, {
      Password: hashedPassword,
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
}
