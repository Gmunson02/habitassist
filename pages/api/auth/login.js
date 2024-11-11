import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { username, password } = req.body;

  try {
    // Find the user in Airtable by username
    const records = await base('Users')
      .select({ filterByFormula: `{Username} = '${username}'` })
      .firstPage();

    if (records.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = records[0].fields;

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.Password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: records[0].id, username: user.Username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
}
