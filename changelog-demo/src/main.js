import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import "@asafarim/changelog-timeline/css";
import { sampleChangelog } from "./data/sampleChangelog";
import "./index.css";
import { ChangelogTimeline } from "@asafarim/changelog-timeline";
// import ThemeProvider from '@asafarim/react-themes';
ReactDOM.createRoot(document.getElementById("root")).render(_jsxs(React.StrictMode, { children: [_jsxs("nav", { className: "navbar", children: [_jsxs("div", { className: "navbar-logo", children: [_jsx("img", { src: "/logo.svg", alt: "Logo", className: "navbar-logo-img" }), _jsx("span", { className: "navbar-title", children: "Changelog Timeline Demo" })] }), _jsxs("div", { className: "navbar-actions", children: [_jsx("button", { className: "theme-btn", onClick: () => document.body.setAttribute('data-theme', 'light'), children: "Light" }), _jsx("button", { className: "theme-btn", onClick: () => document.body.setAttribute('data-theme', 'dark'), children: "Dark" })] })] }), _jsx(ChangelogTimeline, { title: "Changelog Timeline", subtitle: "Track all changes over time", headerClassName: "custom-header", entries: sampleChangelog, maxVisible: 8, showPagination: true, layout: "center" })] }));
