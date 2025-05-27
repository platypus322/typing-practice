import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!id || !password) {
      alert("ID와 비밀번호를 입력하세요.");
      return;
    }

    localStorage.setItem("userId", id);
    navigate("/typing");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>로그인</h1>
      <input
        type="text"
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        style={{ display: "block", marginBottom: "1rem" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "1rem" }}
      />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default LoginPage;
