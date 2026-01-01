import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient();
}

prisma = global.prisma;


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, type } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // SIGNUP
  if (type === "signup") {
    try {
      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashed },
      });
      return res.json({ message: "Signup success" });
    } catch (err) {
      return res.status(500).json({ message: "User already exists" });
    }
  }

  // LOGIN
  if (type === "login") {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    return res.json({ token });
  }

  res.status(400).json({ message: "Invalid request" });
}
