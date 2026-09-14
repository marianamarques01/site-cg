import { DEFAULT_VISUAL_MODE, VISUAL_MODE_STORAGE_KEY } from "@/lib/visual-mode";

/** Runs before paint to avoid a flash of the wrong visual mode. */
export default function VisualModeScript() {
  const script = `(function(){try{var k=${JSON.stringify(VISUAL_MODE_STORAGE_KEY)};var d=${JSON.stringify(DEFAULT_VISUAL_MODE)};var m=localStorage.getItem(k);if(m!=="minimal"&&m!=="maximal")m=d;document.documentElement.setAttribute("data-visual",m)}catch(e){document.documentElement.setAttribute("data-visual",${JSON.stringify(DEFAULT_VISUAL_MODE)})}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
