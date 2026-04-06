import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Request_password from "./pages/auth/RequestPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Email from "./pages/auth/Email";
import Chat from "./pages/Chat"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat" element={<Chat />}/>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/change-password" element={<ChangePassword />}/>
        <Route path="/request-password" element={<Request_password />}/>
        <Route path="/email-verification" element={<Email />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;