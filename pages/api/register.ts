import { db } from "@/lib/db";

export default async function registerHandler(req: any, res: any) {
  console.log("API hit");
  if (req.method === "POST") {
    const { username, password } = req.body;

    try {
      const [result] = await db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password]
      );
      res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Database error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
