const API_KEY = '5ka1a58mw8vldwf587i8lb1pt2avqgzbjmeidvsp8gsme7i32lbdazbu2erygc0y';
const HEADERS = {
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, listings, nightly_rate, occupancy_pct, estimated_leak } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    // Step 1: Get the numeric tag ID for 'revenue-leak-lead'
    const tagsRes = await fetch('https://api.systeme.io/api/tags?limit=50', { headers: HEADERS });
    const tagsData = await tagsRes.json();
    const tag = tagsData.items && tagsData.items.find(t => t.name === 'revenue-leak-lead');
    const tagId = tag ? tag.id : null;
    console.log('Tag ID found:', tagId);

    // Step 2: Try to create contact
    const createRes = await fetch('https://api.systeme.io/api/contacts', {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ email })
    });
    const createData = await createRes.json();
    console.log('Create response:', createRes.status, JSON.stringify(createData));

    let contactId;

    if (createRes.ok) {
      contactId = createData.id;
    } else {
      // Contact already exists — find them by email
      const emailAlreadyUsed = JSON.stringify(createData).includes('already used');
      if (!emailAlreadyUsed) {
        return res.status(createRes.status).json({ error: 'Failed to create contact', details: createData });
      }
      const searchRes = await fetch(
        `https://api.systeme.io/api/contacts?filters[email]=${encodeURIComponent(email)}`,
        { headers: HEADERS }
      );
      const searchData = await searchRes.json();
      const existing = searchData.items && searchData.items[0];
      if (!existing) return res.status(404).json({ error: 'Contact not found' });
      contactId = existing.id;
    }

    // Step 3: Add tag using numeric ID
    if (tagId) {
      const tagRes = await fetch(`https://api.systeme.io/api/contacts/${contactId}/tags`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ tagId })
      });
      const tagData = await tagRes.json();
      console.log('Tag response:', tagRes.status, JSON.stringify(tagData));
    }

    // Step 4: Save calculator field data to the contact
    const fields = [];
    if (nightly_rate)  fields.push({ slug: 'nightly_rate',   value: String(nightly_rate) });
    if (estimated_leak) fields.push({ slug: 'estimated_leak', value: String(estimated_leak) });
    if (occupancy_pct) fields.push({ slug: 'occupancy',       value: String(occupancy_pct) });
    if (listings)      fields.push({ slug: 'listings',        value: String(listings) });

    let fieldsResult = null;
    if (fields.length > 0) {
      const patchRes = await fetch(`https://api.systeme.io/api/contacts/${contactId}`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({ fields })
      });
      const patchText = await patchRes.text();
      const patchData = patchText ? JSON.parse(patchText) : {};
      fieldsResult = { status: patchRes.status, data: patchData };
      console.log('Fields PATCH:', JSON.stringify(fieldsResult));
    }

    return res.status(200).json({ success: true, contactId, fieldsResult });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message, stack: err.stack });
  }
}
