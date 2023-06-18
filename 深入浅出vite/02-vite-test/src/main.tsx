import React from 'react'
import ReactDOM from 'react-dom/client'
// 在vite项目中，一个import语句即代表一个HTTP请求。
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)