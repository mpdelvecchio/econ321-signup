# ECON 321 – Topic and Time Slot Sign-Ups

A small website where students sign up for a paper/presentation topic and a
presentation time slot (first come, first served, one student per slot). Signups
are saved to a Google Sheet.

| File | What it is |
|---|---|
| `index.html` | Landing page linking to both sign-up sheets (this is the link you email) |
| `topics.html` | Topic sign-up |
| `times.html` | Time slot sign-up (Tuesday, December 8) |
| `slots.js` | The topics and time slots — edit text or add slots here |
| `config.js` | Holds the Google Apps Script Web App URL and your contact email |
| `signup.js`, `style.css` | Page logic and styling |
| `apps-script/Code.gs` | Code that goes in the Google Sheet to collect signups |

## How it works
- Students enter their name and email only.
- A slot shows as **Taken · First L.** once claimed. Full names and emails are only in your Google Sheet.
- Each email can hold one topic and one time slot. A second attempt gets a message to contact you.
- If two students click the same slot at the same moment, only the first is saved; the second is told to pick another.
- **To remove or change a signup:** delete that student's row in the Google Sheet. The slot reopens on the website.

## Setup

### Step 1: Create the GitHub repository
github.com/new → name it `econ321-signup` → **Public** → leave "Add a README"
unchecked → **Create repository**. Then on the new repo page click
**uploading an existing file**, drag in every file from this folder (including the
`apps-script` folder), and click **Commit changes**.

### Step 2: Turn on GitHub Pages
In the repo: **Settings → Pages** → Source = **Deploy from a branch**, Branch =
**main**, folder **/ (root)** → **Save**. After a minute the site is at
`https://mpdelvecchio.github.io/econ321-signup/`.

### Step 3: Set up the Google Sheet that collects signups
1. Go to sheets.google.com and create a blank spreadsheet (name it e.g. "ECON 321 Sign-Ups FA26").
2. **Extensions → Apps Script**. Delete what's in `Code.gs` and paste in the contents of `apps-script/Code.gs`. Click **Save** (💾).
3. Optional: in the function dropdown at the top choose **setup** and click **Run** to create the "Topics" and "Time Slots" tabs now (they're also created automatically on the first signup).
4. **Deploy → New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, then **Authorize access** and allow it (if Google warns the app isn't verified, click *Advanced → Go to (project name)*; it's your own script).
5. Copy the **Web app URL** (ends in `/exec`).

### Step 4: Connect the site to the sheet
In GitHub open `config.js` → pencil icon (Edit) → replace `PASTE_YOUR_WEB_APP_URL_HERE`
with the Web App URL (keep the quotes) → **Commit changes**.

### Step 5: Test, then send
1. Open `https://mpdelvecchio.github.io/econ321-signup/`, sign up for a topic and a time slot with a test name.
2. Check that rows appear on the "Topics" and "Time Slots" tabs of the sheet.
3. Delete both test rows, refresh the website, and confirm the slots show as open again.
4. Email students the link: `https://mpdelvecchio.github.io/econ321-signup/`

## Notes
- Preview with fake data anytime (nothing is saved): add `?demo=1`, e.g. `.../topics.html?demo=1`.
- **If you change `Code.gs` later**, use **Deploy → Manage deployments → ✏️ → Version: New version → Deploy** so the URL stays the same.
- **Adding time slots:** add a line to the `times` list in `slots.js` with a new id (`S10`, `S11`, …). Ids must be a letter plus two digits.
- Don't change or reorder ids after students have signed up; the sheet records signups by id.
