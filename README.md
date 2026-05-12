# Eternal Property Co — Website

Production-ready static site. Three ways to deploy it for free.

---

## Three deploy options — pick the easiest one that works

### Option A — Cloudflare Pages (recommended right now)

**Why:** No password-protection traps, no file size limits, generous free tier, easy custom domain.

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com) and sign up (free)
2. Click **Create application** → **Pages** → **Upload assets**
3. Drag this entire `eternal-site` folder onto the upload zone (or zip it first if upload is faster)
4. Give the project a name (e.g. `eternal-property-co`)
5. Click **Deploy site** — done, you're live on a `pages.dev` URL
6. To use your custom domain: **Custom domains** tab → **Set up a custom domain** → enter `eternalpropertyco.com` → Cloudflare gives you DNS instructions to add at Hostinger (CNAME or change nameservers)

### Option B — Netlify

Free tier works but Netlify sometimes auto-enables password protection during a Pro trial that you can't disable yourself. If you hit this:
1. **Site configuration** → scroll to bottom → **Delete site**
2. Sign out fully, sign back in
3. **Add new site** → **Deploy manually** → drag the folder
4. New site = no protection

### Option C — Vercel + external VSL hosting

Vercel limits single files to ~25MB on free tier, so the 35MB VSL is too big. Solution:
1. Upload your VSL to YouTube as **unlisted** (free, unlimited bandwidth)
2. In `index.html`, find the `<video>` block in the hero section and replace it with a YouTube iframe (see "VSL embed swap" below)
3. Delete `/assets/video/vsl.mp4` from the folder before pushing to GitHub/Vercel
4. Push to a GitHub repo, connect Vercel to it, deploy

---

## VSL embed swap (for hosting VSL externally)

Find this block in `index.html`:

```html
<video controls preload="metadata" poster="/assets/images/poster.jpg" playsinline>
  <source src="/assets/video/vsl.mp4" type="video/mp4">
</video>
```

Replace with:

```html
<iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
        allow="autoplay; encrypted-media; fullscreen" 
        allowfullscreen 
        style="width:100%;height:100%;border:0"></iframe>
```

Replace `YOUR_VIDEO_ID` with the ID from your YouTube unlisted URL (the part after `v=`).

---

## Formspree setup — required for the email-gated calculator

The revenue leak calculator now captures the user's email before revealing their result. You need a free Formspree account to receive these submissions.

### Setup (5 minutes)

1. Go to [formspree.io](https://formspree.io) → sign up (free, 50 submissions/month on free tier)
2. Click **New Form** → name it "Revenue Leak Calculator" → set your receiving email to `siam@eternalpropertyco.com`
3. Formspree gives you a URL like `https://formspree.io/f/abcd1234`
4. Open `index.html`, find this line near the bottom of the script:
   ```js
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
   ```
5. Replace `YOUR_FORM_ID` with the ID Formspree gave you (the `abcd1234` part)
6. Save and re-upload

Every calculator submission delivers to your inbox with: email, listings, nightly rate, occupancy, dynamic pricing status, and the estimated leak figure.

---

## Folder structure

```
eternal-site/
├── index.html              ← the site
├── netlify.toml            ← Netlify deploy config (ignored on Cloudflare/Vercel)
├── robots.txt + sitemap.xml ← SEO
├── README.md               ← this file
└── assets/
    ├── video/vsl.mp4       ← your VSL, web-optimised (35MB)
    └── images/
        ├── logo-black.png  ← logo on dark backgrounds (nav, footer)
        ├── logo-white.png  ← logo on light backgrounds (spare)
        ├── favicon.png     ← browser tab icon
        ├── poster.jpg      ← VSL thumbnail
        ├── about.jpg       ← about-section image
        └── og-image.jpg    ← social share preview
```

---

## Custom domain setup (Hostinger → any host)

If you move to **Cloudflare Pages**:
1. Add your domain in Cloudflare Pages → Custom Domains
2. Cloudflare gives you exact CNAME records to add at Hostinger
3. Update Hostinger DNS, wait 10-60 min

If you move to **Vercel**:
1. Add domain in Vercel → Settings → Domains
2. Follow Vercel's exact instructions for CNAME records at Hostinger

Always change DNS records AFTER the new deployment is live and working on its temporary URL.

---

## Editing the site

Single `index.html` file. Open in any text editor, save, re-upload (or push to GitHub if you're on Vercel/Cloudflare with Git connected — auto-deploys).

Email: siam@eternalpropertyco.com
