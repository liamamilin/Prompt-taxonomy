"use strict";

const byId = (id) => document.getElementById(id);
const search = byId("search");
const selector = byId("evidence");
const categoryNav = byId("categories");
const cards = byId("cards");
const dialog = byId("detail");
const feedback = byId("feedback");
const preview = byId("preview");

let catalog;
let categories;
let index;
let activeCategory = "";
let activePrompt = null;
let opener = null;

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
  for (const button of categoryNav.children) {
    button.setAttribute("aria-pressed", String(button.dataset.category === id));
  }
  render();
}

function render() {
  const words = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const filtered = index.filter(({ prompt, keywords }) =>
    (!activeCategory || prompt.category === activeCategory)
    && (!selector.value || prompt.evidence === selector.value)
    && words.every((word) => keywords.includes(word))
  );
  byId("results-count").textContent = `找到 ${filtered.length} 条模板`;
  byId("clear").hidden = !(activeCategory || selector.value || words.length);
  if (filtered.length === 0) {
    cards.replaceChildren(element("div", "没有匹配的模板。试试更短的关键词，或清除当前筛选。", "empty"));
    return;
  }
  cards.replaceChildren(...filtered.map(({ prompt }) => {
    const button = element("button", "", "card");
    button.type = "button";
    button.setAttribute("aria-haspopup", "dialog");
    const top = element("span", "", "card-top");
    top.append(element("span", categories.get(prompt.category).name, "pill category-name"), badge(prompt.evidence));
    const bottom = element("span", "", "card-bottom");
    const arrow = element("span", "↗");
    arrow.setAttribute("aria-hidden", "true");
    bottom.append(element("span", "查看模板"), arrow);
    button.append(top, element("span", prompt.title, "card-title"),
      element("span", prompt.description, "card-description"), bottom);
    button.addEventListener("click", () => {
      opener = button;
      history.replaceState(null, "", `#prompt=${prompt.id}`);
      showPrompt(prompt);
    });
    return button;
  }));
}

function showPrompt(prompt) {
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
  const variableList = byId("variables");
  variableList.replaceChildren();
  prompt.variables.forEach((name, position) => {
    const input = document.createElement("textarea");
    input.id = `variable-${position}`;
    input.rows = 1;
    input.placeholder = `输入${name}`;
    const label = element("label", name);
    label.htmlFor = input.id;
    fields.set(name, input);
    input.addEventListener("input", () => {
      preview.textContent = prompt.template.replace(/【([^】]+)】/g, (token, variable) =>
        fields.get(variable)?.value.trim() || token
      );
      feedback.textContent = "";
    });
    variableList.append(label, input);
  });

  preview.textContent = prompt.template;
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}

function syncHash() {
  if (!catalog) return;
  const id = location.hash.startsWith("#prompt=") ? location.hash.slice(8) : "";
  const prompt = catalog.prompts.find((entry) => entry.id === id);
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

function initialize(data) {
  catalog = data;
  categories = new Map(data.categories.map((category) => [category.id, category]));
  index = data.prompts.map((prompt) => ({
    prompt,
    keywords: [prompt.title, prompt.description, prompt.template, ...prompt.tags,
      categories.get(prompt.category).name].join(" ").toLocaleLowerCase(),
  }));
  byId("prompt-count").textContent = data.prompts.length;
  byId("category-count").textContent = categories.size;
  byId("source-count").textContent = Object.keys(data.sources).length;
  for (const [id, item] of Object.entries(data.evidence)) {
    const option = element("option", item.label);
    option.value = id;
    selector.append(option);
    const key = element("div");
    key.append(badge(id), element("p", item.description));
    byId("evidence-key").append(key);
  }

  for (const category of [{ id: "", name: "全部任务" }, ...data.categories]) {
    const button = element("button", "", "category");
    button.type = "button";
    button.dataset.category = category.id;
    button.title = category.description || "显示完整目录";
    const count = category.id ? data.prompts.filter((prompt) => prompt.category === category.id).length : data.prompts.length;
    button.append(element("span", category.name), element("span", String(count)));
    button.addEventListener("click", () => selectCategory(category.id));
    categoryNav.append(button);
  }

  sourceList(Object.keys(data.sources), byId("sources"));
  search.addEventListener("input", render);
  selector.addEventListener("change", render);
  byId("clear").addEventListener("click", () => {
    search.value = "";
    selector.value = "";
    selectCategory("");
    search.focus();
  });
  byId("close").addEventListener("click", () => dialog.close());
  byId("copy").addEventListener("click", () => copyText(preview.textContent, "已复制 Prompt", "已选中，请手动复制。"));
  byId("copy-link").addEventListener("click", () => copyText(location.href, "已复制链接", "请从地址栏复制链接。"));
  dialog.addEventListener("close", () => {
    if (location.hash === `#prompt=${activePrompt?.id}`) history.replaceState(null, "", "#library");
    activePrompt = null;
    if (opener?.isConnected) opener.focus({ preventScroll: true });
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
  selectCategory("");
  syncHash();
}

fetch("./catalog.json")
  .then((response) => {
    if (!response.ok) throw new Error(`Catalog: ${response.status}`);
    return response.json();
  })
  .then(initialize)
  .catch(() => {
    byId("results-count").textContent = "模板暂时无法载入。";
    const message = element("div", "请刷新页面重试，或直接查看 ", "empty");
    const link = element("a", "JSON 目录");
    link.href = "./catalog.json";
    message.append(link, ".");
    cards.replaceChildren(message);
  });
