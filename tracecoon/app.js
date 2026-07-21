const sampleCase = {
  title: "Midnight OAuth Trash Dive",
  text: `On July 18, 2026 an analyst observed suspicious OAuth consent activity targeting finance users. A new application called SyncVault Helper requested Mail.Read and Files.Read.All. Shortly after approval, sign-ins from 185.220.101.47 reached login-syncvault[.]com and api.syncvault-helper.net. A sandbox run showed archive creation under C:\\Users\\Public\\cache.zip and repeated POST requests to 104.244.76.19. The actor used scheduled task persistence named OfficeTelemetryCache and executed rundll32.exe against updater.dll. A follow-up review identified the hash 44d88612fea8a8f36de82e1278abb02f and the domain cdn-syncvault-assets.com in browser history. Likely ATT&CK themes include Valid Accounts, OAuth Abuse, Scheduled Task persistence, Command and Scripting execution, Archive Collected Data, and Exfiltration over Web Service.`
};

const attackCatalog = [
  {
    key: "oauth",
    technique: "T1098 Account Manipulation",
    explanation: "An attacker may be changing account access or app permissions to keep access.",
    hunt: "Review newly consented OAuth apps, scopes, and mailbox or file access grants from the last 7 days."
  },
  {
    key: "scheduled task",
    technique: "T1053.005 Scheduled Task",
    explanation: "A scheduled task can be used to run something again later without the user noticing.",
    hunt: "Search for task creation where the task name mimics Office, telemetry, or update activity."
  },
  {
    key: "rundll32",
    technique: "T1218.011 Rundll32",
    explanation: "A normal Windows tool may be abused to run suspicious code while looking legitimate.",
    hunt: "Look for rundll32.exe launched from user-writable paths or loading DLLs outside standard program directories."
  },
  {
    key: "archive",
    technique: "T1560 Archive Collected Data",
    explanation: "The actor may be bundling files into an archive before moving them elsewhere.",
    hunt: "Find recent archive creation in public or temp paths followed by outbound network traffic."
  },
  {
    key: "post",
    technique: "T1567 Exfiltration Over Web Service",
    explanation: "Data may be leaving the environment through normal-looking web traffic.",
    hunt: "Pivot on repeated POST requests to new domains or IPs after local staging activity."
  },
  {
    key: "sandbox",
    technique: "T1588 Obtain Capabilities",
    explanation: "Sandbox evidence can help confirm what tooling or infrastructure is involved.",
    hunt: "Correlate sandbox-derived infrastructure with internal DNS, proxy, and endpoint telemetry."
  },
  {
    key: "sign-in",
    technique: "T1078 Valid Accounts",
    explanation: "A real account may be getting used in an unusual way rather than a new exploit being dropped.",
    hunt: "Review sign-ins with unusual geography, impossible travel, and first-seen user agent values."
  },
  {
    key: "dll",
    technique: "T1574 Hijack Execution Flow",
    explanation: "A DLL may be placed or loaded in a way that changes how a program runs.",
    hunt: "Hunt for DLL loads in writable directories and suspicious filename impersonation."
  }
];

const nodeColors = {
  actor: "#ff7d97",
  ioc: "#89ffdf",
  behavior: "#87a8ff",
  asset: "#f9df7d"
};

const elements = {
  caseTitle: document.getElementById("caseTitle"),
  sourceText: document.getElementById("sourceText"),
  summaryTitle: document.getElementById("summaryTitle"),
  briefText: document.getElementById("briefText"),
  stats: document.getElementById("stats"),
  actionsList: document.getElementById("actionsList"),
  triageChecklist: document.getElementById("triageChecklist"),
  toolGuide: document.getElementById("toolGuide"),
  glossary: document.getElementById("glossary"),
  indicatorList: document.getElementById("indicatorList"),
  techniqueList: document.getElementById("techniqueList"),
  huntList: document.getElementById("huntList"),
  timeline: document.getElementById("timeline"),
  graph: document.getElementById("graph"),
  graphLegend: document.getElementById("graphLegend"),
  analyzeButton: document.getElementById("analyzeButton"),
  loadSample: document.getElementById("loadSample"),
  clearCase: document.getElementById("clearCase"),
  exportButton: document.getElementById("exportButton"),
  juniorMode: document.getElementById("juniorMode")
};

let currentModel = null;
let juniorModeEnabled = true;

function applyDemoStateFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const demo = params.get("demo");
  const focus = params.get("focus");
  const juniorMode = params.get("junior");

  if (juniorMode === "false") {
    juniorModeEnabled = false;
    elements.juniorMode.checked = false;
  } else {
    juniorModeEnabled = true;
    elements.juniorMode.checked = true;
  }

  if (demo === "sample") {
    elements.caseTitle.value = sampleCase.title;
    elements.sourceText.value = sampleCase.text;
    analyzeCurrentInput();
  } else {
    clearWorkspace();
  }

  if (focus) {
    const focusMap = {
      triage: ".panel--triage",
      junior: ".panel--next-tool",
      graph: ".panel--graph",
      intel: ".panel--intel"
    };
    const selector = focusMap[focus];
    if (selector) {
      window.setTimeout(() => {
        document.querySelector(selector)?.scrollIntoView({ behavior: "instant", block: "start" });
      }, 150);
    }
  }
}

function extractMatches(text, regex, formatter = (value) => value) {
  const matches = new Set();
  for (const match of text.matchAll(regex)) {
    matches.add(formatter(match[0]));
  }
  return Array.from(matches);
}

function normalizeDomain(domain) {
  return domain.replace(/\[\.\]/g, ".").replace(/^\.+|\.+$/g, "").toLowerCase();
}

function buildModel(title, text) {
  const source = text.trim();
  const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
  const hashRegex = /\b[a-fA-F0-9]{32,64}\b/g;
  const pathRegex = /\b[A-Za-z]:\\(?:[^\\\n]+\\)*[^\\\n]+\b/g;
  const taskRegex = /\b(?:task|scheduled task)\s+(?:named\s+)?([A-Za-z0-9_\-]+)/gi;
  const domainRegex = /\b(?:[a-z0-9-]+\[\.\])+[a-z]{2,}|\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b/gi;

  const ips = extractMatches(source, ipRegex);
  const hashes = extractMatches(source, hashRegex, (value) => value.toLowerCase());
  const paths = extractMatches(source, pathRegex);
  const domains = extractMatches(source, domainRegex, normalizeDomain)
    .filter((value) => !value.endsWith(".exe") && !value.endsWith(".dll"));

  const tasks = [];
  let taskMatch;
  while ((taskMatch = taskRegex.exec(source)) !== null) {
    tasks.push(taskMatch[1]);
  }

  const behaviors = [];
  const lower = source.toLowerCase();
  [
    ["oauth consent activity", ["oauth", "consent"]],
    ["suspicious sign-in flow", ["sign-in", "login"]],
    ["scheduled task persistence", ["scheduled task", "task"]],
    ["rundll32 execution", ["rundll32"]],
    ["archive staging", ["archive", ".zip"]],
    ["web exfiltration", ["post request", "post requests", "exfil", "upload"]],
    ["sandbox corroboration", ["sandbox"]]
  ].forEach(([label, keywords]) => {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      behaviors.push(label);
    }
  });

  const entities = [
    { id: "actor-0", label: "unknown operator", type: "actor" },
    ...ips.map((value, index) => ({ id: `ip-${index}`, label: value, type: "ioc" })),
    ...domains.map((value, index) => ({ id: `domain-${index}`, label: value, type: "ioc" })),
    ...hashes.map((value, index) => ({ id: `hash-${index}`, label: value.slice(0, 16) + "...", full: value, type: "ioc" })),
    ...paths.slice(0, 4).map((value, index) => ({ id: `path-${index}`, label: value.split("\\").slice(-2).join("\\"), full: value, type: "asset" })),
    ...tasks.slice(0, 3).map((value, index) => ({ id: `task-${index}`, label: value, type: "asset" })),
    ...behaviors.map((value, index) => ({ id: `behavior-${index}`, label: value, type: "behavior" }))
  ];

  const links = [];
  entities
    .filter((entity) => entity.type !== "actor")
    .forEach((entity, index) => {
      const behaviorNode = entities.find((candidate) => candidate.type === "behavior" && index % 2 === 0)
        || entities.find((candidate) => candidate.type === "behavior");
      if (behaviorNode) {
        links.push({ source: "actor-0", target: behaviorNode.id, label: "drives" });
        links.push({ source: behaviorNode.id, target: entity.id, label: entity.type === "ioc" ? "touches" : "stages" });
      } else {
        links.push({ source: "actor-0", target: entity.id, label: "touches" });
      }
    });

  const attackMatches = attackCatalog.filter((item) => lower.includes(item.key));
  const techniques = attackMatches.length ? attackMatches : [
    {
      technique: "T1595 Active Scanning",
      explanation: "Something may have probed the environment before a clearer action was observed.",
      hunt: "Start with DNS, proxy, and endpoint logs to identify the first observable touchpoint."
    }
  ];

  const indicators = [
    ...domains.map((value) => ({ value, type: "domain", confidence: "high" })),
    ...ips.map((value) => ({ value, type: "ip", confidence: "high" })),
    ...hashes.map((value) => ({ value, type: "hash", confidence: "medium" })),
    ...tasks.map((value) => ({ value, type: "task", confidence: "medium" })),
    ...paths.slice(0, 4).map((value) => ({ value, type: "path", confidence: "medium" }))
  ];

  const timeline = [
    {
      time: "T0",
      title: "Initial signal",
      body: domains[0] || ips[0]
        ? `The first clear clue mentioned in the notes is ${domains[0] || ips[0]}.`
        : "The notes suggest a suspicious starting point, but no strong clue was extracted yet."
    },
    {
      time: "T1",
      title: "Access or execution",
      body: behaviors[0]
        ? `The notes suggest ${behaviors[0]} during an early stage of the activity.`
        : "A meaningful access or execution step is implied by the source text."
    },
    {
      time: "T2",
      title: "Persistence or staging",
      body: tasks[0] || paths[0]
        ? `Possible persistence or staging artifacts include ${tasks[0] || paths[0]}.`
        : "The case hints at persistence or staging, but the specific artifact still needs validation."
    },
    {
      time: "T3",
      title: "Collection or outbound activity",
      body: lower.includes("post") || lower.includes("exfil") || lower.includes("archive")
        ? "The notes point to likely collection or outbound transfer behavior."
        : "Review outbound telemetry next to confirm whether the activity moved beyond local execution."
    }
  ];

  const brief = `Tracecoon found ${indicators.length || "several"} suspicious clues in the notes. The strongest early theme looks like ${behaviors[0] || "unusual account or system activity"}, so the best first move is to confirm which user, host, or domain appears earliest and whether that activity is normal in your environment.`;

  const actions = [
    "Start with the first-seen domain, IP, or user and check where else it appears.",
    "Confirm whether the suspicious activity is new or normal for that user or host.",
    "Find the earliest timestamp tied to the case so the investigation has a starting point.",
    "Write down what is confirmed, what is only suspected, and what still needs validation."
  ];

  const triageChecklist = [
    {
      label: "First check",
      title: "Scope the main clue",
      body: indicators[0]
        ? `Search for ${indicators[0].value} across DNS, proxy, identity, or endpoint tools to see where it appears.`
        : "Start by identifying the first clear domain, IP, user, or file path in the case notes."
    },
    {
      label: "Validate",
      title: "Decide whether it is truly unusual",
      body: "Compare the activity with normal behavior for that user, host, or application before escalating hard."
    },
    {
      label: "Timeline",
      title: "Find the earliest event",
      body: "Build a short timeline from first sighting to latest activity so the investigation has a clean backbone."
    },
    {
      label: "Escalate",
      title: "Capture what needs senior review",
      body: "Flag confirmed persistence, repeated outbound traffic, or identity misuse for immediate follow-up."
    }
  ];

  const toolGuide = [
    {
      label: "Open first",
      title: "Identity or sign-in console",
      confidence: lower.includes("oauth") || lower.includes("sign-in") ? "high" : "medium",
      body: lower.includes("oauth") || lower.includes("sign-in")
        ? "This case mentions identity-style behavior. Check sign-ins, OAuth consent history, app grants, and affected users first."
        : "If a user or account is mentioned, identity logs are still a strong early place to confirm scope."
    },
    {
      label: "Then check",
      title: "Endpoint or EDR console",
      confidence: paths.length || tasks.length || lower.includes("rundll32") ? "high" : "medium",
      body: paths.length || tasks.length || lower.includes("rundll32")
        ? "The notes mention host artifacts or execution clues. Search for the file path, task name, or process activity on endpoints."
        : "Use EDR to confirm whether a host executed anything suspicious around the same time."
    },
    {
      label: "Third pivot",
      title: "DNS, proxy, or firewall logs",
      confidence: domains.length || ips.length ? "high" : "medium",
      body: domains.length || ips.length
        ? "You have network clues. Pivot on the extracted domains and IPs to measure spread and timing."
        : "If the first two checks are thin, use network logs to look for shared infrastructure or outbound traffic."
    }
  ];

  const glossary = [
    {
      label: "IOC",
      title: "Suspicious clue",
      body: "IOC stands for indicator of compromise. In Tracecoon, think of it as a clue worth checking, not automatic proof of malicious activity."
    },
    {
      label: "ATT&CK",
      title: "Behavior label",
      body: "ATT&CK is a common naming system for attacker behavior. It helps analysts tag what kind of activity they may be seeing."
    },
    {
      label: "Confidence",
      title: "How much to trust the clue",
      body: "High means the clue was directly extracted from the notes. Medium means it is useful but may still need more context. Low means treat it as an early lead only."
    }
  ];

  return {
    title: title || "Untitled Tracecoon Case",
    source,
    indicators,
    techniques,
    brief,
    actions,
    triageChecklist,
    toolGuide,
    glossary,
    timeline,
    entities,
    links
  };
}

function renderStats(model) {
  const items = [
    { label: "Suspicious clues", value: model.indicators.length },
    { label: "Behavior guesses", value: model.techniques.length },
    { label: "Map items", value: model.entities.length },
    { label: "Timeline steps", value: model.timeline.length }
  ];
  elements.stats.innerHTML = items.map((item) => `
    <article class="stat">
      <span class="stat__value">${item.value}</span>
      <span class="stat__label">${item.label}</span>
    </article>
  `).join("");
}

function renderList(container, items, renderer, emptyText) {
  if (!items.length) {
    container.innerHTML = `<li class="empty">${emptyText}</li>`;
    return;
  }
  container.innerHTML = items.map(renderer).join("");
}

function renderGraphLegend() {
  const labels = [
    ["actor", "Possible actor"],
    ["behavior", "Possible behavior"],
    ["ioc", "Suspicious clue"],
    ["asset", "Host artifact"]
  ];
  elements.graphLegend.innerHTML = labels.map(([key, label]) => `
    <span class="legend__item">
      <span class="legend__dot" style="background:${nodeColors[key]}"></span>${label}
    </span>
  `).join("");
}

function layoutNodes(nodes) {
  const bands = {
    actor: { x: 110, startY: 210, gap: 90 },
    behavior: { x: 330, startY: 90, gap: 90 },
    ioc: { x: 610, startY: 70, gap: 72 },
    asset: { x: 830, startY: 110, gap: 96 }
  };
  const counters = { actor: 0, behavior: 0, ioc: 0, asset: 0 };
  return nodes.map((node) => {
    const band = bands[node.type];
    const index = counters[node.type]++;
    return {
      ...node,
      x: band.x,
      y: band.startY + index * band.gap
    };
  });
}

function renderGraph(model) {
  const laidOut = layoutNodes(model.entities);
  const nodeById = Object.fromEntries(laidOut.map((node) => [node.id, node]));
  const linksMarkup = model.links.map((link) => {
    const source = nodeById[link.source];
    const target = nodeById[link.target];
    if (!source || !target) return "";
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2 - 10;
    return `
      <g>
        <path d="M ${source.x} ${source.y} C ${midX - 60} ${source.y}, ${midX + 60} ${target.y}, ${target.x} ${target.y}"
          fill="none" stroke="rgba(143,240,184,0.22)" stroke-width="2" />
        <text x="${midX}" y="${midY}" text-anchor="middle" class="link-label">${link.label}</text>
      </g>
    `;
  }).join("");

  const nodesMarkup = laidOut.map((node) => `
    <g>
      <circle cx="${node.x}" cy="${node.y}" r="24" fill="${nodeColors[node.type]}" opacity="0.9"></circle>
      <circle cx="${node.x}" cy="${node.y}" r="31" fill="none" stroke="${nodeColors[node.type]}" opacity="0.18"></circle>
      <text x="${node.x}" y="${node.y + 48}" text-anchor="middle" class="node-label">${escapeHtml(node.label)}</text>
    </g>
  `).join("");

  elements.graph.innerHTML = `
    <rect width="920" height="420" rx="20" fill="rgba(5,15,20,0.92)"></rect>
    ${linksMarkup}
    ${nodesMarkup}
  `;
}

function renderTimeline(model) {
  elements.timeline.innerHTML = model.timeline.map((item) => `
    <article class="timeline-item">
      <span class="timeline-item__time">${item.time}</span>
      <h3 class="timeline-item__title">${escapeHtml(item.title)}</h3>
      <p class="timeline-item__body">${escapeHtml(item.body)}</p>
    </article>
  `).join("");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderModel(model) {
  currentModel = model;
  elements.summaryTitle.textContent = model.title;
  elements.briefText.textContent = model.brief;
  renderStats(model);
  renderList(
    elements.actionsList,
    model.actions,
    (item) => `<li>${escapeHtml(item)}</li>`,
    "No next steps yet."
  );
  if (model.triageChecklist.length) {
    elements.triageChecklist.innerHTML = model.triageChecklist.map((item) => `
      <article class="triage-item">
        <div class="triage-item__label">${escapeHtml(item.label)}</div>
        <h3 class="triage-item__title">${escapeHtml(item.title)}</h3>
        <p class="triage-item__body">${escapeHtml(item.body)}</p>
      </article>
    `).join("");
  } else {
    elements.triageChecklist.innerHTML = `<p class="empty">No triage checklist yet.</p>`;
  }
  if (juniorModeEnabled && model.toolGuide.length) {
    elements.toolGuide.innerHTML = model.toolGuide.map((item) => `
      <article class="tool-card">
        <div class="tool-card__eyebrow">${escapeHtml(item.label)}</div>
        <div class="confidence confidence--${escapeHtml(item.confidence)}">${escapeHtml(item.confidence)} confidence</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
      </article>
    `).join("");
  } else {
    elements.toolGuide.innerHTML = `<p class="empty">Junior mode is off. Turn it on for guided tool suggestions.</p>`;
  }
  renderList(
    elements.indicatorList,
    model.indicators,
    (item) => `<li class="tag">${escapeHtml(item.type)}: ${escapeHtml(item.value)}${juniorModeEnabled ? ` (${escapeHtml(item.confidence)})` : ""}</li>`,
    "No indicators extracted."
  );
  renderList(
    elements.techniqueList,
    model.techniques,
    (item) => `<li><strong>${escapeHtml(item.technique)}</strong> - ${escapeHtml(item.explanation || "Likely mapped behavior.")}</li>`,
    "No ATT&CK mapping yet."
  );
  renderList(
    elements.huntList,
    model.techniques,
    (item) => `<li>${escapeHtml(item.hunt)}</li>`,
    "No hunt prompts yet."
  );
  if (juniorModeEnabled && model.glossary.length) {
    elements.glossary.innerHTML = model.glossary.map((item) => `
      <article class="glossary-card">
        <div class="glossary-card__eyebrow">${escapeHtml(item.label)}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
      </article>
    `).join("");
  } else {
    elements.glossary.innerHTML = "";
  }
  renderTimeline(model);
  renderGraphLegend();
  renderGraph(model);
}

function analyzeCurrentInput() {
  const title = elements.caseTitle.value.trim();
  const text = elements.sourceText.value.trim();
  if (!text) {
    renderModel(buildModel("Empty Tracecoon Case", "No source text provided. Build an initial case with known indicators, summary notes, or timeline fragments."));
    return;
  }
  renderModel(buildModel(title, text));
}

function clearWorkspace() {
  elements.caseTitle.value = "";
  elements.sourceText.value = "";
  renderModel(buildModel("No active case", "Awaiting new material."));
}

function exportCurrentModel() {
  if (!currentModel) return;
  const blob = new Blob([JSON.stringify(currentModel, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${currentModel.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "tracecoon-case"}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

elements.loadSample.addEventListener("click", () => {
  elements.caseTitle.value = sampleCase.title;
  elements.sourceText.value = sampleCase.text;
  analyzeCurrentInput();
});

elements.clearCase.addEventListener("click", clearWorkspace);
elements.analyzeButton.addEventListener("click", analyzeCurrentInput);
elements.exportButton.addEventListener("click", exportCurrentModel);
elements.juniorMode.addEventListener("change", (event) => {
  juniorModeEnabled = event.target.checked;
  if (currentModel) {
    renderModel(currentModel);
  }
});

renderGraphLegend();
applyDemoStateFromQuery();
