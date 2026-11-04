// Pulls public repos live from the GitHub API and renders project cards.
const GH_USER = "DouglasAugusto01";
const GH_API = `https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=100`;

// Curated descriptions override GitHub's raw description when present,
// so the cards read well even for repos with terse/no description.
const OVERRIDES = {
  livraria: {
    title: "Sistema de Biblioteca",
    tags: ["Java", "Spring Boot", "Spring Security", "Thymeleaf"],
  },
  "gateway-go": {
    title: "Gateway de Contas",
    tags: ["Go", "Arquitetura em camadas"],
  },
  catalogoJava: {
    title: "API de Catálogo",
    tags: ["Java", "Spring Boot", "JPA", "H2"],
  },
  "Lista-de-Jogos": {
    title: "Lista de Jogos",
    tags: ["Java", "Spring Boot", "PostgreSQL"],
  },
  Clinica: {
    title: "Landing Page — Clínica Holística",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  catalogoVirtualLanchas: {
    title: "Catálogo Virtual",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  "zeziane-clone": {
    title: "Catálogo Premium — Calçados",
    tags: ["TypeScript", "React"],
  },
  portifolio: {
    title: "Portfólio Pessoal (v1)",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  "estacao-futuro-dashboard": {
    title: "Dashboard Estação Futuro",
    tags: ["JavaScript", "Dados"],
  },
  dscatalog: {
    title: "DSCatalog",
    tags: ["Java", "Spring Boot"],
  },
};

const LANG_COLORS = {
  Java: "#f0ad4e",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Go: "#00ADD8",
  Python: "#3572A5",
};

function langColor(lang) {
  return LANG_COLORS[lang] || "#7c5cff";
}

function prettyName(name) {
  return OVERRIDES[name]?.title || name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function iconExternal() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
}
function iconGithub() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>`;
}

function cardTemplate(repo) {
  const data = OVERRIDES[repo.name] || {};
  const title = prettyName(repo.name);
  const desc = repo.description || "Projeto de estudo e prática de desenvolvimento.";
  const tags = data.tags || [repo.language].filter(Boolean);
  const lang = repo.language;

  return `
  <article class="card proj-card reveal" data-langs="${tags.join(",").toLowerCase()}">
    <div>
      <div class="card-top">
        <h3>${title}</h3>
      </div>
      <p>${desc}</p>
      <div class="tag-row">
        ${tags
          .map(
            (t) =>
              `<span class="tag"><span class="lang-dot" style="background:${langColor(t)}"></span>${t}</span>`
          )
          .join("")}
      </div>
    </div>
    <div class="project-links">
      <a href="${repo.html_url}" target="_blank" rel="noopener">${iconGithub()} Código</a>
      ${
        repo.homepage
          ? `<a href="${repo.homepage}" target="_blank" rel="noopener">${iconExternal()} Demo</a>`
          : ""
      }
    </div>
  </article>`;
}

async function loadProjects({ gridSelector, limit, filters = false }) {
  const grid = document.querySelector(gridSelector);
  if (!grid) return;

  try {
    const res = await fetch(GH_API, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error("GitHub API error " + res.status);
    let repos = await res.json();

    repos = repos.filter((r) => !r.fork);
    repos.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
    if (limit) repos = repos.slice(0, limit);

    grid.innerHTML = repos.map(cardTemplate).join("");
    grid.querySelectorAll(".reveal").forEach((el) => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            obs.unobserve(e.target);
          }
        });
      });
      obs.observe(el);
    });

    if (filters) buildFilters(repos);

    const emptyMsg = document.querySelector(".state-msg");
    if (emptyMsg) emptyMsg.classList.remove("visible");
  } catch (err) {
    console.error(err);
    grid.innerHTML = "";
    const emptyMsg = document.querySelector(".state-msg");
    if (emptyMsg) emptyMsg.classList.add("visible");
  }
}

function buildFilters(repos) {
  const row = document.querySelector(".filter-row");
  if (!row) return;

  const tagSet = new Set();
  repos.forEach((r) => {
    const data = OVERRIDES[r.name];
    const tags = data?.tags || [r.language].filter(Boolean);
    tags.forEach((t) => tagSet.add(t));
  });

  const tags = ["Todos", ...Array.from(tagSet).sort()];
  row.innerHTML = tags
    .map(
      (t, i) =>
        `<button class="filter-btn${i === 0 ? " active" : ""}" data-filter="${t.toLowerCase()}">${t}</button>`
    )
    .join("");

  row.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      row.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      document.querySelectorAll(".proj-card").forEach((card) => {
        const langs = card.dataset.langs || "";
        const show = filter === "todos" || langs.includes(filter);
        card.classList.toggle("hidden", !show);
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const featuredGrid = document.querySelector("[data-featured-projects]");
  const allGrid = document.querySelector("[data-all-projects]");

  if (featuredGrid) loadProjects({ gridSelector: "[data-featured-projects]", limit: 3 });
  if (allGrid) loadProjects({ gridSelector: "[data-all-projects]", filters: true });
});
