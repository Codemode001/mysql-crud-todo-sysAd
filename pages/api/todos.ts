import { db } from "@/lib/db";

export default async function handler(req: any, res: any) {
  const { id } = req.query;
  if (req.method === "GET") {
    try {
      const [rows] = await db.query("SELECT * FROM todos WHERE user_id = ?", [
        id,
      ]);
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ message: "Database error" });
    }
  }

  if (req.method === "POST") {
    const { task, due_date, priority, userIdInt } = req.body;
    try {
      await db.query(
        "INSERT INTO todos (task, due_date, priority, user_id) VALUES (?, ?, ?, ?)",
        [task, due_date, priority, userIdInt]
      );
      res.status(201).json({ message: "Todo added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Database error" });
    }
  }
}
