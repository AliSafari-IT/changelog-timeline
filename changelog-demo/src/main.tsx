import React from "react";
import ReactDOM from "react-dom/client";
import { ChangelogTimeline } from "@asafarim/changelog-timeline";
import "@asafarim/changelog-timeline/styles.css";
import { sampleChangelog } from "./data/sampleChangelog";
import "./index.css";
// import ThemeProvider from '@asafarim/react-themes';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <ThemeProvider> */}
    <ChangelogTimeline
      entries={sampleChangelog}
      maxVisible={8}
      showPagination={true}
    />
    {/* </ThemeProvider> */}
  </React.StrictMode>
);
