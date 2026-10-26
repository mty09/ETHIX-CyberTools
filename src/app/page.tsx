"use client";

import Image from "next/image";
import {
  useMemo,
  useState,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  ArrowDownUp,
  ArrowUpRight,
  ChevronDown,
  Command,
  ExternalLink,
  Filter,
  GitFork,
  Heart,
  Moon,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Sun,
  X,
} from "lucide-react";

type Tool = {
  name: string;
  description: string;
  author: string;
  language: string;
  tags: string[];
  stars: string;
  likes: number;
  githubUrl: string;
  icon: string;
  accent: string;
};

const tools: Tool[] = [
  {
    name: "Sherlock",
    description:
      "Recherche des comptes associés à un nom d'utilisateur sur des centaines de plateformes.",
    author: "sherlock-project",
    language: "Python",
    tags: ["osint", "recon"],
    stars: "68.2k",
    likes: 132,
    githubUrl: "https://github.com/sherlock-project/sherlock",
    icon: "S",
    accent: "text-violet-300 bg-violet-400/10",
  },
  {
    name: "Subfinder",
    description:
      "Découverte passive de sous-domaines pour cartographier la surface d'attaque.",
    author: "projectdiscovery",
    language: "Go",
    tags: ["recon", "web"],
    stars: "10.8k",
    likes: 86,
    githubUrl: "https://github.com/projectdiscovery/subfinder",
    icon: "⌘",
    accent: "text-cyan-300 bg-cyan-400/10",
  },
  {
    name: "OWASP Amass",
    description:
      "Cartographie des surfaces d'attaque et découverte d'actifs exposés sur Internet.",
    author: "owasp",
    language: "Go",
    tags: ["recon", "osint"],
    stars: "12.1k",
    likes: 74,
    githubUrl: "https://github.com/owasp-amass/amass",
    icon: "A",
    accent: "text-red-300 bg-red-400/10",
  },
  {
    name: "Nuclei",
    description:
      "Scanner personnalisable basé sur des templates pour tester des services web.",
    author: "projectdiscovery",
    language: "Go",
    tags: ["scanner", "web"],
    stars: "24.7k",
    likes: 109,
    githubUrl: "https://github.com/projectdiscovery/nuclei",
    icon: "N",
    accent: "text-orange-300 bg-orange-400/10",
  },
];

const popularTags = ["osint", "recon", "web", "python", "scanner", "wifi"];

function subscribeToTheme(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("ethix-theme-change", onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("ethix-theme-change", onChange);
  };
}

function getThemeSnapshot(): "dark" | "light" {
  return window.localStorage.getItem("ethix-theme") === "light" ? "light" : "dark";
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortByStars, setSortByStars] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => "dark",
  );
  const [likedTools, setLikedTools] = useState<Set<string>>(() => new Set());
  const [starredTools, setStarredTools] = useState<Set<string>>(
    () => new Set(),
  );

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem("ethix-theme", nextTheme);
    window.dispatchEvent(new Event("ethix-theme-change"));
  }

  function toggleToolState(
    toolName: string,
    setTools: Dispatch<SetStateAction<Set<string>>>,
  ) {
    setTools((currentTools) => {
      const updatedTools = new Set(currentTools);
      if (updatedTools.has(toolName)) {
        updatedTools.delete(toolName);
      } else {
        updatedTools.add(toolName);
      }
      return updatedTools;
    });
  }

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const results = tools.filter((tool) => {
      const matchesQuery =
        !normalizedQuery ||
        [tool.name, tool.description, tool.author, ...tool.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesTag = !selectedTag || tool.tags.includes(selectedTag);

      return matchesQuery && matchesTag;
    });

    return sortByStars
      ? [...results].sort(
          (first, second) =>
            Number.parseFloat(second.stars) - Number.parseFloat(first.stars),
        )
      : results;
  }, [query, selectedTag, sortByStars]);

  return (
    <main
      className={`min-h-screen bg-[#0b0d12] text-[#f3f4f6] ${theme === "light" ? "theme-light" : ""}`}
      data-theme={theme}
    >
      <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#0b0d12]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="ETHIX accueil">
            <span className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-black">
              <Image
                src="/logo-mark.png"
                alt="Logo de la communauté ETHIX"
                width={44}
                height={38}
                className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
                priority
              />
            </span>
            <span className="text-[15px] font-bold tracking-[0.12em]">
              ETHIX<span className="text-red-400">.</span>
            </span>
            <span className="hidden border-l border-white/10 pl-3 text-xs text-slate-500 sm:inline">
              CyberTools
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a className="text-white" href="#catalogue">
              Explorer
            </a>
            <a className="transition hover:text-white" href="#tags">
              Tags
            </a>
            <a className="transition hover:text-white" href="#a-propos">
              À propos
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-white/[0.08] text-slate-400 transition hover:text-white"
              aria-label={
                theme === "dark"
                  ? "Passer au thème clair"
                  : "Passer au thème sombre"
              }
              title={
                theme === "dark"
                  ? "Activer le thème clair"
                  : "Activer le thème sombre"
              }
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <a
              href="#contribuer"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-400 px-3.5 text-sm font-semibold text-[#19090b] transition hover:bg-red-300 sm:px-4"
            >
              <Plus size={17} />
              <span className="hidden sm:inline">Publier un outil</span>
              <span className="sm:hidden">Publier</span>
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] md:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="hidden border-r border-white/[0.07] px-5 py-8 md:block">
          <div className="mb-8">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              Espace
            </p>
            <a
              href="#catalogue"
              className="flex items-center gap-3 rounded-lg bg-white/[0.07] px-3 py-2.5 text-sm font-medium text-white"
            >
              <Command size={16} className="text-red-400" />
              Catalogue
              <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-400">
                {tools.length}
              </span>
            </a>
          </div>

          <div id="tags">
            <div className="mb-3 flex items-center justify-between px-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                Tags populaires
              </p>
              <ChevronDown size={13} className="text-slate-600" />
            </div>
            <div className="space-y-1">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setSelectedTag((currentTag) =>
                      currentTag === tag ? null : tag,
                    )
                  }
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                    selectedTag === tag
                      ? "bg-red-400/10 text-red-300"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span className="text-slate-600">#</span>
                  {tag}
                  {selectedTag === tag && (
                    <X size={13} className="ml-auto" aria-label="Retirer le filtre" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* <div className="mt-10 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-red-400/10 text-red-300">
              <ShieldCheck size={17} />
            </div>
            <p className="text-sm font-semibold">Fait par la communauté</p>
            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Des outils référencés, hébergés directement sur GitHub.
            </p>
          </div> */}
        </aside>

        <section className="min-w-0 px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
          <div className="mb-9 flex items-center gap-2 text-xs text-slate-500">
            <span>ETHIX</span>
            <span className="text-slate-700">/</span>
            <span className="text-slate-300">Catalogue</span>
          </div>

          <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/[0.06] px-3 py-1.5 text-[11px] font-medium tracking-wide text-red-300">
                <span className="size-1.5 rounded-full bg-red-400" />
                LE HUB DES OUTILS CYBER
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                La boîte à outils
                <br className="hidden sm:block" /> de la communauté<span className="text-red-400">.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Explore des outils créés par la communauté, trouve celui qu&apos;il
                te faut et découvre son code sur GitHub.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="size-2 rounded-full bg-red-400" />
              {tools.length} outils d&apos;exemple
            </div>
          </div>

          <div className="mb-8 rounded-2xl border border-white/[0.07] bg-[#10131a] p-3 sm:p-4">
            <label className="flex h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0b0d12] px-4 focus-within:border-red-400/40">
              <Search size={18} className="shrink-0 text-slate-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher un outil, un tag, un auteur..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                aria-label="Rechercher dans le catalogue"
              />
              <kbd className="hidden rounded border border-white/10 px-1.5 py-1 text-[10px] text-slate-600 sm:inline">
                /
              </kbd>
            </label>

            <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
              <span className="mr-1 text-xs text-slate-500">Suggestions :</span>
              {["osint", "recon", "web"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setSelectedTag((currentTag) =>
                      currentTag === tag ? null : tag,
                    )
                  }
                  className={`rounded-md px-2 py-1 text-xs transition ${
                    selectedTag === tag
                      ? "bg-red-400/15 text-red-300"
                      : "bg-white/[0.04] text-slate-400 hover:text-white"
                  }`}
                >
                  #{tag}
                </button>
              ))}
              {selectedTag && (
                <button
                  type="button"
                  onClick={() => setSelectedTag(null)}
                  className="ml-auto text-xs text-slate-500 hover:text-white"
                >
                  Effacer le filtre
                </button>
              )}
            </div>
          </div>

          <div id="catalogue">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Explorer les outils</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {filteredTools.length} résultat{filteredTools.length > 1 ? "s" : ""}
                  {selectedTag ? ` pour #${selectedTag}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSortByStars((current) => !current)}
                  className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs transition ${
                    sortByStars
                      ? "border-red-400/30 bg-red-400/[0.07] text-red-300"
                      : "border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <ArrowDownUp size={14} />
                  Popularité
                </button>
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-white/[0.08] text-slate-400 md:hidden"
                  aria-label="Ouvrir les filtres"
                  aria-expanded={isFilterOpen}
                  onClick={() => setIsFilterOpen((current) => !current)}
                >
                  <Filter size={15} />
                </button>
              </div>
            </div>

            {isFilterOpen && (
              <div className="mb-4 flex flex-wrap gap-2 md:hidden">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setSelectedTag((currentTag) =>
                        currentTag === tag ? null : tag,
                      )
                    }
                    className={`rounded-md border px-2.5 py-1.5 text-xs transition ${
                      selectedTag === tag
                        ? "border-red-400/30 bg-red-400/10 text-red-300"
                        : "border-white/[0.08] text-slate-400"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            {filteredTools.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {filteredTools.map((tool) => (
                  <article
                    key={tool.name}
                    className="group rounded-xl border border-white/[0.07] bg-[#10131a] p-4 transition hover:border-white/[0.15] hover:bg-[#131720] sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${tool.accent}`}
                        >
                          {tool.icon}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-white">
                            {tool.name}
                          </h3>
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            @{tool.author}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 min-h-10 text-sm leading-5 text-slate-400">
                      {tool.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {tool.tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSelectedTag(tag)}
                          className="rounded-md border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-[11px] text-slate-400 transition hover:border-red-400/30 hover:text-red-300"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-3.5">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <span className="size-1.5 rounded-full bg-cyan-300" />
                          {tool.language}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Star size={13} />
                          {tool.stars}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            toggleToolState(tool.name, setLikedTools)
                          }
                          aria-label={
                            likedTools.has(tool.name)
                              ? `Ne plus aimer ${tool.name}`
                              : `Aimer ${tool.name}`
                          }
                          aria-pressed={likedTools.has(tool.name)}
                          className={`inline-flex items-center gap-1.5 text-xs transition ${
                            likedTools.has(tool.name)
                              ? "text-red-400"
                              : "text-slate-500 hover:text-red-300"
                          }`}
                        >
                          <Heart
                            size={15}
                            fill={
                              likedTools.has(tool.name)
                                ? "currentColor"
                                : "none"
                            }
                          />
                          {tool.likes + Number(likedTools.has(tool.name))}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            toggleToolState(tool.name, setStarredTools)
                          }
                          aria-label={
                            starredTools.has(tool.name)
                              ? `Retirer ${tool.name} des favoris`
                              : `Ajouter ${tool.name} aux favoris`
                          }
                          aria-pressed={starredTools.has(tool.name)}
                          className={`transition ${
                            starredTools.has(tool.name)
                              ? "text-amber-400"
                              : "text-slate-500 hover:text-amber-300"
                          }`}
                        >
                          <Star
                            size={15}
                            fill={
                              starredTools.has(tool.name)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                        <a
                          href={tool.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-red-300"
                        >
                          Voir sur GitHub
                          <ArrowUpRight size={14} />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 px-6 py-14 text-center">
                <Search size={22} className="mx-auto text-slate-600" />
                <p className="mt-3 text-sm font-medium">Aucun outil trouvé</p>
                <p className="mt-1 text-xs text-slate-500">
                  Essaie une autre recherche ou retire le filtre actif.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSelectedTag(null);
                  }}
                  className="mt-4 text-xs font-medium text-red-300 hover:text-red-200"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>

          <div
            id="contribuer"
            className="mt-10 flex flex-col justify-between gap-4 rounded-2xl border border-red-400/15 bg-red-400/[0.04] p-5 sm:flex-row sm:items-center sm:p-6"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-400/10 text-red-300">
                <Heart size={17} />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Tu as créé un outil ?</h2>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Partage ton dépôt GitHub avec la communauté ETHIX.
                </p>
              </div>
            </div>
            <span className="inline-flex h-9 items-center gap-2 self-start rounded-lg border border-red-400/20 px-3 text-xs font-medium text-red-300 sm:self-auto">
              Publication bientôt disponible
              <ExternalLink size={13} />
            </span>
          </div>

          <footer
            id="a-propos"
            className="mt-10 flex flex-col gap-3 border-t border-white/[0.07] py-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>ETHIX CyberTools.</p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition hover:text-slate-300"
            >
              <GitFork size={14} />
              GitHub
            </a>
          </footer>
        </section>
      </div>
    </main>
  );
}
