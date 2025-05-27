import { useEffect, useState } from "react";
import { saveResult } from "../db/indexedDB";
import ResultModal from "../components/ResultModal";
import ResultLogModal from "../components/ResultLogModal";
import TypingArea from "../components/TypingArea";
import SettingsPanel from "../components/SettingsPanel";
import { loadSettings, saveSettings } from "../db/indexedDB";



function TypingPage() {
    const userId = localStorage.getItem("userId");

    const [quote, setQuote] = useState("");
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

    const fetchQuote = async () => {
        setLoading(true);
        try {
            const res = await fetch("https://zenquotes.io/api/random");
            const data = await res.json();
            setQuote(data[0].q);
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

            const correctChars = input
                .split("")
                .filter((char, i) => char === quote[i])
                .length;

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
                if (input === quote) {
                    setShowModal(true);
                } else if (showModal) {
                    setShowModal(false);
                    fetchQuote();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [input, quote, showModal]);

    const handleChange = (e) => {
        const value = e.target.value;

        if (!startTime && value.length > 0) {
            setStartTime(Date.now());
        }

        if (value.length === 0) {
            setStartTime(null);
            setElapsedTime(0);
        }

        setInput(value);

        if (value === quote) {
            setTimeout(() => {
                fetchQuote();
            }, 500);
        }
    };

    const handleCloseResultModal = () => {
        saveResult({
            quote,
            input,
            accuracy,
            cpm,
            wpm,
            elapsedTime,
            timestamp: Date.now()
        });
        setShowModal(false);
        fetchQuote();
    };

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

            {loading ? (
                <p>명언을 불러오는 중...</p>
            ) : (
                <TypingArea
                    quote={quote}
                    input={input}
                    getColor={getColor}
                    fontSize={fontSize}
                    fontColor={fontColor}
                />

            )}

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
                    border: "1px solid #ccc"
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

            {showModal && (
                <ResultModal
                    accuracy={accuracy}
                    cpm={cpm}
                    wpm={wpm}
                    elapsedTime={elapsedTime}
                    onClose={handleCloseResultModal}
                />
            )}

            {showLogModal && (
                <ResultLogModal
                    onClose={() => setShowLogModal(false)}
                />
            )}
        </div>
    );
}

export default TypingPage;
