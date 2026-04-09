import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './app/store.js'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './app/App.jsx'
if (import.meta.env.PROD) {
    console.log = () => {}
    console.error = () => {}
    console.warn = () => {}
}
// ReactDOM.createRoot wrap 
root.render(
    <HelmetProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </HelmetProvider>
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)