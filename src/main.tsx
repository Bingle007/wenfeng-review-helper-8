import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'; // 显式导入TypeScript文件

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
