const demoData = {
  requests: [
    ["Analyst", "Threat intel", "Publish sanitized activity-cluster brief", "new"],
    ["Ops", "Detection", "Add identity reset burst hunt", "triage"],
    ["Client", "IR support", "Review endpoint beaconing timeline", "queued"]
  ],
  focus: [
    { title: "Disable suspicious account session", meta: "Approval required • Identity case 1042 • High priority", status: "blocked", level: "high" },
    { title: "Endpoint beaconing review", meta: "Playbook running • Host containment checks pending", status: "monitoring", level: "medium" },
    { title: "Client report publication", meta: "Delivery lane • PDF QA and archive sync", status: "review", level: "normal" },
    { title: "OAuth app consent audit", meta: "Investigation lane • Needs analyst owner", status: "todo", level: "normal" }
  ],
  cases: [
    [1042, "Suspicious identity reset burst", "identity", "high", "open", "Artifact bundle attached and analyst triage is in progress."],
    [1038, "Endpoint beaconing review", "endpoint", "medium", "monitoring", "Playbook queued for observable enrichment and host containment checks."],
    [1035, "OAuth app consent audit", "cloud", "medium", "open", "New delegated app scopes were grouped for review."],
    [1029, "Public report publication", "delivery", "low", "review", "Draft is waiting for final QA and archive sync."]
  ],
  playbooks: [
    { title: "Identity triage", scope: "identity", description: "Collect reset activity, sign-in telemetry, and asset context before operator review.", steps: ["Collect evidence", "Enrich accounts", "Assess blast radius", "Escalate"] },
    { title: "Endpoint enrichment", scope: "endpoint", description: "Normalize host indicators, review detections, and stage containment recommendations.", steps: ["Pull host facts", "Attach observables", "Check detections", "Recommend"] },
    { title: "Phishing intake", scope: "mail", description: "Extract message artifacts, map recipients, and prepare follow-up actions.", steps: ["Parse headers", "Extract URLs", "Score risk", "Notify"] }
  ],
  approvals: [
    { title: "Account session disable", status: "pending", description: "Human approval required before impacting a business-critical user." },
    { title: "Contain endpoint", status: "pending", description: "Hold containment until evidence package is reviewed by an operator." },
    { title: "Publish client brief", status: "approved", description: "Manual QA override recorded for sanitized demo content." }
  ],
  documents: [
    ["Identity Reset Burst - Executive Brief.pdf", "Report", "2026-10-07", "Final"],
    ["Endpoint Beaconing Case Notes.pdf", "Case", "2026-10-06", "Review"],
    ["SOAR Playbook Catalog.csv", "Export", "2026-10-05", "Final"]
  ],
  deliverables: [
    { title: "Weekly client threat brief", status: "review", description: "Final PDF staged; waiting on owner signoff." },
    { title: "Detection engineering bundle", status: "drafting", description: "Sigma, KQL, and hunt notes grouped for QA." },
    { title: "OpenCTI upload reconciliation", status: "planned", description: "Queue idempotent task after final metadata check." }
  ]
};

const emptyData = { requests: [], focus: [], cases: [], playbooks: [], approvals: [], documents: [], deliverables: [] };
let current = structuredClone(demoData);

const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);

function pill(status, level = "") {
  const cls = level === "high" ? " high" : level === "medium" ? " medium" : "";
  return `<span class="pill${cls}">${escapeHtml(status)}</span>`;
}

function render() {
  $("#metricRequests").textContent = current.requests.length;
  $("#metricTasks").textContent = current.focus.length;
  $("#metricCases").textContent = current.cases.length;
  $("#metricApprovals").textContent = current.approvals.filter((item) => item.status === "pending").length;

  $("#focusQueue").innerHTML = current.focus.map((item) => `
    <article class="focus-item">
      <div><strong>${escapeHtml(item.title)}</strong><div class="focus-meta">${escapeHtml(item.meta)}</div></div>
      ${pill(item.status, item.level)}
    </article>
  `).join("") || `<p class="muted">No active work in the demo queue.</p>`;

  $("#requestRows").innerHTML = current.requests.map((row) => `
    <tr><td>${escapeHtml(row[0])}</td><td>${escapeHtml(row[1])}</td><td>${escapeHtml(row[2])}</td><td>${pill(row[3])}</td></tr>
  `).join("") || `<tr><td colspan="4" class="muted">No demo requests yet.</td></tr>`;

  $("#caseRows").innerHTML = current.cases.map((row) => `
    <tr><td>${escapeHtml(row[0])}</td><td>${escapeHtml(row[1])}</td><td>${escapeHtml(row[2])}</td><td>${pill(row[3], row[3])}</td><td>${pill(row[4])}</td><td>${escapeHtml(row[5])}</td></tr>
  `).join("") || `<tr><td colspan="6" class="muted">No demo cases loaded.</td></tr>`;

  $("#playbookCards").innerHTML = current.playbooks.map((item) => `
    <article class="card-item"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><span class="pill">${escapeHtml(item.scope)}</span><div class="card-steps">${item.steps.map((step) => `<span>${escapeHtml(step)}</span>`).join("")}</div></article>
  `).join("") || `<p class="muted">No playbooks loaded.</p>`;

  $("#approvalCards").innerHTML = current.approvals.map((item) => `
    <article class="card-item"><h3>${escapeHtml(item.title)}</h3>${pill(item.status, item.status === "pending" ? "medium" : "")}<p>${escapeHtml(item.description)}</p></article>
  `).join("") || `<p class="muted">No approvals loaded.</p>`;

  $("#documentRows").innerHTML = current.documents.map((row) => `
    <tr><td>${escapeHtml(row[0])}</td><td>${escapeHtml(row[1])}</td><td>${escapeHtml(row[2])}</td><td>${pill(row[3])}</td></tr>
  `).join("") || `<tr><td colspan="4" class="muted">No documents loaded.</td></tr>`;

  $("#deliverableCards").innerHTML = current.deliverables.map((item) => `
    <article class="card-item"><h3>${escapeHtml(item.title)}</h3>${pill(item.status)}<p>${escapeHtml(item.description)}</p></article>
  `).join("") || `<p class="muted">No deliverables loaded.</p>`;
}

$("#seedDemo").addEventListener("click", () => {
  current = structuredClone(demoData);
  render();
});

$("#clearDemo").addEventListener("click", () => {
  current = structuredClone(emptyData);
  render();
});

$("#requestForm").addEventListener("submit", (event) => {
  event.preventDefault();
  current.requests.unshift([$("#requester").value, $("#category").value, $("#summary").value, "new"]);
  event.target.reset();
  render();
});

render();
