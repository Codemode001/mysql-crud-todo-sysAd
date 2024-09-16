import { db } from "@/lib/db";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const [rows] = await db.query(
        "SELECT * FROM todos ORDER BY created_at DESC"
      );
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ message: "Database error" });
    }
  }

  if (req.method === "POST") {
    const { task, due_date, priority } = req.body;
    try {
      await db.query(
        "INSERT INTO todos (task, due_date, priority) VALUES (?, ?, ?)",
        [task, due_date, priority]
      );
      res.status(201).json({ message: "Todo added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Database error" });
    }
  }
}
