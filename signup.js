// Shared logic for topics.html and times.html. Each page sets
// <body data-sheet="topics"> or <body data-sheet="times">.
(function () {
  const KEY = document.body.dataset.sheet;
  const SHEET = SHEETS[KEY];
  const DEMO = new URLSearchParams(location.search).has("demo");
  const listEl = document.getElementById("list");
  const statusEl = document.getElementById("statusText");
  const topEl = document.getElementById("topNotice");
  const MINE_KEY = "econ321-" + KEY + "-mine";

  let taken = {};        // slotId -> display name ("Jane D.")
  let openId = null;     // slot whose form is open

  document.getElementById("pageTitle").textContent = SHEET.title;
  document.getElementById("pageIntro").textContent = SHEET.intro;
  document.title = "ECON 321 – " + SHEET.title;
  document.querySelectorAll(".instructorEmail").forEach(a => {
    a.textContent = INSTRUCTOR_EMAIL;
    a.href = "mailto:" + INSTRUCTOR_EMAIL;
  });

  function getMine() { try { return localStorage.getItem(MINE_KEY); } catch (_) { return null; } }
  function setMine(id) { try { localStorage.setItem(MINE_KEY, id); } catch (_) {} }

  // ---- Talking to the Google Sheet (or a fake one in demo mode) ----
  const demoTaken = { [SHEET.slots[1].id]: "Jordan P.", [SHEET.slots[4].id]: "Sam R." };

  async function fetchTaken() {
    if (DEMO) return { ok: true, taken: { ...demoTaken } };
    const res = await fetch(SCRIPT_URL + "?sheet=" + encodeURIComponent(KEY) + "&t=" + Date.now());
    return res.json();
  }

  async function postSignup(payload) {
    if (DEMO) {
      await new Promise(r => setTimeout(r, 500));
      if (demoTaken[payload.slotId]) return { ok: false, error: "Sorry, someone else just took that one. Please pick another." };
      demoTaken[payload.slotId] = shortName(payload.name);
      return { ok: true };
    }
    // text/plain keeps this a "simple" request, so the browser doesn't send a
    // CORS preflight (which Apps Script can't answer).
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  function shortName(name) {
    const parts = name.trim().split(/\s+/);
    const first = parts[0];
    return parts.length > 1 ? first + " " + parts[parts.length - 1][0].toUpperCase() + "." : first;
  }

  // ---- Rendering ----
  function render() {
    const mine = getMine();
    const hasMine = mine && taken[mine];
    const open = SHEET.slots.filter(s => !taken[s.id]).length;
    statusEl.textContent = `${open} of ${SHEET.slots.length} open`;

    listEl.innerHTML = "";
    SHEET.slots.forEach((s, i) => {
      const wrap = document.createElement("div");
      wrap.className = "slot-wrap" + (openId === s.id ? " open" : "");
      const isTaken = !!taken[s.id];
      const isMine = isTaken && s.id === mine;
      let action;
      if (isMine) action = `<span class="pill ok">Your signup</span>`;
      else if (isTaken) action = `<span class="pill">Taken · ${esc(taken[s.id])}</span>`;
      else if (openId === s.id) action = `<button class="btn ghost small" type="button" data-cancel>Cancel</button>`;
      else action = `<button class="btn small" type="button" data-pick="${s.id}"${hasMine ? " disabled" : ""}>Sign up</button>`;

      wrap.innerHTML = `
        <div class="card slot${isTaken ? " taken" : ""}${isMine ? " mine" : ""}">
          <div class="num">${i + 1}</div>
          <div class="body">
            <p class="title">${esc(s.title)}</p>
            ${s.detail ? `<p class="detail">${esc(s.detail)}</p>` : ""}
          </div>
          <div class="action">${action}</div>
        </div>`;
      if (openId === s.id) wrap.appendChild(buildForm(s));
      listEl.appendChild(wrap);
    });

    if (hasMine) {
      const s = SHEET.slots.find(x => x.id === mine);
      showTop("notice", `<h2>You're signed up</h2><p><b>${esc(s.title)}</b>${s.detail ? " — " + esc(s.detail) : ""}.
        To change it, email <a class="instructorEmail" href="mailto:${INSTRUCTOR_EMAIL}">${INSTRUCTOR_EMAIL}</a>.</p>`);
    }
  }

  function buildForm(s) {
    const form = document.createElement("form");
    form.className = "signup-form";
    form.noValidate = true;
    form.innerHTML = `
      <div class="two">
        <label class="field"><b>Your name</b>
          <input name="name" type="text" autocomplete="name" required placeholder="First and last name"></label>
        <label class="field"><b>Your email</b>
          <input name="email" type="email" autocomplete="email" required placeholder="you@svsu.edu"></label>
      </div>
      <div class="row">
        <button class="btn" type="submit">Confirm signup</button>
        <span class="hint">For: ${esc(s.title)}</span>
      </div>
      <p class="error" hidden></p>`;
    form.addEventListener("submit", e => submit(e, s, form));
    setTimeout(() => form.querySelector("input").focus(), 0);
    return form;
  }

  async function submit(e, s, form) {
    e.preventDefault();
    const err = form.querySelector(".error");
    const btn = form.querySelector("button[type=submit]");
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    err.hidden = true;
    if (name.split(/\s+/).length < 2) return showErr(err, "Please enter your first and last name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showErr(err, "Please enter a valid email address.");

    btn.disabled = true; btn.textContent = "Saving…";
    try {
      const r = await postSignup({ sheet: KEY, slotId: s.id, slotLabel: s.title + (s.detail ? " (" + s.detail + ")" : ""), name, email });
      if (r.ok) {
        setMine(s.id);
        openId = null;
        await refresh();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        btn.disabled = false; btn.textContent = "Confirm signup";
        showErr(err, r.error || "Something went wrong. Please try again.");
        if (r.refresh) refresh();
      }
    } catch (ex) {
      btn.disabled = false; btn.textContent = "Confirm signup";
      showErr(err, "Couldn't reach the sign-up sheet. Check your connection and try again.");
    }
  }

  function showErr(el, msg) { el.textContent = msg; el.hidden = false; }
  function showTop(cls, html) { topEl.className = "card " + cls; topEl.innerHTML = html; topEl.hidden = false; }
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  listEl.addEventListener("click", e => {
    const pick = e.target.closest("[data-pick]");
    if (pick) { openId = pick.dataset.pick; render(); return; }
    if (e.target.closest("[data-cancel]")) { openId = null; render(); }
  });

  async function refresh() {
    statusEl.textContent = "Checking for updates…";
    try {
      const r = await fetchTaken();
      if (!r.ok) throw new Error(r.error);
      taken = r.taken || {};
      render();
    } catch (ex) {
      statusEl.textContent = "";
      listEl.innerHTML = "";
      showTop("warn", `<p>Couldn't load the sign-up sheet. Please refresh the page in a minute. If it keeps happening,
        email <a href="mailto:${INSTRUCTOR_EMAIL}">${INSTRUCTOR_EMAIL}</a>.</p>`);
    }
  }
  document.getElementById("refreshBtn").addEventListener("click", refresh);

  if (!DEMO && (!SCRIPT_URL || SCRIPT_URL.startsWith("PASTE_"))) {
    listEl.innerHTML = "";
    statusEl.textContent = "";
    showTop("warn", `<p>This sign-up sheet isn't connected to its Google Sheet yet (config.js needs the Web App URL).
      Add <code>?demo=1</code> to the address to preview it with sample data.</p>`);
  } else {
    if (DEMO) showTop("warn", "<p><b>Demo mode.</b> Sample data only; nothing is saved.</p>");
    refresh();
  }
})();
