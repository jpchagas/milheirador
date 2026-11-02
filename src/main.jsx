import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// The built pages already hold prerendered HTML (scripts/prerender.js) so the text is there
// without JavaScript; the app renders over it with the profile from the query string.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App path={window.location.pathname} search={window.location.search} />
  </StrictMode>,
)
