import connectDb from "@/app/lib/db";
import Order from "@/models/orders/orders";
import { sendResponse } from "../userAddress/route";

connectDb();

export async function POST(req){
    const formData = await req.json();
    console.log(formData);
    try{
        const orders = formData;
        const savedOrders = await Promise.all(orders.map(async(orderDetails) => {
            const newOrder = new Order(orderDetails)
            return await newOrder.save();
        }))
        return sendResponse('success', 200);
    }catch(e){
        console.error(e);
        return sendResponse(e.message, 500);
    };
}

export async function GET(req){
    const {searchParams} = new URL(req.url);
    const id = searchParams.get('id');

    try{
        const order = await Order.find({userId : id});
        
        if(order){
            return sendResponse(order, 200);
        }else{
            return sendResponse('no order found', 404);
        }
    }catch(e){
        return sendResponse(e.message, 500);
    }
}

export async function DELETE(req){
    const {searchParams} = new URL(req.url);
    const id = searchParams.get('id');
    try{
        const product = await Order.findByIdAndDelete({_id : id})
        if(product){
            return sendResponse('Deleted', 200);
        }else{
            return sendResponse('Product not found', 404);
        }
    }catch(e){
        console.error(e);
        return sendResponse(e.message, 500);
    
    }
}