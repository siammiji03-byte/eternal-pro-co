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
    // Step 1: Try to create contact with tag
    const createRes = await fetch('https://api.systeme.io/api/contacts', {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        email,
        tags: [{ name: 'revenue-leak-lead' }]
      })
    });

    const createData = await createRes.json();
    console.log('Create response:', createRes.status, JSON.stringify(createData));

    let contactId;

    if (createRes.ok) {
      // New contact — created with tag inline
      contactId = createData.id;
      return res.status(200).json({ success: true, contactId, action: 'created' });
    }

    // If email already exists, find the contact and tag them
    const emailAlreadyUsed = JSON.stringify(createData).includes('already used');
    if (!emailAlreadyUsed) {
      return res.status(createRes.status).json({ error: 'Failed to create contact', details: createData });
    }

    // Step 2: Search for existing contact by email
    const searchRes = await fetch(
      `https://api.systeme.io/api/contacts?filters[email]=${encodeURIComponent(email)}`,
      { headers: HEADERS }
    );
    const searchData = await searchRes.json();
    console.log('Search response:', searchRes.status, JSON.stringify(searchData));

    const existingContact = searchData.items && searchData.items[0];
    if (!existingContact) {
      return res.status(404).json({ error: 'Could not find existing contact' });
    }

    contactId = existingContact.id;

    // Step 3: Add tag to existing contact
    const tagRes = await fetch(`https://api.systeme.io/api/contacts/${contactId}/tags`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ name: 'revenue-leak-lead' })
    });
    const tagData = await tagRes.json();
    console.log('Tag response:', tagRes.status, JSON.stringify(tagData));

    return res.status(200).json({ success: true, contactId, action: 'updated', tagStatus: tagRes.status, tagData });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
