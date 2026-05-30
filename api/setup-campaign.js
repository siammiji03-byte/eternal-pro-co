const API_KEY = '5ka1a58mw8vldwf587i8lb1pt2avqgzbjmeidvsp8gsme7i32lbdazbu2erygc0y';
const HEADERS = {
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY
};

const EMAILS = [
  {
    name: 'Email 1 — Revenue leak breakdown',
    subject: 'Your revenue leak breakdown — Eternal Property Co',
    delayInDays: 0,
    body: `<p>Hi,</p>
<p>You just ran the revenue leak calculator on eternalpropertyco.com — here's what it means.</p>
<p>Based on the numbers you entered, your portfolio is likely leaving a significant amount on the table each year. That gap comes from a combination of pricing that isn't adapting daily to demand, manual operations, and inconsistent guest communication.</p>
<p>These aren't hosting problems. They're systems problems — and they're fixable.</p>
<p>The next step is a free 30-minute audit. I'll look at your listings directly and show you specifically where the money is going and what to do about it.</p>
<p><a href="https://tally.so/r/rjox22">Book your free audit →</a></p>
<p>— Siam<br>Eternal Property Co</p>`
  },
  {
    name: 'Email 2 — #1 reason hosts plateau',
    subject: 'The #1 reason Airbnb hosts plateau (it\'s not what you think)',
    delayInDays: 2,
    body: `<p>Most hosts I speak to think their problem is occupancy.</p>
<p>They want more bookings. So they lower their price, update their photos, rewrite their listing description.</p>
<p>The actual problem is usually dynamic pricing — or the lack of it.</p>
<p>Static or seasonally-set rates miss daily demand shifts, local events, and shoulder season opportunities. I've seen hosts increase revenue 15–20% without touching their listing or photos — just by switching to proper daily rate optimisation.</p>
<p>If you haven't already, the free audit covers your pricing setup specifically.</p>
<p><a href="https://tally.so/r/rjox22">Book the audit →</a></p>
<p>— Siam</p>`
  },
  {
    name: 'Email 3 — Client result',
    subject: '"I hadn\'t replied to a guest in over a month"',
    delayInDays: 4,
    body: `<p>One of our clients — 9 listings in Edinburgh — told me recently that she hadn't manually replied to a guest in over a month.</p>
<p>That's not because she stopped caring about guests. Her review average is 4.91.</p>
<p>It's because the messaging system we set up handles it. Automated responses to the 90% of questions that repeat, structured check-in instructions, and a post-stay follow-up that consistently generates reviews — all running without her.</p>
<p>If you're still answering the same guest questions every week, that's time you could get back.</p>
<p>I can show you exactly how this works for your portfolio on the free call.</p>
<p><a href="https://tally.so/r/rjox22">Book a free audit →</a></p>
<p>— Siam</p>`
  },
  {
    name: 'Email 4 — Check in',
    subject: 'Quick question about your portfolio',
    delayInDays: 7,
    body: `<p>I wanted to check in.</p>
<p>You ran the revenue leak calculator a week ago. Have you had a chance to look at your pricing or operations since then?</p>
<p>If you're still managing things manually — chasing cleaners, answering guest messages, checking rates by hand — the audit is the fastest way to get a clear picture of what to fix first.</p>
<p>It's 30 minutes, no pitch unless you ask for one. I look at your specific listings and tell you what the numbers actually show.</p>
<p><a href="https://tally.so/r/rjox22">Pick a time →</a></p>
<p>— Siam</p>`
  },
  {
    name: 'Email 5 — Last follow-up',
    subject: 'Last one from me (unless you want more)',
    delayInDays: 14,
    body: `<p>This is the last email I'll send you about the audit unless you book one.</p>
<p>If now isn't the right time, no problem — hold onto the link and use it when it makes sense.</p>
<p>If you're still losing revenue to manual pricing, slow operations, or inconsistent reviews, the audit is where that gets fixed. It costs nothing and takes 30 minutes.</p>
<p><a href="https://tally.so/r/rjox22">Book the free audit →</a></p>
<p>— Siam<br>siam@eternalpropertyco.com · +39 320 911 3237</p>`
  }
];

export default async function handler(req, res) {
  try {
    // Step 1: Find the Revenue Leak Leads campaign
    const campaignsRes = await fetch('https://api.systeme.io/api/campaigns?limit=50', { headers: HEADERS });
    const campaignsData = await campaignsRes.json();
    const campaign = campaignsData.items && campaignsData.items.find(c => c.name === 'Revenue Leak Leads');

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign "Revenue Leak Leads" not found', available: campaignsData.items && campaignsData.items.map(c => c.name) });
    }

    const campaignId = campaign.id;

    // Step 2: Check existing emails
    const existingRes = await fetch(`https://api.systeme.io/api/campaigns/${campaignId}/emails?limit=50`, { headers: HEADERS });
    const existingData = await existingRes.json();
    const existingCount = existingData.items ? existingData.items.length : 0;

    if (existingCount > 0) {
      return res.status(200).json({ message: `Campaign already has ${existingCount} emails. No changes made.`, emails: existingData.items.map(e => e.subject) });
    }

    // Step 3: Create each email
    const results = [];
    for (const email of EMAILS) {
      const emailRes = await fetch(`https://api.systeme.io/api/campaigns/${campaignId}/emails`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          name: email.name,
          subject: email.subject,
          body: email.body,
          delayInDays: email.delayInDays
        })
      });
      const emailData = await emailRes.json();
      results.push({ subject: email.subject, delay: email.delayInDays, status: emailRes.status, id: emailData.id });
    }

    return res.status(200).json({ success: true, campaignId, emailsCreated: results });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
