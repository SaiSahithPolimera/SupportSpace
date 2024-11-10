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


app.get("/api/creator-details/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const creatorDetails = await prisma.creator.findUnique({
      where: { id: parseInt(userId) },
      include: {
        user: false,
      },
    });
    if (!creatorDetails) {
      return res.status(404).json({ error: "Creator not found" });
    }
    res.json(creatorDetails);
  } catch (error) {
    console.error("Error fetching creator data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching creator data" });
  }
});

app.post("/api/profile-setup", async (req, res) => {
  const { username, bio, websiteLink, paymentMethod, category } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
      include: { Creator: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.Creator) {
      await prisma.creator.create({
        data: {
          bio: bio,
          websiteLink: websiteLink,
          paymentMethod: paymentMethod,
          category: category,
          userId: user.id,
        },
      });
    } else {
      await prisma.creator.update({
        where: { userId: user.id },
        data: {
          bio: bio,
          websiteLink: websiteLink,
          paymentMethod: paymentMethod,
          category: category,
        },
      });
    }
    res.json({
      message: "Profile updated successfully",
      userType: user.userType,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the profile" });
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

app.get("/api/creator-details/profile/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const creatorDetails = await prisma.creator.findUnique({
      where: { userId: user.id },
      include: {
        user: true,
        funds: {
          include: {
            supporter: true,
          },
        },
        supporters: true,
      },
    });

    if (!creatorDetails) {
      return res.status(404).json({ error: "Creator not found" });
    }

    const totalDonations = creatorDetails.funds.reduce(
      (acc, fund) => acc + fund.amount,
      0
    );

    const uniqueSupporters = new Set(creatorDetails.funds.map(fund => fund.supporterId));
    const supporterCount = uniqueSupporters.size;

    res.json({
      ...creatorDetails,
      totalDonations,
      supporterCount,
    });
  } catch (error) {
    console.error("Error fetching creator data:", error);
    res.status(500).json({ error: "An error occurred while fetching creator data" });
  }
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

app.put("/api/creator-update/:username", async (req, res) => {
  const { username } = req.params;
  const { bio, websiteLink, paymentMethod, category } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const updatedCreator = await prisma.creator.update({
      where: { userId: user.id },
      data: { bio, websiteLink, paymentMethod, category },
    });
    res.status(200).json({
      message: "Profile updated successfully",
      creator: updatedCreator,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "An error occurred while updating profile" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
