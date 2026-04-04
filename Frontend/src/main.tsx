import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          position="top-center"
          containerStyle={{ top: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#141414',
              color: '#EEEEEE',
              borderRadius: '100px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 500,
              boxShadow: '0 8px 32px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.16)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(16px)',
              maxWidth: '380px',
            },
            success: {
              iconTheme: {
                primary: '#06C167',
                secondary: '#141414',
              },
            },
            error: {
              iconTheme: {
                primary: '#F44336',
                secondary: '#141414',
              },
            },
          }}
        />
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
