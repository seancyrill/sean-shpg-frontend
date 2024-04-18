import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ShoppingCartProvider } from "./context/ShoppingCartContext.tsx";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";

//if (process.env.NODE_ENV === 'production') {
disableReactDevTools();
//}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.ENV_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <ShoppingCartProvider>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </ShoppingCartProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
    ;
  </React.StrictMode>
);
