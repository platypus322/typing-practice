export default async function handler(req, res) {
    try {
        const response = await fetch("https://zenquotes.io/api/random");
        const data = await response.json();

        res.status(200).json({
            quote: data[0].q,
            author: data[0].a
        });
    } catch (error) {
        console.error("ZenQuotes API 호출 실패:", error);
        res.status(500).json({ error: "Failed to fetch quote" });
    }
}
