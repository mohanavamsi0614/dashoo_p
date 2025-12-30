import './index.css'
import App from './App.jsx'
import { createRoot } from 'react-dom/client'
import { Analytics } from "@vercel/analytics/next"
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Analytics />
  </BrowserRouter>
)
