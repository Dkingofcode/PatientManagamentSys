// // mock-server.js
// const jsonServer = require("json-server");
// const path = require("path");

// const server = jsonServer.create();
// const router = jsonServer.router(path.join(__dirname, "db.json"));
// const middlewares = jsonServer.defaults();

// server.use(middlewares);
// server.use(jsonServer.bodyParser);

// // --- Twilio Mock Endpoint ---
// server.post("/send-sms", (req, res) => {
//   const { to, body, channel } = req.body;

//   console.log("📨 Fake Twilio API Called:");
//   console.log("To:", to);
//   console.log("Channel:", channel || "N/A");
//   console.log("Body:", body);

//   res.json({
//     success: true,
//     to,
//     channel: channel || "N/A",
//     body,
//     sid: "FAKE_TWILIO_SID_" + Date.now(),
//   });
// });

// // --- Optional: Custom route for notifications or file uploads ---
// // Example: POST /notifications
// server.post("/notifications", (req, res) => {
//   const notification = { ...req.body, id: Date.now() };
//   const db = router.db; // lowdb instance
//   db.get("notifications").push(notification).write();
//   res.status(201).json(notification);
// });

// // Example: POST /uploads
// server.post("/uploads", (req, res) => {
//   const upload = { ...req.body, id: Date.now() };
//   const db = router.db; // lowdb instance
//   db.get("uploads").push(upload).write();
//   res.status(201).json(upload);
// });

// // Use default JSON Server router for /messages, /notifications, /uploads
// server.use(router);

// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`🚀 Mock server running at http://localhost:${PORT}`);
//   console.log(
//     `📂 db.json REST endpoints available: /messages, /notifications, /uploads`
//   );
//   console.log(`📨 Twilio mock endpoint available: /send-sms`);
// });
