import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { ChangelogTimeline } from "@asafarim/changelog-timeline";
import "@asafarim/changelog-timeline/css";
import { sampleChangelog } from "./data/sampleChangelog";
import "./index.css";
// import ThemeProvider from '@asafarim/react-themes';
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(ChangelogTimeline, { entries: sampleChangelog, maxVisible: 8, showPagination: true, layout: "center" }) }));
