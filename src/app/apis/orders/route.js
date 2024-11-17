import connectDb from "@/app/lib/db";
import Order from "@/models/orders/orders";
import { sendResponse } from "../userAddress/route";
import Product from "@/models/products/Product";

connectDb();

export async function POST(req) {
    const formData = await req.json();
    console.log("Received orders:", formData);
    
    try {
        const orders = formData;
        const savedOrders = await Promise.all(orders.map(async (orderDetails) => {
            const product = await Product.findOne({ _id: orderDetails.productId });
            console.log("Retrieved product:", product);
            
            if (product) {
                orderDetails.vendorId = product.vendorId;
                console.log("Vendor ID set:", orderDetails.vendorId);
            } else {
                throw new Error(`Product not found for ID: ${orderDetails.productId}`);
            }

            const newOrder = new Order(orderDetails);
            console.log("Order before saving:", newOrder);
            
            const savedOrder = await newOrder.save();
            console.log("Saved Order:", savedOrder);
            return savedOrder; // Return saved order for potential further processing
        }));

        return sendResponse('success', 200);
    } catch (e) {
        console.error(e);
        return sendResponse(e.message, 500);
    }
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