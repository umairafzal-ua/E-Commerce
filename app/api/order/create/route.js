import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { inngest } from "@/config/inngest";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(req) {
  try {
    // 1. Auth
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse body
    const { address, items } = await req.json();
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "No items provided" }, { status: 400 });
    }

    // 3. Connect to DB
    await connectDB();

    // 4. Calculate amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }
      amount += product.offerPrice * item.quantity;
    }
    // Add 2% fee
    amount = amount + Math.floor(amount * 0.02);

    // 5. Save to MongoDB immediately
    const newOrder = await Order.create({
      userId,
      address,
      amount,
      items,
      date: Date.now()
    });

    const user=await User.findById(userId)
    if (user) {
      user.cartItems={}
      user.save()
    }

    // 6. Send event to Inngest for async processing
    // try {
    //   await inngest.send({
    //     name: "order/created",
    //     data: {
    //       userId,
    //       address,
    //       amount,
    //       items,
    //       date: newOrder.date
    //     }
    //   });
    // } catch (inngestError) {
    //   console.log("Inngest send failed:", inngestError);
    //   // Not throwing — order is still saved
    // }

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: newOrder
    });
    
    
  } catch (error) {
    console.log("Order create error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
