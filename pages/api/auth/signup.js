import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { username, password, firstName, lastName, age, sex } = req.body;

  try {
    // Check if the user already exists
    const existingRecords = await base('Users')
      .select({ filterByFormula: `{Username} = '${username}'` })
      .firstPage();

    if (existingRecords.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in Airtable
    const createdUser = await base('Users').create({
      Username: username,
      Password: hashedPassword,
      'First Name': firstName,
      'Last Name': lastName,
      Age: age,
      Sex: sex,
    });

    // Generate a JWT token
    const token = jwt.sign(
      { id: createdUser.id, username: createdUser.fields.Username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expiration time, e.g., 1 hour
    );

    // Respond with the token and user details
    res.status(201).json({ message: 'User created', token, user: createdUser.fields });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
}
