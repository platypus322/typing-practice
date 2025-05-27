// src/components/ResultLogModal.jsx
import { useEffect, useState } from "react";
import { getAllResults } from "../db/indexedDB";

function ResultLogModal({ onClose }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const data = await getAllResults();
      setResults(data.sort((a, b) => b.timestamp - a.timestamp));
    };
    fetchResults();
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxHeight: '80vh', overflowY: 'auto', minWidth: '400px'
      }} onClick={(e) => e.stopPropagation()}>
        <h2>📜 저장된 결과 목록</h2>
        {results.length === 0 ? (
          <p>저장된 결과가 없습니다.</p>
        ) : (
          <ul>
            {results.map((r, i) => (
              <li key={i} style={{ marginBottom: '1rem' }}>
                <p><strong>{new Date(r.timestamp).toLocaleString()}</strong></p>
                <p>정확도: {r.accuracy}% | CPM: {r.cpm} | WPM: {r.wpm}</p>
                <p>문장: "{r.quote}"</p>
              </li>
            ))}
          </ul>
        )}
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
          아무 곳이나 클릭하여 닫기
        </p>
      </div>
    </div>
  );
}

export default ResultLogModal;
