// src/components/SettingsPanel.jsx
import { useState, useEffect } from "react";

function SettingsPanel({ fontSize, setFontSize, fontColor, setFontColor }) {
    const colors = ["black", "red", "orange", "yellow", "green", "blue", "navy", "purple"];

    return (
        <div style={{ marginTop: "2rem" }}>
            <h3>⚙️ 설정</h3>

            <div style={{ marginBottom: "1rem" }}>
                <label>글자 크기: {fontSize}px</label>
                <input
                    type="range"
                    min="8"
                    max="30"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                />
            </div>

            <div>
                <label>글자 색상:</label>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    {colors.map((color) => (
                        <button
                            key={color}
                            onClick={() => setFontColor(color)}
                            style={{
                                backgroundColor: color,
                                border: fontColor === color ? "3px solid #333" : "1px solid #ccc",
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                cursor: "pointer"
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SettingsPanel;