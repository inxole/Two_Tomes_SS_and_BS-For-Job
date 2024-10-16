import React from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import App from './App.tsx'
import '/app/src/assets/fonts/NieR-Regular.ttf'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
        <App />
    </RecoilRoot>
  </React.StrictMode>
)
