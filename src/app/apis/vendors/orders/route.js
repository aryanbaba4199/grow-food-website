import connectDb from "@/app/lib/db";
import Order from "@/models/orders/orders";
import { sendResponse } from "../../userAddress/route";

connectDb();

export async function GET(req) {
    const {searchParams} =new URL(req.url)
    const id = searchParams.get('id');
    try{
        
        const orders = await Order.find();
        return sendResponse(orders, 200)
    }catch(err){
        console.error(err);
        return sendResponse(err.message, 500);
    }
}

export async function UPDATE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    try {
        if (!id) {
            return sendResponse("Order ID not provided", 400);
        }

        const data = await req.json();  // Assumes request body has JSON format

        const updatedOrder = await Order.findByIdAndUpdate(id, data, { new: true });

        if (!updatedOrder) {
            return sendResponse("Order not found", 404);
        }

        return sendResponse(updatedOrder, 200);
    } catch (err) {
        console.error("Error updating order:", err);
        return sendResponse(err.message, 500);
    }
}


