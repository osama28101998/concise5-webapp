export default async function handler(req, res) {
  const path = Array.isArray(req.query.path)
    ? req.query.path.join("/")
    : req.query.path || "";

  const targetUrl = `http://35.202.100.254/oe/api/${path}`;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      ...req.headers,
      host: "", 
    },
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
  });

  const data = await response.arrayBuffer();

  // Copy status and headers
  res.status(response.status);
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "content-encoding") {
      res.setHeader(key, value);
    }
  });

  res.send(Buffer.from(data));
}
