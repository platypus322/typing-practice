// src/components/ResultModal.jsx
function ResultModal({ accuracy, cpm, wpm, elapsedTime, onClose }) {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 999
      }}
      onClick={onClose}
      >
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          minWidth: '300px'
        }}
        onClick={(e) => e.stopPropagation()} // 바깥 클릭만 닫히게
        >
          <h2>📊 결과 요약</h2>
          <p>정확도: <strong>{accuracy}%</strong></p>
          <p>CPM: <strong>{cpm}</strong></p>
          <p>WPM: <strong>{wpm}</strong></p>
          <p>시간: <strong>{(elapsedTime / 1000).toFixed(1)}초</strong></p>
          <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
            아무 곳이나 클릭 또는 Enter 키로 계속하기
          </p>
        </div>
      </div>
    );
  }
  
  export default ResultModal;
  