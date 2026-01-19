import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import { store } from "./redux/store";

console.log('Main: Starting execution');
const rootElement = document.getElementById('root');
console.log('Main: Root element found:', !!rootElement);

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
