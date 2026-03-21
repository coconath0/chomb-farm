import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FarmProvider } from './FarmContext.jsx'
import { SelectionProvider } from './SelectionContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FarmProvider>
      <SelectionProvider>
        <App />
      </SelectionProvider>
    </FarmProvider>
  </StrictMode>,
)
