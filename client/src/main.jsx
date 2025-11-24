import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { AppContextProvider } from './context/AppContext.jsx'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom' // ADD THIS LINE

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter> {/* ADD THIS */}
        <AppContextProvider>
          <App />
          <Toaster position="top-right" />
        </AppContextProvider>
      </BrowserRouter> {/* ADD THIS */}
    </ClerkProvider>
  </StrictMode>,
)