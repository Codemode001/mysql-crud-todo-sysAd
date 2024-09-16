import { db } from "@/lib/db";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      const [data] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

      if ((data as any[]).length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Success", data });
    } catch (error) {
      res.status(500).json({ message: "Database error" });
    }
  }
}
