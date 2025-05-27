import { useEffect, useState } from "react";
import { saveResult } from "../db/indexedDB";
import ResultModal from "../components/ResultModal"; // 결과 모달 컴포넌트

function TypingPage() {
  const userId = localStorage.getItem("userId");
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");

  // 타이머 관련 state
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0); // ms

    // 타이머 측정용 useEffect
    const [accuracy, setAccuracy] = useState(100);
    const [cpm, setCpm] = useState(0);
    const [wpm, setWpm] = useState(0);

    // 결과 모달 상태
    const [showModal, setShowModal] = useState(false);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          if (input === quote) {
            setShowModal(true); // 정답 입력 후 Enter → 결과 표시
          } else if (showModal) {
            // 모달 켜진 상태에서 Enter → 닫고 다음 quote
            setShowModal(false);
            fetchQuote(); // 다음 문장
          }
        }
      };
    
      useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
      });
      
  // 타이머 측정 로직
  useEffect(() => {
    let interval;

    if (startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }

    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    if (!startTime || input.length === 0) {
      setAccuracy(100);
      setCpm(0);
      setWpm(0);
      return;
    }
  
    const interval = setInterval(() => {
      const minutes = elapsedTime / 60000;
      if (minutes === 0) return; // 나누기 0 방지
  
      // 정확히 입력한 글자 수
      const correctChars = input
        .split("")
        .filter((char, i) => char === quote[i])
        .length;
  
      const totalChars = input.length;
      const totalWords = input.trim().split(/\s+/).length;
  
      setAccuracy(Math.round((correctChars / totalChars) * 100));
      setCpm(Math.round(totalChars / minutes));
      setWpm(Math.round(totalWords / minutes));
    }, 100); // 0.1초마다 갱신
  
    return () => clearInterval(interval);
  }, [elapsedTime, input, quote, startTime]);
  

  // 명언 fetch 함수
  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.quotable.io/random?minLength=50&maxLength=120");
      const data = await res.json();
      setQuote(data.content);
      setInput(""); // 입력 초기화
      setStartTime(null); // 타이머 초기화
      setElapsedTime(0);
    } catch (error) {
      console.error("명언 불러오기 실패:", error);
      setQuote("⚠️ 명언을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 초기 한 번만 명언 가져오기
  useEffect(() => {
    fetchQuote();
  }, []);

  // 입력 처리
  const handleChange = (e) => {
    const value = e.target.value;

    // 타이머 시작 조건
    if (!startTime && value.length > 0) {
      setStartTime(Date.now());
    }

    // 타이머 리셋 조건
    if (value.length === 0) {
      setStartTime(null);
      setElapsedTime(0);
    }

    setInput(value);

    // 입력이 정답과 일치하면 다음 문장 로드 (Enter는 나중에 따로 처리할 것)
    if (value === quote) {
      setTimeout(() => {
        fetchQuote();
      }, 500);
    }
  };
  
  const handleClose = () => {
    saveResult({
      quote,
      input,
      accuracy,
      cpm,
      wpm,
      elapsedTime,
      timestamp: Date.now(),
    });
    setShowModal(false);
    fetchQuote();
  };

    // 글자 색상 결정 함수
  const getColor = (char, i) => {
    if (i < input.length) {
      return input[i] === char ? "black" : "red";
    }
    return "gray";
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>타자 연습</h1>
      <p>환영합니다, <strong>{userId}</strong>님!</p>

      <div style={{ margin: "2rem 0", fontSize: "1.5rem", wordBreak: "break-word" }}>
        {loading ? (
          <p>명언을 불러오는 중...</p>
        ) : (
          quote.split("").map((char, i) => (
            <span key={i} style={{ color: getColor(char, i) }}>{char}</span>
          ))
        )}
      </div>

      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="여기에 타이핑하세요"
        disabled={loading}
        style={{
          width: "100%",
          fontSize: "1.2rem",
          padding: "0.5rem",
          border: "1px solid #ccc",
        }}
      />

      <p style={{ marginTop: "1rem", fontSize: "1rem", color: "#666" }}>
        경과 시간: {(elapsedTime / 1000).toFixed(1)}초
      </p>

      <p style={{ marginTop: "1rem", fontSize: "1rem", color: "#666" }}>
        ⏱{(elapsedTime / 1000).toFixed(1)}초 | 🎯 정확도: {accuracy}% | ⚡ CPM: {cpm} | 📝 WPM: {wpm}
      </p>

    </div>
  );
}

export default TypingPage;
