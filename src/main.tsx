import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from './hooks/AuthProvider.tsx'
// import { Toaster } from 'react-hot-toast'
// import { LoaderProvider } from './hooks/LoaderProvider.tsx'
import Message from "./components/Message.tsx";
import { Provider } from "react-redux";
import { store } from "./Store/Store.ts";

// import { clearAuth, setAccessToken } from './Store/authSlice/index.ts'
// import { auth } from './config/FirebaseConfiguration.ts'

// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//     // User is signed in
//     const token = await user.getIdToken();
//     store.dispatch(setAccessToken(token));
//   } else {
//     // User is signed out
//     store.dispatch(clearAuth());
//   }
// });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <Message />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
