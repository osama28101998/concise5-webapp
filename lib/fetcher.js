
const fetcher = async ([url, token]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Invalid or expired token");
    }
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  return response.json();
};

export default fetcher;