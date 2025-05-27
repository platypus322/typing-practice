import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TypingPage from "./pages/TypingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/typing" element={<TypingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
