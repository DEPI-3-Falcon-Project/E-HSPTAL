/* eslint-disable no-undef */
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@ehsptl.com" });

    if (adminExists) {
      console.log("⚠️  حساب إداري موجود. جاري استبداله...");
      // Delete the existing admin to recreate with proper password hashing
      await User.deleteOne({ email: "admin@ehsptl.com" });
      console.log("✅ تم حذف الحساب الإداري القديم");
    }

    // Create admin user with proper password hashing
    await User.create({
      name: "المسؤول",
      email: "admin@ehsptl.com",
      password: "Admin@12345",
      role: "admin",
      phone: "0201000000000",
      specialization: "Administrator",
    });

    console.log("🎉 تم إنشاء حساب الإدارة بنجاح!");
    console.log("═════════════════════════════════");
    console.log("📧 البريد الإلكتروني: admin@ehsptl.com");
    console.log("🔑 كلمة المرور: Admin@12345");
    console.log("═════════════════════════════════");
    console.log("⚠️  تأكد من حفظ بيانات الدخول هذه في مكان آمن");

    process.exit(0);
  } catch (error) {
    console.error("❌ خطأ في إنشاء حساب الإدارة:", error);
    process.exit(1);
  }
};

seedAdmin();
