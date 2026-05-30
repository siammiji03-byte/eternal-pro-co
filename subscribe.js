export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, listings, nightly_rate, occupancy_pct, estimated_leak } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const response = await fetch('https://api.systeme.io/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': '5ka1a58mw8vldwf587i8lb1pt2avqgzbjmeidvsp8gsme7i32lbdazbu2erygc0y'
      },
      body: JSON.stringify({
        email,
        fields: [
          { slug: 'nightly_rate',   value: String(nightly_rate || '') },
          { slug: 'estimated_leak', value: String(estimated_leak || '') },
          { slug: 'occupancy',      value: String(occupancy_pct || '') }
        ],
        tags: [{ name: 'revenue-leak-lead' }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Systeme.io error:', data);
      return res.status(response.status).json({ error: 'Failed to subscribe', details: data });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
