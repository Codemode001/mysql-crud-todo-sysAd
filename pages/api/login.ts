import { db } from "@/lib/db";

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    try {
      const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
        username,
      ]);

      if ((rows as any[]).length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = (rows as any[])[0];

      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      res.status(500).json({ message: "Database error" });
    }
  }
}
