export async function fetchTests(
  token: string,
  options: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}
) {
  const params = new URLSearchParams();

  if (options.category) params.append("category", options.category);
  if (options.search) params.append("search", options.search);
  if (options.page) params.append("page", options.page.toString());
  if (options.limit) params.append("limit", options.limit.toString());

  // Dummy fallback data
  const dummyData = {
    
  };

<<<<<<< HEAD
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
=======

  return dummyData;
//   try {
//     const res = await fetch(
//       `https://localhost:8000/api/tests/?${params.toString()}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
>>>>>>> 1e28d40ea2b85bbc5714d68e396970b29f62fb1a

//     if (!res.ok) {
//       console.error("API error, using dummy data...");
//       return dummyData;
//     }

//     return await res.json();
//   } catch (err) {
//     console.error("Fetch failed, using dummy data...", err);
//     return dummyData;
//   }
// }

<<<<<<< HEAD
  return await fetchWithTimeout; // <-- important
}
=======

}
>>>>>>> 1e28d40ea2b85bbc5714d68e396970b29f62fb1a
