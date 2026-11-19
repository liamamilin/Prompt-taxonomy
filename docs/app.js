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
const catalogFiles = { zh: "./catalog.json", en: "./catalog.en.json" };
const languageStorageKey = "prompt-taxonomy.language";
const catalogCache = new Map();
const languageButtons = document.querySelectorAll("[data-language]");

let catalog;
let language = initialLanguage();
let ui = siteLanguages[language];
let languageRequest = 0;
let categories;
let promptsById;
let index;
let activeCategory = "";
let activePrompt = null;
let opener = null;
let returnHash = "#library";
const pageSize = 24;
let visibleCount = pageSize;

function initialLanguage() {
  const explicit = new URL(location.href).searchParams.get("lang");
  if (explicit === "zh" || explicit === "en") return explicit;
  try {
    return localStorage.getItem(languageStorageKey) === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}

function localizedURL(languageCode) {
  const url = new URL(location.href);
  url.searchParams.set("lang", languageCode);
  return url;
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
  const home = localizedURL(language);
  home.hash = "";
  document.querySelector(".brand").href = home.href;
}

async function selectLanguage(next, remember = false) {
  const request = ++languageRequest;
  byId("language-error").hidden = true;
  if (next === language && catalog) return;
  try {
    if (!catalogCache.has(next)) {
      const response = await fetch(`${catalogFiles[next]}?v=2.1`);
      if (!response.ok) throw new Error(`Catalog: ${response.status}`);
      catalogCache.set(next, await response.json());
    }
    if (request !== languageRequest) return;
    const currentPromptId = dialog.open ? activePrompt?.id : "";
    // Both translations list variables in the same semantic order.
    const values = Array.from(byId("variables").querySelectorAll("textarea"), (input) => input.value);
    language = next;
    if (remember) {
      history.replaceState(history.state, "", localizedURL(language));
      try {
        localStorage.setItem(languageStorageKey, language);
      } catch {
        // The current URL still carries the language in private browsers.
      }
    }
    applyLocalizedText();
    renderCatalog(catalogCache.get(next));
    if (currentPromptId) showPrompt(promptsById.get(currentPromptId), values);
    else syncHash();
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

function render() {
  const query = normalize(search.value).trim();
  const words = query.split(/\s+/).filter(Boolean);
  const filtered = index.filter(({ prompt, keywords }) =>
    (!activeCategory || prompt.category === activeCategory)
    && (!selector.value || prompt.evidence === selector.value)
    && words.every((word) => keywords.includes(word))
  );
  if (query) {
    const relevance = ({ title, tags }) =>
      (title === query ? 6 : 0) + (tags.includes(query) ? 4 : 0) + (title.includes(query) ? 2 : 0);
    filtered.sort((a, b) => relevance(b) - relevance(a));
  }
  const hasMore = filtered.length > visibleCount;
  byId("results-count").textContent = hasMore ? ui.pageCount(filtered.length, visibleCount) : ui.count(filtered.length);
  byId("clear").hidden = !(activeCategory || selector.value || words.length);
  more.hidden = !hasMore;
  if (filtered.length === 0) {
    cards.replaceChildren(element("div", ui.noResults, "empty"));
    return;
  }
  cards.replaceChildren(...filtered.slice(0, visibleCount).map(({ prompt }) => {
    const button = element("button", "", "card");
    button.type = "button";
    button.dataset.promptId = prompt.id;
    button.setAttribute("aria-haspopup", "dialog");
    const top = element("span", "", "card-top");
    top.append(element("span", categories.get(prompt.category).name, "pill category-name"), badge(prompt.evidence));
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

function openPrompt(prompt, trigger, sectionHash) {
  opener = trigger;
  returnHash = sectionHash;
  history.replaceState(null, "", `#prompt=${prompt.id}`);
  showPrompt(prompt);
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
    for (const id of workflow.steps) {
      const prompt = promptsById.get(id);
      const item = element("li");
      const button = element("button", prompt.title, "text-button");
      button.type = "button";
      button.dataset.promptId = prompt.id;
      button.setAttribute("aria-haspopup", "dialog");
      button.addEventListener("click", () => openPrompt(prompt, button, "#workflows"));
      item.append(button);
      steps.append(item);
    }
    panel.append(head, element("p", workflow.description), steps);
    return panel;
  }));
}

function showPrompt(prompt, values = []) {
  activePrompt = prompt;
  byId("detail-meta").textContent = `${categories.get(prompt.category).name} / ${catalog.evidence[prompt.evidence].label}`;
  byId("detail-title").textContent = prompt.title;
  byId("detail-description").textContent = prompt.description;
  byId("detail-evidence").textContent = catalog.evidence[prompt.evidence].description;
  sourceList(prompt.sources, byId("detail-sources"));
  dialog.querySelector(".fields").open = true;
  dialog.querySelector(".detail-sources").open = false;
  feedback.textContent = "";

  const fields = new Map();
  const renderPreview = () => {
    preview.textContent = prompt.template.replace(/【([^】]+)】/g, (token, variable) =>
      fields.get(variable)?.value.trim() || token
    );
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
      renderPreview();
      feedback.textContent = "";
    });
    variableList.append(label, input);
  });

  renderPreview();
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}

function syncHash() {
  if (!catalog) return;
  const id = location.hash.startsWith("#prompt=") ? location.hash.slice(8) : "";
  const prompt = promptsById.get(id);
  if (prompt && prompt !== activePrompt) showPrompt(prompt);
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

function renderCatalog(data) {
  catalog = data;
  categories = new Map(data.categories.map((category) => [category.id, category]));
  promptsById = new Map(data.prompts.map((prompt) => [prompt.id, prompt]));
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
  categorySelect.replaceChildren();
  categoryNav.replaceChildren();
  for (const category of [{ id: "", name: ui.allTasks }, ...data.categories]) {
    const button = element("button", "", "category");
    button.type = "button";
    button.dataset.category = category.id;
    button.title = category.description || ui.allTasksHint;
    const count = category.id ? data.prompts.filter((prompt) => prompt.category === category.id).length : data.prompts.length;
    const option = element("option", `${category.name} (${count})`);
    option.value = category.id;
    categorySelect.append(option);
    button.append(element("span", category.name), element("span", String(count)));
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
  search.addEventListener("input", resetResults);
  selector.addEventListener("change", resetResults);
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
  byId("copy").addEventListener("click", () => copyText(preview.textContent, ui.copied, ui.copyFallback));
  byId("copy-link").addEventListener("click", () => copyText(localizedURL(language).href, ui.linkCopied, ui.linkFallback));
  dialog.addEventListener("close", () => {
    if (location.hash === `#prompt=${activePrompt?.id}`) history.replaceState(null, "", returnHash);
    if (opener) {
      const replacement = document.querySelector(`${returnHash} [data-prompt-id="${activePrompt.id}"]`);
      const trigger = opener.isConnected ? opener : replacement;
      (trigger || document.querySelector(".topbar [aria-pressed=true]")).focus({ preventScroll: true });
    }
    activePrompt = null;
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
