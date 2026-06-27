# Jayashree Selvi — AWS Solutions Architect Portfolio (local mode)

A full-stack career dashboard: React frontend, Express/MongoDB backend, JWT
admin auth. This version is set up to run entirely on your own machine —
no AWS account, no deployment. File uploads (resume, certificate badges)
save to a local folder instead of S3.

```
aws-portfolio/
├── frontend/    React + Vite + Tailwind (the site you see in the browser)
└── backend/     Express + MongoDB API (data, auth, local file storage)
```

---

## What you need before running this

The only external thing you need is a **MongoDB connection string** — the
backend won't start without one. Everything else runs locally.

### Set up MongoDB (free, ~5 minutes)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a free-tier (M0) cluster — any nearby region is fine.
3. Under **Database Access**, create a database user with a username and password. Save these.
4. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) — fine for local development.
5. Click **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` / `<password>`, and add `/portfolio` before the `?` so it reads from a database named `portfolio`.

That's the only account you need to create.

---

## Running it

You'll need **two terminal windows open at the same time** — one for the
backend, one for the frontend.

### Terminal 1 — backend

```bash
cd backend
cp .env.example .env
```

Open `.env` in a text editor and fill in:
- `MONGO_URI` — from the MongoDB step above
- `JWT_SECRET` — any long random string (run `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` to generate one)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — pick your own; this is your admin login

Leave `PUBLIC_BASE_URL` and `CLIENT_ORIGIN` as their defaults.

Then:

```bash
npm install
npm run seed     # creates your admin user + starter projects/skills/certs
npm run dev       # starts the API on http://localhost:5000
```

Check it worked: open `http://localhost:5000/api/health` — you should see `{"ok":true}`.

### Terminal 2 — frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

It'll print a local URL, usually `http://localhost:5173`.

---

## Using it

- **Public site**: `http://localhost:5173`
- **Admin login**: `http://localhost:5173/admin/login` — sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env`
- Once signed in, you can edit skills directly from the Skills page, see visitor stats and contact messages on `/admin`, and upload a resume from the Resume page.

Uploaded files (resume PDF, certificate badges) save into `backend/uploads/`
on your machine and are served at `http://localhost:5000/files/...`. This
folder is gitignored — it won't get committed if you push this to GitHub.

---

## Add your real content

The database is currently seeded with placeholder projects, skills, and
certificates based on what you described earlier. To replace them:

- Sign in as admin and edit skills directly in the UI (full add/edit/delete is built), or
- Edit `backend/seed.js`, drop your local MongoDB database, and re-run `npm run seed`, or
- Use [MongoDB Compass](https://www.mongodb.com/products/compass) (a free GUI) to edit documents directly — connect it with the same `MONGO_URI`.

Also replace the placeholder GitHub/LinkedIn/email links in
`frontend/src/components/Sidebar.jsx`, `Home.jsx`, and `Contact.jsx` with
your real ones.

---

## When you're ready to deploy (later, with CI/CD + CloudFront)

This version stores files on local disk instead of S3 so you can run it
without an AWS account today. When you're ready to deploy:

1. Swap `backend/config/s3.js` back to using the AWS SDK (`@aws-sdk/client-s3`) — the function names (`uploadToS3`, `deleteFromS3`, `s3KeyFromUrl`) are identical, so no route files need to change.
2. Add your AWS S3 bucket + IAM credentials to environment variables.
3. Set up your CI/CD pipeline and CloudFront distribution as planned.

Let me know when you get there and I can help build that out — happy to
write the GitHub Actions workflow, the S3 swap-back, and the CloudFront
config when you're ready.

---

## What's already built vs. what's a stretch goal

**Built and working:**
- All 7 pages (Home, About, Skills, Projects + detail, Certificates, Resume, Contact) with routing
- Admin login (JWT), protected admin dashboard
- Skills: full add/edit/delete from the UI
- Projects, certificates: API supports full CRUD; UI currently reads + lets admins see an "add" button stub
- Resume upload with automatic versioning, view/download (now via local disk)
- Visitor tracking + admin analytics summary
- Contact form → saved to database, visible in admin dashboard
- Career progress dashboard with editable sliders (admin) and public progress bars

**Stubbed, worth building next as you get comfortable with the codebase:**
- Full add/edit forms for projects and certificates in the UI (API endpoints already exist)
- Blog section UI (API exists at `/api/blog`, no frontend pages yet)
- Architecture diagram / screenshot upload UI (API exists at `/api/upload/projects/:id/architecture`)
- Image-based AWS Service Explorer, testimonials, search/filter polish
