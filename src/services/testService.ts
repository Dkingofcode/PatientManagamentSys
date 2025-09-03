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
    tests: [
      { id: "1", name: "X-Ray Chest", category: "Radiology", isActive: true },
      { id: "2", name: "Blood Test - CBC", category: "Lab", isActive: true },
      { id: "3", name: "MRI Brain", category: "Radiology", isActive: false },
    ],
    pagination: {
      page: options.page || 1,
      limit: options.limit || 10,
      total: 3,
      pages: 1,
    },
  };

  // Create a fetch with timeout
  const fetchWithTimeout = new Promise(async (resolve, reject) => {
    const timer = setTimeout(() => {
      console.warn("Fetch timed out, returning dummy data...");
      resolve(dummyData);
    }, 7000); // 7 seconds

    try {
      const res = await fetch(
        `https://pms-backend-postgresql.onrender.com/api/tests/?${params.toString()}`,
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

  return fetchWithTimeout;
}
