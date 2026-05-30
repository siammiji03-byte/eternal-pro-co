export default async function handler(req, res) {
  const contactId = 425278704;

  try {
    const r = await fetch(`https://api.systeme.io/api/contacts/${contactId}`, {
      headers: {
        'X-API-Key': '5ka1a58mw8vldwf587i8lb1pt2avqgzbjmeidvsp8gsme7i32lbdazbu2erygc0y'
      }
    });
    const data = await r.json();
    return res.status(200).json({
      email: data.email,
      tags: data.tags,
      fields: data.fields
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
