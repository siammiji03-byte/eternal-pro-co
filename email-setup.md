# Formspree Auto-Reply Email Setup

The thank-you page is live. Now set up the email that auto-sends to people who submit the calculator.

---

## Setup steps (10 minutes)

### 1. Log in to Formspree
Go to [formspree.io](https://formspree.io) → sign in → open your "Revenue Leak Calculator" form (form ID `xpqbbzbk`).

### 2. Open the auto-reply settings
Inside the form, click **Settings** (top right) → **Notifications** tab → look for **"Autoresponder"** or **"Auto-reply email"**.

(Note: Auto-reply is a Formspree **Pro feature** at $10/month. If you want it on the free tier, see "Free tier alternative" at the bottom of this doc.)

### 3. Configure the auto-reply

- **From name:** `Siam · Eternal Property Co`
- **From email:** `siam@eternalpropertyco.com` (your verified sender)
- **Reply-to:** `siam@eternalpropertyco.com`
- **Subject:** `Your revenue leak breakdown — Eternal Property Co`
- **Send to:** select the field `email` (this routes the email to whoever submitted)

### 4. Paste the email body

Copy the HTML email content from the file `auto-reply-email.html` (also in this folder) into the Body field. Make sure the editor mode is set to **HTML**, not plain text.

If your Formspree plan only supports plain text email body, use the `auto-reply-email.txt` version instead.

### 5. Save and test

Submit a test entry on your live site using your own email. Within a minute, check inbox + spam. The auto-reply should arrive.

---

## What the email does

- Thanks them by name (well, by email since we don't capture name — but it's personal in tone)
- Shows their submitted numbers back to them (listings, rate, occupancy)
- Restates their estimated leak figure
- Breaks down WHERE the leak comes from (pricing, ops, etc.)
- Single clear CTA: book the free audit
- Soft P.S. linking WhatsApp for quick questions

## What it does NOT do

- It's not a long-form newsletter
- It doesn't pitch anything beyond the free audit
- It doesn't ask for more info — that's the audit's job

---

## Free tier alternative (no Pro subscription needed)

If you don't want to pay $10/month for Formspree Pro, two options:

### Option A: Manual reply (works for the first few weeks)
Every time you get a notification email from Formspree (which goes to siam@eternalpropertyco.com automatically on every plan), reply manually using a saved Gmail template. Keep the `auto-reply-email.txt` content as a template in Gmail (Settings → Templates).

Pros: Free. Feels even more personal.
Cons: Doesn't scale beyond ~20 submissions/week.

### Option B: Use a Formspree alternative with free auto-reply
Services that include auto-reply on their free tiers:
- **Web3Forms** — free, auto-reply included, simple swap-in for Formspree
- **Getform** — free tier with 50 submissions/month + auto-reply
- **Basin** — paid only but cheaper than Formspree Pro at $6/month

Switching means changing one line in `index.html` (`FORMSPREE_ENDPOINT`) to the new service's endpoint URL.

---

## Variable placeholders in the email

Formspree lets you insert form field values into the email using `{{ field_name }}` syntax. The form fields available are:

- `{{ email }}` — visitor's email
- `{{ listings }}` — number of listings they entered
- `{{ nightly_rate }}` — average nightly rate
- `{{ occupancy_pct }}` — occupancy percentage
- `{{ dynamic_pricing }}` — `no` / `basic` / `full`
- `{{ annual_revenue }}` — calculated annual revenue
- `{{ estimated_leak }}` — the leak number

These are already used in the email template — just paste it in and Formspree handles substitution.
