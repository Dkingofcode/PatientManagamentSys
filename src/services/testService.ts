// src/services/testService.ts
export async function fetchTests(
  token: string,
  options: { category?: string; search?: string; page?: number; limit?: number } = {}
) {
  const params = new URLSearchParams();

  if (options.category) params.append("category", options.category);
  if (options.search) params.append("search", options.search);
  if (options.page) params.append("page", options.page.toString());
  if (options.limit) params.append("limit", options.limit.toString());

  // Dummy fallback data
  const dummyData = {
    
  };

  const fetchWithTimeout = new Promise(async (resolve) => {
    const timer = setTimeout(() => {
      console.warn("Fetch timed out, returning dummy data...");
      resolve(dummyData);
    }, 1000);

    try {
      const res = await fetch(
        `https://pms-backend-postgresql.onrender.com/api/tests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      clearTimeout(timer);

      if (!res.ok) {
        console.error("API error, using dummy data...");
        resolve(dummyData);
      } else {
        resolve(await res.json());
      }
    } catch (err) {
      clearTimeout(timer);
      console.error("Fetch failed, using dummy data...", err);
      resolve(dummyData);
    }
  });

  return await fetchWithTimeout; // <-- important
}
