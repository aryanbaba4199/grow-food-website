import Cart from "@/models/orders/cart";
import connectDb from "@/app/lib/db";
import { sendResponse } from "../userAddress/route";


await connectDb(); 

export async function POST(req) {
  try {
    const { formData } = await req.json();
    
    const cart = new Cart(formData);
    await cart.save();
    
    console.log("Cart created");
    return new Response(JSON.stringify({ message: "Cart created" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error creating cart:", err);
    return new Response(JSON.stringify({ Error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req) {
  

  try {
    
    
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id) {
      return sendResponse("Id not provided", 405);
    }
    const cart = await Cart.find({userId: id});
    console.log(cart);
    return sendResponse(cart, 200);
  } catch (err) {
    console.error("Error fetching cart:", err);
    return sendResponse(err.message, 500);
  }
}

export async function DELETE(req){
  const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); 
    try{
      const cart = await Cart.findByIdAndDelete({_id : id});
      return sendResponse(cart, 200);
    }catch (err) {
      console.error("Error deleting cart:", err);
      return sendResponse(err.message, 500);
    }
}

