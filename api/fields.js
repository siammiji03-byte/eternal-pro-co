export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.systeme.io/api/contact-fields?limit=50', {
      headers: {
        'X-API-Key': '5ka1a58mw8vldwf587i8lb1pt2avqgzbjmeidvsp8gsme7i32lbdazbu2erygc0y'
      }
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
