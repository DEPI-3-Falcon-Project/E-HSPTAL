import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "الاسم مطلوب"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    phone: {
      type: String,
      sparse: true,
    },
    contactType: {
      type: String,
      enum: ["email", "phone"],
      default: "email",
    },
    subject: {
      type: String,
      required: [true, "الموضوع مطلوب"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "الرسالة مطلوبة"],
    },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    attachment: {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      path: String,
      uploadDate: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

contactSchema.pre("save", function (next) {
  if (!this.email && !this.phone) {
    next(new Error("يجب توفير بريد إلكتروني أو رقم هاتف"));
  } else {
    next();
  }
});

contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1, priority: -1 });

export default mongoose.model("Contact", contactSchema);
