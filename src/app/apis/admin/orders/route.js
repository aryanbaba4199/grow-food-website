import connectDb from "@/app/lib/db";
import Order from "@/models/orders/orders";
import User from "@/models/users/auth";
import { sendResponse } from "../../userAddress/route";

connectDb();
console.log("Connecting to database...");


export async function GET(req) {
    const {searchParams} =new URL(req.url)
    const id = searchParams.get('id');
    console.log('the id is ',id);
    try{
        const admin = await User.findOne({_id : id});
        if(admin){
            const orders = await Order.find();
        return sendResponse(orders, 200)
        }else{
            return sendResponse("Admin not found", 405);
        }
        
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

        const data = await req.json(); 

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


