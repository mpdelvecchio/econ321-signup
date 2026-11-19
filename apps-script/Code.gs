// ECON 321 sign-ups: receives signups from the website and saves them in this
// Google Sheet. One tab per sign-up sheet ("Topics" and "Time Slots").
//
// To remove or change a student's signup, delete their row in the tab. The
// slot reopens on the website the next time a student loads or refreshes it.

const TABS = { topics: "Topics", times: "Time Slots" };
const HEADERS = ["Timestamp", "Slot ID", "Slot", "Name", "Email"];

function doGet(e) {
  const key = e && e.parameter && e.parameter.sheet;
  if (!TABS[key]) return json({ ok: false, error: "Unknown sign-up sheet." });
  const taken = {};
  readRows(key).forEach(r => { taken[r.slotId] = shortName(r.name); });
  return json({ ok: true, taken: taken });
}

function doPost(e) {
  let p;
  try { p = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false, error: "Bad request." }); }

  const key = p.sheet;
  const slotId = String(p.slotId || "").trim();
  const name = String(p.name || "").trim().slice(0, 100);
  const email = String(p.email || "").trim().toLowerCase().slice(0, 120);
  const label = String(p.slotLabel || "").trim().slice(0, 300);

  if (!TABS[key]) return json({ ok: false, error: "Unknown sign-up sheet." });
  if (!/^[A-Z]\d{2}$/.test(slotId)) return json({ ok: false, error: "Unknown slot." });
  if (name.split(/\s+/).length < 2) return json({ ok: false, error: "Please enter your first and last name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false, error: "Please enter a valid email address." });

  // The lock makes signups one-at-a-time, so two students can't grab the same
  // slot in the same instant.
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return json({ ok: false, error: "The sheet is busy. Please try again in a few seconds." });
  try {
    const rows = readRows(key);
    if (rows.some(r => r.slotId === slotId)) {
      return json({ ok: false, refresh: true, error: "Sorry, someone else just took that one. Please pick another." });
    }
    const existing = rows.find(r => r.email === email);
    if (existing) {
      return json({ ok: false, refresh: true,
        error: "This email is already signed up for: " + existing.label + ". To change it, email your instructor." });
    }
    sheetFor(key).appendRow([new Date(), slotId, label, name, email]);
    return json({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function sheetFor(key) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(TABS[key]);
  if (!sh) {
    sh = ss.insertSheet(TABS[key]);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sh;
}

function readRows(key) {
  const sh = sheetFor(key);
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, HEADERS.length).getValues()
    .filter(v => v[1])
    .map(v => ({ slotId: String(v[1]).trim(), label: String(v[2]), name: String(v[3]), email: String(v[4]).trim().toLowerCase() }));
}

// Public list shows "First L." only; full names and emails stay in the sheet.
function shortName(name) {
  const parts = String(name).trim().split(/\s+/);
  return parts.length > 1 ? parts[0] + " " + parts[parts.length - 1].charAt(0).toUpperCase() + "." : parts[0];
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Run this once from the Apps Script editor (select "setup" → Run) to create
// both tabs ahead of time. Optional; they're also created on first use.
function setup() {
  Object.keys(TABS).forEach(sheetFor);
}
