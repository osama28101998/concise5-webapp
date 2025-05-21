export default async function handler(req, res) {
  try {
    console.log("🚀 ~ handler ~ req.body:", req.body);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/mb-user-login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: error.message });
  }
}
