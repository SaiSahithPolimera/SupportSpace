const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

app.use(cors());
app.use(express.json());

app.post("/api/signup", async (req, res) => {
  const { fullName, username, email, password, userType } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { fullName, username, email, password: hashedPassword, userType },
    });
    res
      .status(201)
      .json({ message: "User created successfully", userType: user.userType });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token, userType: user.userType });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/getCreators", async (req, res) => {
  try {
    const creators = await prisma.creator.findMany({
      include: { user: true },
    });

    res.json({ creators });
  } catch (error) {
    console.error("Error fetching creators:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/profile-setup", async (req, res) => {
  const { username, bio, websiteLink, paymentMethod, category, userType } =
    req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        userType: userType || user.userType,
        updatedAt: new Date(),
      },
    });

    if (userType === "CREATOR") {
      const creator = await prisma.creator.upsert({
        where: { userId: user.id },
        update: {
          bio,
          websiteLink,
          paymentMethod,
          category,
        },
        create: {
          userId: user.id,
          bio,
          websiteLink,
          paymentMethod,
          category,
        },
      });
    }
    return res.status(200).json({
      message: `${userType} profile updated successfully.`,
      userType: updatedUser.userType,
      userId: updatedUser.id,
    });
  } catch (error) {
    console.error("Error during profile setup:", error);
    res
      .status(500)
      .json({ error: "An error occurred while setting up the profile." });
  }
});

app.put("/api/creator-update/:id", async (req, res) => {
  const { id } = req.params;
  const { bio, websiteLink, paymentMethod, category } = req.body;

  try {
    const creator = await prisma.creator.update({
      where: { id: parseInt(id) },
      data: {
        bio,
        websiteLink,
        paymentMethod,
        category,
      },
    });

    res.status(200).json({ message: "Profile updated successfully", creator });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Error updating profile" });
  }
});

app.post("/api/donate", async (req, res) => {
  const { creatorId, supporterName, amount } = req.body;
  const { id, fullName, email, password, userType } =
    await prisma.user.findUnique({
      where: {
        username: supporterName,
      },
    });
  if (!creatorId || !supporterName || !amount) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: creatorId, supporterName, or amount.",
    });
  }

  try {
    const supporter = await prisma.supporter.upsert({
      where: { userId: id },
      update: {},
      create: {
        user: {
          connectOrCreate: {
            where: { username: supporterName },
            create: {
              username: supporterName,
              fullName: fullName,
              email: email,
              password: password,
              userType: userType,
            },
          },
        },
      },
    });

    const fund = await prisma.fund.create({
      data: {
        amount: parseFloat(amount),
        creatorId: parseInt(creatorId),
        supporterId: supporter.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Donation successfully processed.",
      fund,
    });
  } catch (error) {
    console.error("Error processing donation:", error);
    res
      .status(500)
      .json({ success: false, message: "Error processing donation." });
  }
});

app.get("/api/creator-funds/:creatorId", async (req, res) => {
  const { creatorId } = req.params;
  console.log("Creator id");
  try {
    const funds = await prisma.fund.findMany({
      where: { creatorId: parseInt(creatorId) },
      include: { supporter: { include: { user: true } } },
    });
    res.status(200).json({ success: true, funds });
  } catch (error) {
    console.error("Error fetching funds:", error);
    res.status(500).json({ success: false, message: "Error fetching funds." });
  }
});
app.get("/api/creator-details/:id", async (req, res) => {
  const { id } = req.params;
  const creatorDetails = await prisma.creator.findUnique({
    where: { id: parseInt(id) },
    include: { user: true },
  });
  if (!creatorDetails) {
    return res.status(404).json({ error: "Creator not found" });
  }
  res.json({ bio: creatorDetails.bio });
});

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await prisma.creator.findMany({
      select: { category: true },
      distinct: ["category"],
    });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Error fetching categories" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
