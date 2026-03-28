import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Request_password from "./pages/auth/request_password";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import Email from "./pages/auth/email";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/request-password" element={<Request_password />}/>
        <Route path="/email-verification" element={<Email />}/>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;