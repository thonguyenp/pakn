import React from "react"
import ReactDOM from "react-dom/client"
import AppRouter from "./router/AppRouter"
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "react-quill-new/dist/quill.snow.css";
import { NotificationProvider } from "./contexts/NotificationContext";


ReactDOM.createRoot(
  document.getElementById("root")!
).render(

  <React.StrictMode>
    <NotificationProvider>
      <AppRouter />
    </NotificationProvider>
  </React.StrictMode>

)