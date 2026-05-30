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
    // Create contact with tag inline — single API call
    const contactRes = await fetch('https://api.systeme.io/api/contacts', {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        email,
        tags: [{ name: 'revenue-leak-lead' }]
      })
    });

    const contact = await contactRes.json();

    console.log('Systeme.io response:', contactRes.status, JSON.stringify(contact));

    if (!contactRes.ok) {
      console.error('Contact creation error:', contact);
      return res.status(contactRes.status).json({ error: 'Failed to create contact', details: contact });
    }

    return res.status(200).json({ success: true, contactId: contact.id, tags: contact.tags });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
