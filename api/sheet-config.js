// api/sheet-config.js
// Serves window.SHEET_CFG from the SHEET_CONFIG Vercel env var (JSON string),
// per the Skinuva-pattern architecture note in évolis's index.html:
// "a server-side SHEET_CONFIG Vercel env var + api/sheet-config.js endpoint,
// injected as window.SHEET_CFG before any other script runs."
//
// NOTE: key names below are a proposal based on évolis's existing hardcoded
// const names (REVENUE_GID, WALMART_GID, etc.) — they have NOT been checked
// against Skinuva's actual api/sheet-config.js, since that file wasn't
// available in this session. Confirm/adjust key names against the real
// Skinuva implementation before wiring this in, per the playbook's own
// "fetch and look before assuming" rule.

module.exports = (req, res) => {
  const cfg = process.env.SHEET_CONFIG;
  res.setHeader('Content-Type', 'application/javascript');
  if (!cfg) {
    res.status(200).send('window.SHEET_CFG = {}; console.warn("[sheet-config] SHEET_CONFIG env var not set");');
    return;
  }
  try {
    JSON.parse(cfg); // validate before trusting it into a <script>
    res.status(200).send(`window.SHEET_CFG = ${cfg};`);
  } catch (e) {
    res.status(200).send('window.SHEET_CFG = {}; console.error("[sheet-config] SHEET_CONFIG env var is not valid JSON");');
  }
};
