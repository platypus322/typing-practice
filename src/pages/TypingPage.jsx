import { useEffect, useState, useRef } from "react";
import { saveResult } from "../db/indexedDB";
import ResultModal from "../components/ResultModal";
import ResultLogModal from "../components/ResultLogModal";
import TypingArea from "../components/TypingArea";
import SettingsPanel from "../components/SettingsPanel";
import { loadSettings, saveSettings } from "../db/indexedDB";

function TypingPage() {
    const userId = localStorage.getItem("userId");
    const inputRef = useRef(null); // ✅ input DOM 참조용

    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [cpm, setCpm] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showLogModal, setShowLogModal] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const [fontColor, setFontColor] = useState("black");
    const [finalStats, setFinalStats] = useState(null);
    const [isFocused, setIsFocused] = useState(false);

    const fetchQuote = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/quote");
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("응답이 JSON이 아닙니다.");
            }
            const data = await res.json();
            setQuote(data.quote);
            setAuthor(data.author);
            setInput("");
            setStartTime(null);
            setElapsedTime(0);
        } catch (error) {
            console.error("명언 불러오기 실패:", error);
            setQuote("⚠️ 명언을 불러올 수 없습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function applySettings() {
            const settings = await loadSettings();
            if (settings) {
                setFontSize(settings.fontSize || 16);
                setFontColor(settings.fontColor || "black");
            }
        }
        applySettings();
    }, []);

    useEffect(() => {
        saveSettings({ fontSize, fontColor });
    }, [fontSize, fontColor]);

    useEffect(() => {
        fetchQuote();

        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    }, []);

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
            if (minutes === 0) return;
            const correctChars = input.split("").filter((char, i) => char === quote[i]).length;
            const totalChars = input.length;
            const totalWords = input.trim().split(/\s+/).length;
            setAccuracy(Math.round((correctChars / totalChars) * 100));
            setCpm(Math.round(totalChars / minutes));
            setWpm(Math.round(totalWords / minutes));
        }, 100);

        return () => clearInterval(interval);
    }, [elapsedTime, input, quote, startTime]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter") {
                if (showModal) {
                    handleCloseResultModal();
                } else if (input === quote) {
                    setFinalStats({ accuracy, cpm, wpm, elapsedTime });
                    setShowModal(true);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [input, quote, showModal, accuracy, cpm, wpm, elapsedTime]);

    const handleChange = (e) => {
        const value = e.target.value;
        if (!startTime && value.length > 0) setStartTime(Date.now());
        if (value.length === 0) {
            setStartTime(null);
            setElapsedTime(0);
        }
        setInput(value);
    };

    const handleCloseResultModal = () => {
        saveResult({ quote, input, ...finalStats, timestamp: Date.now() });
        setShowModal(false);
        setFinalStats(null);
        fetchQuote();

        // ✅ 입력 필드에 포커스 재설정
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const getColor = (char, i) => {
        if (i < input.length) {
            return input[i] === char ? "black" : "red";
        }
        return "gray";
    };

    const focusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>타자 연습</h1>
            <p>환영합니다, <strong>{userId}</strong>님!</p>

            {loading ? (
                <p>명언을 불러오는 중...</p>
            ) : (
                <div onClick={focusInput} style={{ cursor: "pointer" }}>
                    <TypingArea
                        quote={quote}
                        input={input}
                        getColor={getColor}
                        fontSize={fontSize}
                        fontColor={fontColor}
                        isFocused={isFocused}
                    />
                    <p style={{ fontSize: "0.9rem", color: "#888", marginTop: "-1rem" }}>— {author}</p>
                </div>
            )}

            {/* 숨겨진 실제 입력 필드 */}
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}      // ✅ 포커스 감지
                onBlur={() => setIsFocused(false)}      // ✅ 포커스 해제 감지
                placeholder="여기에 타이핑하세요"
                disabled={loading}
                style={{
                    position: "absolute",
                    left: "-9999px",
                    opacity: 0
                }}
            />

            <p style={{ marginTop: "1rem", fontSize: "1rem", color: "#666" }}>
                ⏱ {(elapsedTime / 1000).toFixed(1)}초 | 🎯 정확도: {accuracy}% | ⚡ CPM: {cpm} | 📝 WPM: {wpm}
            </p>

            <button onClick={() => setShowLogModal(true)} style={{ marginTop: "1rem" }}>
                📜 결과 기록 보기
            </button>

            <SettingsPanel
                fontSize={fontSize}
                setFontSize={setFontSize}
                fontColor={fontColor}
                setFontColor={setFontColor}
            />

            {showModal && finalStats && (
                <ResultModal
                    accuracy={finalStats.accuracy}
                    cpm={finalStats.cpm}
                    wpm={finalStats.wpm}
                    elapsedTime={finalStats.elapsedTime}
                    onClose={handleCloseResultModal}
                />
            )}

            {showLogModal && (
                <ResultLogModal onClose={() => setShowLogModal(false)} />
            )}
        </div>
    );
}

export default TypingPage;
