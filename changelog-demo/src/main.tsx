import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import "@asafarim/changelog-timeline/css";
import { sampleChangelog } from "./data/sampleChangelog";
import "./index.css";
import {
  ChangelogTimeline,
  RoadmapGraph,
  STATUS_LABELS,
  groupByMilestone,
  normalizeEntries,
} from "@asafarim/changelog-timeline";
import { roadmap, type RoadmapItem } from "./data/roadmap";
import type { EntryStatus, TimelineLayout } from "@asafarim/changelog-timeline";
// import ThemeProvider from '@asafarim/react-themes';

const GetStartedModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <dialog className="modal-dialog" open>
        <div className="modal-header">
          <h2>Get Started with Changelog Timeline</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>
        <div className="modal-body">
          <h3>Installation</h3>
          <pre>
            <code>pnpm add @asafarim/changelog-timeline</code>
          </pre>

          <h3>Quick Setup</h3>
          <pre>
            <code>{`import { ChangelogTimeline } from '@asafarim/changelog-timeline';
import '@asafarim/changelog-timeline/css';

<ChangelogTimeline
  entries={entries}
  maxVisible={8}
  showPagination
/>`}</code>
          </pre>

          <p>
            <strong>Learn more:</strong> Check the tutorial below or visit{" "}
            <a
              href="https://github.com/AliSafari-IT/changelog-timeline"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <div className="modal-footer">
          <button className="modal-btn-primary" onClick={onClose}>
            Got it
          </button>
        </div>
      </dialog>
    </>
  );
};

type View = "demo" | "roadmap";

const demoLayouts: TimelineLayout[] = ["left", "center", "right", "compact", "horizontal"];

// Lets a link such as ?layout=horizontal open the demo on a given timeline type.
const getInitialLayout = (): TimelineLayout => {
  const requested = new URLSearchParams(window.location.search).get("layout");
  return demoLayouts.find((option) => option === requested) ?? "center";
};

const cardStatusClass: Record<EntryStatus, string> = {
  shipped: "shipped",
  "in-progress": "in-development",
  next: "planned",
  idea: "under-review",
};

// The graph first, then the cards with details (newest and upcoming work first).
const Roadmap = () => {
  const [selected, setSelected] = useState<string>();
  const cards = useMemo(
    () => groupByMilestone(normalizeEntries(roadmap)).reverse(),
    []
  );

  const select = (key: string) => {
    setSelected(key);
    document
      .getElementById(`roadmap-${key}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="app-main">
      <section className="roadmap-page" aria-labelledby="roadmap-title">
        <header className="roadmap-hero">
          <p className="roadmap-eyebrow">What&apos;s next</p>
          <h1 id="roadmap-title">Roadmap / Coming soon</h1>
          <p>
            What shipped, what comes next and the ideas shaping later releases of
            @asafarim/changelog-timeline. Pick a version in the graph to jump to its details.
          </p>
        </header>

        <RoadmapGraph entries={roadmap} onSelect={select} selectedKey={selected} />

        <div className="roadmap-grid">
          {cards.flatMap((group) =>
            group.entries.map((entry, index) => {
              const item = entry as typeof entry & RoadmapItem;
              return (
                <article
                  className={`roadmap-card ${selected === group.key ? "is-selected" : ""}`}
                  key={entry.id}
                  id={index === 0 ? `roadmap-${group.key}` : undefined}
                >
                  <div className="roadmap-card-meta">
                    <span className="roadmap-version">{group.label}</span>
                    <span
                      className={`roadmap-status roadmap-status-${cardStatusClass[entry.status]}`}
                      data-status={entry.status}
                    >
                      {STATUS_LABELS[entry.status]}
                    </span>
                  </div>
                  <h2>{entry.title}</h2>
                  <p className="roadmap-summary">{entry.description}</p>
                  <h3>Key specs</h3>
                  <ul>
                    {item.specs.map((spec) => <li key={spec}>{spec}</li>)}
                  </ul>
                </article>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
};

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState<View>("demo");

  return (
    <>
      <GetStartedModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-logo">
            <img
              src={`${import.meta.env.BASE_URL}logo.svg`}
              alt="Logo"
              className="navbar-logo-img"
              title="Changelog Timeline Demo"
            />
            <div className="navbar-brand-copy">
              <span className="navbar-kicker">ASAFARIM / OPEN SOURCE</span>
              <span className="navbar-title">Changelog Timeline</span>
            </div>
          </div>
        <div className="view-switcher" role="tablist" aria-label="Demo views">
          <button
            className={`view-tab ${view === "demo" ? "active" : ""}`}
            type="button"
            role="tab"
            aria-selected={view === "demo"}
            onClick={() => setView("demo")}
          >
            Live Demo
          </button>
          <button
            className={`view-tab ${view === "roadmap" ? "active" : ""}`}
            type="button"
            role="tab"
            aria-selected={view === "roadmap"}
            onClick={() => setView("roadmap")}
          >
            Roadmap / Coming Soon
          </button>
        </div>
        <div className="navbar-actions">
          <button
            className="navbar-btn-primary"
            onClick={() => setModalOpen(true)}
            title="Get started with Changelog Timeline"
          >
            Get Started
          </button>
        <a
          className="navbar-icon-btn"
          href="https://github.com/AliSafari-IT/changelog-timeline"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="View the project on GitHub"
          title="GitHub repo"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M12 2C6.48 2 2 6.58 2 12.17c0 4.48 2.87 8.28 6.84 9.63.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.17-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.27 2.75 1.05a9.17 9.17 0 0 1 5 0c1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.69.94.69 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.48A10.22 10.22 0 0 0 22 12.17C22 6.58 17.52 2 12 2Z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a
          className="navbar-icon-btn"
          href="https://www.npmjs.com/package/@asafarim/changelog-timeline"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Open the package on npm"
          title="npm package"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M3 6h18v12H3V6Zm2 2v8h5V10h4v6h5V8H5Z"
              fill="currentColor"
            />
          </svg>
          <span className="sr-only">npm</span>
        </a>
        <button
          className="navbar-icon-btn theme-toggle"
          type="button"
          onClick={() => {
            const current = document.body.getAttribute("data-theme") || "light";
            const next = current === "light" ? "dark" : "light";
            document.body.setAttribute("data-theme", next);
          }}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M12 3.5a1 1 0 0 1 1 1V6a1 1 0 1 1-2 0V4.5a1 1 0 0 1 1-1Zm6.01 2.7a1 1 0 0 1 1.41 0l.35.36a1 1 0 0 1-1.42 1.41l-.34-.35a1 1 0 0 1 0-1.42ZM12 8.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm8 3.5a1 1 0 0 1 0 2h-1.5a1 1 0 0 1 0-2H20ZM6.23 5.86a1 1 0 0 1 0 1.42l-.35.35A1 1 0 0 1 4.46 6.2l.35-.36a1 1 0 0 1 1.42 0ZM12 18a1 1 0 0 1 1 1v1.5a1 1 0 0 1-2 0V19a1 1 0 0 1 1-1Zm7.77-1.14a1 1 0 0 1 0 1.42l-.35.35a1 1 0 1 1-1.42-1.41l.35-.36a1 1 0 0 1 1.42 0ZM5 11a1 1 0 0 1 0 2H3.5a1 1 0 0 1 0-2H5Zm1.23 6.14a1 1 0 0 1 0 1.42l-.35.35a1 1 0 0 1-1.42-1.41l.35-.36a1 1 0 0 1 1.42 0Z"
              fill="currentColor"
            />
          </svg>
        </button>
          </div>
        </div>
      </nav>
    {view === "roadmap" ? <Roadmap /> : <main className="app-main">
      <div className="demo-page">
    <ChangelogTimeline
      title="Changelog Timeline"
      subtitle="Track all changes over time"
      headerClassName="custom-header"
      entries={sampleChangelog}
      maxVisible={8}
      showPagination={true}
      searchable
      layout={getInitialLayout()}
      layoutSwitcher
    />
    <section className="timeline-tutorial">
      <header>
        <p className="tutorial-pill">Hands-on guide</p>
        <h2>Build your own changelog in five steps</h2>
        <p>
          Follow the workflow below inside any React + TypeScript project. All
          spacing, colors, typography, and elevation automatically come from{" "}
          <code>@asafarim/design-tokens</code>, so your changelog stays on brand
          without hard-coded values.
        </p>
      </header>
      <ol>
        <li>
          <h3>Install dependencies</h3>
          <p>Make sure React 18 or 19 is available, then add the timeline package.</p>
          <pre>
            <code>{`pnpm add @asafarim/changelog-timeline
pnpm add react react-dom`}</code>
          </pre>
        </li>
        <li>
          <h3>Prepare strongly-typed changelog entries</h3>
          <p>
            Every entry maps to the <code>ChangelogEntry</code> type. Keep
            versions semantic and include tags for quick scanning.
          </p>
          <pre>
            <code>{`import type { ChangelogEntry } from '@asafarim/changelog-timeline';

const entries: ChangelogEntry[] = [
  {
    id: 'release-2.1.0-feature-dark-mode',
    version: '2.1.0',
    date: '2025-01-15',
    category: 'feature',
    title: 'Added dark mode',
    description: 'Timeline now follows the active theme automatically.',
    tags: ['ui', 'accessibility'],
  },
];`}</code>
          </pre>
        </li>
        <li>
          <h3>Import CSS tokens once</h3>
          <p>
            The component automatically pulls every design token after this
            import—no extra setup required.
          </p>
          <pre>
            <code>{`import '@asafarim/changelog-timeline/css';`}</code>
          </pre>
        </li>
        <li>
          <h3>Render the component</h3>
          <p>
            Pass entries and customize pagination, layout, or header copy. The
            component remains tree-shakable.
          </p>
          <pre>
            <code>{`import { ChangelogTimeline } from '@asafarim/changelog-timeline';

export const ProductChangelog = () => (
  <ChangelogTimeline
    entries={entries}
    title="Product updates"
    subtitle="Fresh releases and fixes"
    layout="center"
    layoutSwitcher
    maxVisible={6}
    showPagination
  />
);`}</code>
          </pre>
        </li>
        <li>
          <h3>Ship with confidence</h3>
          <p>
            Deploy as part of any Vite, Next.js, or CRA stack. The component
            respects SSR/CSR boundaries and brings its own accessibility affordances.
          </p>
        </li>
      </ol>
    </section>
      </div>
    </main>}
    {/* </ThemeProvider> */}
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
