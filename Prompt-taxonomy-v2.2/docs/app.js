"use strict";

const byId = (id) => document.getElementById(id);
const search = byId("search");
const selector = byId("evidence");
const categorySelect = byId("category-select");
const categoryNav = byId("categories");
const cards = byId("cards");
const more = byId("more");
const dialog = byId("detail");
const feedback = byId("feedback");
const preview = byId("preview");
const saveToggle = byId("save-toggle");
const clearFieldsButton = byId("clear-fields");
const fieldsProgress = byId("fields-progress");
const workflowBar = byId("workflow-bar");
const workflowBarTitle = byId("workflow-bar-title");
const workflowBarStep = byId("workflow-bar-step");
const workflowPrev = byId("workflow-prev");
const workflowNext = byId("workflow-next");
const relatedWorkflows = byId("related-workflows");

const catalogFiles = { zh: "./catalog.json", en: "./catalog.en.json" };
const languageStorageKey = "prompt-taxonomy.language";
const savedStorageKey = "prompt-taxonomy.saved";
const recentStorageKey = "prompt-taxonomy.recent";
const maxRecent = 12;
const catalogCache = new Map();
const draftValues = new Map();
const languageButtons = document.querySelectorAll("[data-language]");

let catalog;
let language = initialLanguage();
let ui = siteLanguages[language];
let languageRequest = 0;
let categories;
let promptsById;
let workflowsById;
let workflowsByPrompt;
let index;
let activeCategory = "";
let activePrompt = null;
let activeWorkflow = null;
let activeWorkflowStep = -1;
let opener = null;
let returnHash = "#library";
const pageSize = 24;
let visibleCount = pageSize;
let savedIds = loadStoredList(savedStorageKey);
let recentIds = loadStoredList(recentStorageKey);

function loadStoredList(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function saveStoredList(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Ignore storage errors in private browsing modes.
  }
}

function recordRecent(promptId) {
  recentIds = [promptId, ...recentIds.filter((id) => id !== promptId)].slice(0, maxRecent);
  saveStoredList(recentStorageKey, recentIds);
  if (catalog) updateSidebarCounts();
}

function toggleSaved(promptId) {
  const exists = savedIds.includes(promptId);
  savedIds = exists ? savedIds.filter((id) => id !== promptId) : [promptId, ...savedIds];
  saveStoredList(savedStorageKey, savedIds);
  updateSaveButton();
  if (catalog) {
    updateSidebarCounts();
    render();
  }
}

function updateSaveButton() {
  if (!activePrompt) return;
  const isSaved = savedIds.includes(activePrompt.id);
  saveToggle.setAttribute("aria-pressed", String(isSaved));
  saveToggle.textContent = isSaved ? ui.savedTemplate : ui.saveTemplate;
}

function initialLanguage() {
  const explicit = new URL(location.href).searchParams.get("lang");
  if (explicit === "zh" || explicit === "en") return explicit;
  try {
    return localStorage.getItem(languageStorageKey) === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}

function sharePromptURL(promptId) {
  const url = new URL(location.href);
  url.search = "";
  url.searchParams.set("lang", language);
  url.hash = `#prompt=${promptId}`;
  return url.href;
}

function localizedURL(languageCode, includeFilters = true) {
  const url = new URL(location.href);
  url.searchParams.set("lang", languageCode);
  if (includeFilters) {
    if (activeCategory) url.searchParams.set("cat", activeCategory);
    else url.searchParams.delete("cat");
    if (selector.value) url.searchParams.set("ev", selector.value);
    else url.searchParams.delete("ev");
    const q = search.value.trim();
    if (q) url.searchParams.set("q", q);
    else url.searchParams.delete("q");
  }
  return url;
}

function syncFilterURL() {
  if (!catalog) return;
  history.replaceState(history.state, "", localizedURL(language, true));
}

function restoreFiltersFromURL() {
  const params = new URL(location.href).searchParams;
  const q = params.get("q");
  const ev = params.get("ev");
  const cat = params.get("cat");
  if (q) search.value = q;
  if (ev && Object.prototype.hasOwnProperty.call(catalog.evidence, ev)) selector.value = ev;
  if (cat && (cat === "__saved" || cat === "__recent" || categories.has(cat))) activeCategory = cat;
}

function applyLocalizedText() {
  ui = siteLanguages[language];
  document.documentElement.lang = ui.lang;
  document.title = ui.pageTitle;
  document.querySelector('meta[name="description"]').content = ui.metaDescription;
  for (const node of document.querySelectorAll("[data-i18n]")) node.textContent = ui[node.dataset.i18n];
  for (const node of document.querySelectorAll("[data-i18n-label]")) node.setAttribute("aria-label", ui[node.dataset.i18nLabel]);
  for (const node of document.querySelectorAll("[data-i18n-placeholder]")) node.placeholder = ui[node.dataset.i18nPlaceholder];
  for (const button of languageButtons) button.setAttribute("aria-pressed", String(button.dataset.language === language));
  byId("download").href = catalogFiles[language];
  const home = localizedURL(language, false);
  home.searchParams.delete("cat");
  home.searchParams.delete("ev");
  home.searchParams.delete("q");
  home.hash = "";
  document.querySelector(".brand").href = home.href;
}

async function selectLanguage(next, remember = false) {
  const request = ++languageRequest;
  byId("language-error").hidden = true;
  if (next === language && catalog) return;
  try {
    if (!catalogCache.has(next)) {
      const response = await fetch(`${catalogFiles[next]}?v=2.2`);
      if (!response.ok) throw new Error(`Catalog: ${response.status}`);
      catalogCache.set(next, await response.json());
    }
    if (request !== languageRequest) return;
    const isInitialLoad = !catalog;
    const currentPromptId = dialog.open ? activePrompt?.id : "";
    const currentWorkflowId = activeWorkflow?.id || "";
    const currentWorkflowStep = activeWorkflowStep;
    const values = Array.from(byId("variables").querySelectorAll("textarea"), (input) => input.value);
    if (currentPromptId) draftValues.set(currentPromptId, values);
    language = next;
    if (remember) {
      history.replaceState(history.state, "", localizedURL(language, true));
      try {
        localStorage.setItem(languageStorageKey, language);
      } catch {
        // The current URL still carries the language in private browsers.
      }
    }
    applyLocalizedText();
    renderCatalog(catalogCache.get(next), isInitialLoad);
    if (currentPromptId) {
      const wf = currentWorkflowId ? workflowsById.get(currentWorkflowId) : null;
      showPrompt(promptsById.get(currentPromptId), values, wf, currentWorkflowStep);
    } else {
      syncHash();
    }
  } catch {
    if (request !== languageRequest) return;
    if (!catalog) {
      byId("results-count").textContent = ui.loadError;
      const link = element("a", ui.openJson);
      link.href = catalogFiles[language];
      const message = element("div", "", "empty");
      message.append(link);
      cards.replaceChildren(message);
    } else if (dialog.open) {
      feedback.textContent = ui.switchError;
    } else {
      byId("language-error").textContent = ui.switchError;
      byId("language-error").hidden = false;
    }
  }
}

function normalize(value) {
  return value.normalize("NFKC").toLocaleLowerCase();
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function sourceList(ids, container) {
  container.replaceChildren(...ids.map((id) => {
    const source = catalog.sources[id];
    const item = element("li");
    const link = element("a", source.name);
    link.href = source.url;
    item.append(link, element("span", source.kind, "source-kind"), element("span", source.note, "source-note"));
    return item;
  }));
}

function badge(key) {
  return element("span", catalog.evidence[key].label, `pill ${key}`);
}

function selectCategory(id) {
  activeCategory = id;
  markActiveCategory();
  syncFilterURL();
  resetResults();
}

function markActiveCategory() {
  const id = activeCategory;
  categorySelect.value = id;
  for (const button of categoryNav.children) {
    button.setAttribute("aria-pressed", String(button.dataset.category === id));
  }
}

function resetResults() {
  if (!catalog) return;
  visibleCount = pageSize;
  render();
}

function updateSidebarCounts() {
  const savedSet = new Set(savedIds.filter((id) => promptsById.has(id)));
  const recentSet = new Set(recentIds.filter((id) => promptsById.has(id)));
  const savedBtn = categoryNav.querySelector('[data-category="__saved"] span:last-child');
  const recentBtn = categoryNav.querySelector('[data-category="__recent"] span:last-child');
  if (savedBtn) savedBtn.textContent = String(savedSet.size);
  if (recentBtn) recentBtn.textContent = String(recentSet.size);
  const savedOpt = categorySelect.querySelector('option[value="__saved"]');
  const recentOpt = categorySelect.querySelector('option[value="__recent"]');
  if (savedOpt) savedOpt.textContent = `${ui.savedTasks} (${savedSet.size})`;
  if (recentOpt) recentOpt.textContent = `${ui.recentTasks} (${recentSet.size})`;
}

function render() {
  const query = normalize(search.value).trim();
  const words = query.split(/\s+/).filter(Boolean);
  const savedSet = new Set(savedIds);
  const recentRank = new Map(recentIds.map((id, idx) => [id, idx]));

  let filtered = index.filter(({ prompt, keywords }) => {
    if (activeCategory === "__saved" && !savedSet.has(prompt.id)) return false;
    if (activeCategory === "__recent" && !recentRank.has(prompt.id)) return false;
    if (activeCategory && activeCategory !== "__saved" && activeCategory !== "__recent" && prompt.category !== activeCategory) return false;
    if (selector.value && prompt.evidence !== selector.value) return false;
    return words.every((word) => keywords.includes(word));
  });

  if (query) {
    const relevance = ({ title, tags }) =>
      (title === query ? 6 : 0) + (tags.includes(query) ? 4 : 0) + (title.includes(query) ? 2 : 0);
    filtered.sort((a, b) => relevance(b) - relevance(a));
  } else if (activeCategory === "__recent") {
    filtered.sort((a, b) => (recentRank.get(a.prompt.id) ?? 999) - (recentRank.get(b.prompt.id) ?? 999));
  }

  const hasMore = filtered.length > visibleCount;
  byId("results-count").textContent = hasMore ? ui.pageCount(filtered.length, visibleCount) : ui.count(filtered.length);
  byId("clear").hidden = !(activeCategory || selector.value || words.length);
  more.hidden = !hasMore;
  if (filtered.length === 0) {
    const emptyText = activeCategory === "__saved" && !words.length && !selector.value
      ? ui.noSaved
      : activeCategory === "__recent" && !words.length && !selector.value
        ? ui.noRecent
        : ui.noResults;
    cards.replaceChildren(element("div", emptyText, "empty"));
    return;
  }
  cards.replaceChildren(...filtered.slice(0, visibleCount).map(({ prompt }) => {
    const button = element("button", "", "card");
    button.type = "button";
    button.dataset.promptId = prompt.id;
    button.setAttribute("aria-haspopup", "dialog");
    const top = element("span", "", "card-top");
    top.append(element("span", categories.get(prompt.category).name, "pill category-name"), badge(prompt.evidence));
    if (savedSet.has(prompt.id)) top.append(element("span", "★", "card-star"));
    const bottom = element("span", "", "card-bottom");
    const arrow = element("span", "↗");
    arrow.setAttribute("aria-hidden", "true");
    bottom.append(element("span", ui.openTemplate), arrow);
    button.append(top, element("span", prompt.title, "card-title"),
      element("span", prompt.description, "card-description"), bottom);
    button.addEventListener("click", () => openPrompt(prompt, button, "#library"));
    return button;
  }));
}

function openPrompt(prompt, trigger, sectionHash, workflow = null, stepIndex = -1) {
  opener = trigger;
  returnHash = sectionHash;
  const url = localizedURL(language, true);
  url.hash = `#prompt=${prompt.id}`;
  history.replaceState(null, "", url);
  showPrompt(prompt, draftValues.get(prompt.id) || [], workflow, stepIndex);
}

function renderWorkflows() {
  const openWorkflows = new Set(Array.from(
    byId("workflow-list").querySelectorAll("details[open]"), (panel) => panel.dataset.workflowId
  ));
  byId("workflow-list").replaceChildren(...catalog.workflows.map((workflow) => {
    const panel = element("details", "", "workflow");
    panel.dataset.workflowId = workflow.id;
    panel.open = openWorkflows.has(workflow.id);
    const head = element("summary", workflow.title);
    head.append(element("span", ui.stepCount(workflow.steps.length), "workflow-count"));
    const steps = element("ol", "", "workflow-steps");
    workflow.steps.forEach((id, idx) => {
      const prompt = promptsById.get(id);
      const item = element("li");
      const button = element("button", prompt.title, "text-button");
      button.type = "button";
      button.dataset.promptId = prompt.id;
      button.setAttribute("aria-haspopup", "dialog");
      button.addEventListener("click", () => openPrompt(prompt, button, "#workflows", workflow, idx));
      item.append(button);
      steps.append(item);
    });
    panel.append(head, element("p", workflow.description), steps);
    return panel;
  }));
}

function autoSize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(textarea.scrollHeight + 2, 192)}px`;
}

function renderWorkflowBar() {
  if (!activeWorkflow || activeWorkflowStep < 0) {
    workflowBar.hidden = true;
    const links = activePrompt ? (workflowsByPrompt?.get(activePrompt.id) || []) : [];
    if (links.length === 0) {
      relatedWorkflows.hidden = true;
      relatedWorkflows.replaceChildren();
      return;
    }
    relatedWorkflows.hidden = false;
    const nodes = [element("span", ui.partOfWorkflow, "related-workflows-label")];
    for (const { workflow, stepIndex } of links) {
      const label = language === "en"
        ? `${workflow.title} (${ui.workflowStepShort(stepIndex + 1, workflow.steps.length)}) ↗`
        : `${workflow.title}（${ui.workflowStepShort(stepIndex + 1, workflow.steps.length)}）↗`;
      const btn = element("button", label, "workflow-chip");
      btn.type = "button";
      btn.addEventListener("click", () => {
        const currentValues = Array.from(byId("variables").querySelectorAll("textarea"), (input) => input.value);
        showPrompt(activePrompt, currentValues, workflow, stepIndex);
      });
      nodes.push(btn);
    }
    relatedWorkflows.replaceChildren(...nodes);
    return;
  }
  relatedWorkflows.hidden = true;
  relatedWorkflows.replaceChildren();
  workflowBar.hidden = false;
  workflowBarTitle.textContent = activeWorkflow.title;
  workflowBarStep.textContent = ui.workflowProgress(activeWorkflowStep + 1, activeWorkflow.steps.length);
  workflowPrev.disabled = activeWorkflowStep <= 0;
  workflowNext.disabled = activeWorkflowStep >= activeWorkflow.steps.length - 1;
}

function stepWorkflow(delta) {
  if (!activeWorkflow) return;
  const nextIndex = activeWorkflowStep + delta;
  if (nextIndex < 0 || nextIndex >= activeWorkflow.steps.length) return;
  const nextPrompt = promptsById.get(activeWorkflow.steps[nextIndex]);
  if (!nextPrompt) return;
  const url = localizedURL(language, true);
  url.hash = `#prompt=${nextPrompt.id}`;
  history.replaceState(null, "", url);
  showPrompt(nextPrompt, draftValues.get(nextPrompt.id) || [], activeWorkflow, nextIndex);
}

function showPrompt(prompt, values = [], workflow = null, stepIndex = -1) {
  activePrompt = prompt;
  activeWorkflow = workflow;
  activeWorkflowStep = stepIndex;
  recordRecent(prompt.id);
  updateSaveButton();
  renderWorkflowBar();

  byId("detail-meta").textContent = `${categories.get(prompt.category).name} / ${catalog.evidence[prompt.evidence].label}`;
  byId("detail-title").textContent = prompt.title;
  byId("detail-description").textContent = prompt.description;
  byId("detail-evidence").textContent = catalog.evidence[prompt.evidence].description;
  sourceList(prompt.sources, byId("detail-sources"));
  dialog.querySelector(".fields").open = true;
  dialog.querySelector(".detail-sources").open = false;
  feedback.textContent = "";

  const fields = new Map();
  const varPattern = language === "en" ? /\[([^\]]+)\]/g : /【([^】]+)】/g;

  const renderPreview = () => {
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let filledCount = 0;
    const totalVars = prompt.variables.length;
    for (const name of prompt.variables) {
      if (fields.get(name)?.value.trim()) filledCount += 1;
    }
    for (const match of prompt.template.matchAll(varPattern)) {
      const start = match.index;
      if (start > lastIndex) fragment.append(document.createTextNode(prompt.template.slice(lastIndex, start)));
      const val = fields.get(match[1])?.value.trim();
      if (val) {
        fragment.append(document.createTextNode(val));
      } else {
        fragment.append(element("mark", match[0], "var-placeholder"));
      }
      lastIndex = start + match[0].length;
    }
    if (lastIndex < prompt.template.length) fragment.append(document.createTextNode(prompt.template.slice(lastIndex)));
    preview.replaceChildren(fragment);

    fieldsProgress.textContent = filledCount > 0 ? ui.filledProgress(filledCount, totalVars) : ui.optional;
    clearFieldsButton.hidden = filledCount === 0;
    draftValues.set(prompt.id, prompt.variables.map((name) => fields.get(name)?.value || ""));
  };

  const variableList = byId("variables");
  variableList.replaceChildren();
  prompt.variables.forEach((name, position) => {
    const input = document.createElement("textarea");
    input.id = `variable-${position}`;
    input.rows = 1;
    input.placeholder = ui.variablePlaceholder(name);
    input.value = values[position] ?? "";
    const label = element("label", name);
    label.htmlFor = input.id;
    fields.set(name, input);
    input.addEventListener("input", () => {
      autoSize(input);
      renderPreview();
      feedback.textContent = "";
    });
    variableList.append(label, input);
  });

  renderPreview();
  if (!dialog.open) dialog.showModal();
  for (const input of fields.values()) autoSize(input);
  dialog.scrollTop = 0;
}

function syncHash() {
  if (!catalog) return;
  const id = location.hash.startsWith("#prompt=") ? location.hash.slice(8) : "";
  const prompt = promptsById.get(id);
  if (prompt && prompt !== activePrompt) showPrompt(prompt, draftValues.get(prompt.id) || []);
  if (!prompt && dialog.open) dialog.close();
}

async function copyText(text, success, fallback) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const temporary = element("textarea");
      temporary.value = text;
      temporary.style.position = "fixed";
      temporary.style.opacity = "0";
      dialog.append(temporary);
      temporary.select();
      const copied = document.execCommand("copy");
      temporary.remove();
      if (!copied) throw new Error("Clipboard not available");
    }
    feedback.textContent = success;
  } catch {
    feedback.textContent = fallback;
    if (text === preview.textContent) {
      const range = document.createRange();
      range.selectNodeContents(preview);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}

function copyActivePrompt() {
  if (!activePrompt) return;
  recordRecent(activePrompt.id);
  const blanks = preview.querySelectorAll(".var-placeholder").length;
  const msg = blanks > 0 ? ui.copiedWithBlanks(blanks) : ui.copied;
  copyText(preview.textContent, msg, ui.copyFallback);
}

function renderCatalog(data, isInitialLoad = false) {
  catalog = data;
  categories = new Map(data.categories.map((category) => [category.id, category]));
  promptsById = new Map(data.prompts.map((prompt) => [prompt.id, prompt]));
  workflowsById = new Map(data.workflows.map((workflow) => [workflow.id, workflow]));
  workflowsByPrompt = new Map();
  for (const workflow of data.workflows) {
    workflow.steps.forEach((pid, idx) => {
      if (!workflowsByPrompt.has(pid)) workflowsByPrompt.set(pid, []);
      workflowsByPrompt.get(pid).push({ workflow, stepIndex: idx });
    });
  }
  const categoryPositions = new Map();
  index = data.prompts.map((prompt) => {
    const position = categoryPositions.get(prompt.category) ?? 0;
    categoryPositions.set(prompt.category, position + 1);
    return {
      prompt, position, title: normalize(prompt.title), tags: prompt.tags.map(normalize),
      keywords: normalize([prompt.title, prompt.description, prompt.template, ...prompt.tags,
        categories.get(prompt.category).name].join(" ")),
    };
  }).sort((a, b) => a.position - b.position);
  byId("version").textContent = data.version;
  byId("prompt-count").textContent = data.prompts.length;
  byId("category-count").textContent = categories.size;
  byId("workflow-count").textContent = data.workflows.length;
  byId("source-count").textContent = Object.keys(data.sources).length;
  const selectedEvidence = selector.value;
  selector.replaceChildren(selector.firstElementChild);
  byId("evidence-key").replaceChildren();
  for (const [id, item] of Object.entries(data.evidence)) {
    const option = element("option", item.label);
    option.value = id;
    selector.append(option);
    const key = element("div");
    key.append(badge(id), element("p", item.description));
    byId("evidence-key").append(key);
  }

  selector.value = selectedEvidence;
  if (isInitialLoad) restoreFiltersFromURL();

  categorySelect.replaceChildren();
  categoryNav.replaceChildren();
  const savedCount = savedIds.filter((id) => promptsById.has(id)).length;
  const recentCount = recentIds.filter((id) => promptsById.has(id)).length;
  const navEntries = [
    { id: "", name: ui.allTasks, description: ui.allTasksHint, count: data.prompts.length, special: false },
    { id: "__saved", name: ui.savedTasks, description: ui.savedTasksHint, count: savedCount, special: true },
    { id: "__recent", name: ui.recentTasks, description: ui.recentTasksHint, count: recentCount, special: true },
    ...data.categories.map((cat) => ({
      ...cat,
      count: data.prompts.filter((prompt) => prompt.category === cat.id).length,
      special: false,
    })),
  ];

  for (const category of navEntries) {
    const button = element("button", "", category.special ? "category category-special" : "category");
    button.type = "button";
    button.dataset.category = category.id;
    button.title = category.description || ui.allTasksHint;
    const option = element("option", `${category.name} (${category.count})`);
    option.value = category.id;
    categorySelect.append(option);
    button.append(element("span", category.name), element("span", String(category.count)));
    button.addEventListener("click", () => selectCategory(category.id));
    categoryNav.append(button);
  }

  sourceList(Object.keys(data.sources), byId("sources"));
  renderWorkflows();
  markActiveCategory();
  render();
}

function initialize() {
  applyLocalizedText();
  byId("results-count").textContent = ui.loading;
  for (const button of languageButtons) button.addEventListener("click", () => selectLanguage(button.dataset.language, true));
  search.addEventListener("input", () => {
    syncFilterURL();
    resetResults();
  });
  selector.addEventListener("change", () => {
    syncFilterURL();
    resetResults();
  });
  categorySelect.addEventListener("change", () => selectCategory(categorySelect.value));
  more.addEventListener("click", () => {
    if (!catalog) return;
    const next = visibleCount;
    visibleCount += pageSize;
    render();
    cards.children[next]?.focus();
  });
  byId("clear").addEventListener("click", () => {
    search.value = "";
    selector.value = "";
    selectCategory("");
    search.focus();
  });
  byId("close").addEventListener("click", () => dialog.close());
  saveToggle.addEventListener("click", () => {
    if (activePrompt) toggleSaved(activePrompt.id);
  });
  clearFieldsButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!activePrompt) return;
    draftValues.delete(activePrompt.id);
    for (const input of byId("variables").querySelectorAll("textarea")) {
      input.value = "";
      autoSize(input);
    }
    byId("variables").querySelector("textarea")?.dispatchEvent(new Event("input"));
  });
  workflowPrev.addEventListener("click", () => stepWorkflow(-1));
  workflowNext.addEventListener("click", () => stepWorkflow(1));
  byId("copy").addEventListener("click", copyActivePrompt);
  byId("copy-link").addEventListener("click", () => copyText(activePrompt ? sharePromptURL(activePrompt.id) : localizedURL(language, false).href, ui.linkCopied, ui.linkFallback));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      copyActivePrompt();
    }
  });
  dialog.addEventListener("close", () => {
    if (location.hash === `#prompt=${activePrompt?.id}`) {
      const url = localizedURL(language, true);
      url.hash = returnHash;
      history.replaceState(null, "", url);
    }
    if (opener) {
      const replacement = document.querySelector(`${returnHash} [data-prompt-id="${activePrompt.id}"]`);
      const trigger = opener.isConnected ? opener : replacement;
      (trigger || document.querySelector(".topbar [aria-pressed=true]")).focus({ preventScroll: true });
    }
    activePrompt = null;
    activeWorkflow = null;
    activeWorkflowStep = -1;
    returnHash = "#library";
    opener = null;
  });
  window.addEventListener("hashchange", syncHash);
  document.addEventListener("keydown", (event) => {
    const typing = event.target.matches?.("input, textarea, select, [contenteditable]");
    if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey && !typing && !dialog.open) {
      event.preventDefault();
      search.focus();
    }
  });
  selectLanguage(language);
}

initialize();
