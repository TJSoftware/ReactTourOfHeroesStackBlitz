import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MessageProvider } from './MessageContext'
import { AppProvider } from './AppContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MessageProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </MessageProvider>
    </BrowserRouter>
  </React.StrictMode>
)