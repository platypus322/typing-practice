function TypingArea({ quote, input, getColor, fontSize, fontColor, isFocused }) {
    return (
        <div
            style={{
                margin: "2rem 0",
                fontSize: `${fontSize}px`,
                wordBreak: "break-word",
                letterSpacing: "0.3px",
                position: "relative", // 커서 위치 기준
                display: "inline-block"
            }}
        >
            {/* quote의 각 글자를 순회하며 스타일 적용 */}
            {isFocused && input.length === 0 && (
                <span
                    className="typing-cursor"
                    style={{
                    display: "inline-block",
                    width: "1px",
                    height: `${fontSize}px`,
                    backgroundColor: fontColor,
                    animation: "blink 1s step-start infinite",
                    verticalAlign: "bottom",
                    marginRight: "1px"
                    }}  
                />
            )}  


            {quote.split("").map((char, i) => (
                <span
                    key={i}
                    style={{
                        color: getColor(char, i) === "black" ? fontColor : getColor(char, i),
                        position: "relative"
                    }}
                >
                    {char}
                    {/* 커서를 글자 내부가 아닌 "옆"에 덧씌우는 방식 */}
                    {isFocused && i === input.length - 1 && (
                        <span
                            className="typing-cursor"
                            style={{
                                position: "absolute",
                                right: "-1px", // 살짝 오른쪽
                                top: 0,
                                bottom: 0,
                                width: "1px",
                                backgroundColor: fontColor,
                                animation: "blink 1s step-start infinite"
                            }}
                        />
                    )}
                </span>
            ))}

            {/* 입력이 끝났을 때 quote 마지막 뒤에 커서 표시 */}
            {isFocused && input.length === quote.length && (
                <span
                    className="typing-cursor"
                    style={{
                        display: "inline-block",
                        width: "1px",
                        height: `${fontSize}px`,
                        backgroundColor: fontColor,
                        animation: "blink 1s step-start infinite",
                        marginLeft: "1px"
                    }}
                />
            )}
        </div>
    );
}


export default TypingArea;
