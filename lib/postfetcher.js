const postFetcher = async ([url, payload,Token]) => {
   const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json",Authorization: `Bearer ${Token}`, },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
export default postFetcher;
