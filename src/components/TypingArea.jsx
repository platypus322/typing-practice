// src/components/TypingArea.jsx
function TypingArea({ quote, input, getColor, fontSize, fontColor }) {
    return (
        <div style={{ margin: "2rem 0", fontSize: `${fontSize}px`, wordBreak: "break-word" }}>
            {quote.split("").map((char, i) => (
                <span
                    key={i}
                    style={{
                        color: getColor(char, i) === "black" ? fontColor : getColor(char, i),
                    }}
                >
                    {char}
                </span>
            ))}
        </div>
    );
    
}

export default TypingArea;
