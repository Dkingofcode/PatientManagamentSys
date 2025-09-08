export async function fetchTests(token, options = {}) {
    const params = new URLSearchParams();
    if (options.category)
        params.append("category", options.category);
    if (options.search)
        params.append("search", options.search);
    if (options.page)
        params.append("page", options.page.toString());
    if (options.limit)
        params.append("limit", options.limit.toString());
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
}
