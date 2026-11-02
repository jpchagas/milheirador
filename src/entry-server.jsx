import { renderToString } from "react-dom/server";
import App from "./App.jsx";

// Built with `vite build --ssr` and used by scripts/prerender.js.
export { routes } from "./routes.js";
export { SITE_URL, CONTACT_EMAIL } from "./site.js";

export const render = path => renderToString(<App path={path} search="" />);
