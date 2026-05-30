const API_KEY = '5ka1a58mw8vldwf587i8lb1pt2avqgzbjmeidvsp8gsme7i32lbdazbu2erygc0y';
const HEADERS = {
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    // Step 1: Create or update the contact
    const contactRes = await fetch('https://api.systeme.io/api/contacts', {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ email })
    });

    const contact = await contactRes.json();

    if (!contactRes.ok) {
      console.error('Contact creation error:', contact);
      return res.status(contactRes.status).json({ error: 'Failed to create contact', details: contact });
    }

    const contactId = contact.id;

    // Step 2: Add the revenue-leak-lead tag via separate call
    const tagRes = await fetch(`https://api.systeme.io/api/contacts/${contactId}/tags`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ name: 'revenue-leak-lead' })
    });

    const tagData = await tagRes.json();

    if (!tagRes.ok) {
      console.error('Tag error:', tagData);
      // Contact was created — don't fail the whole request, just log
    }

    return res.status(200).json({ success: true, contactId });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
