import Product from "@/models/products/Product";
import connectDb from "@/app/lib/db";
import { sendResponse } from "../../userAddress/route";

connectDb()

export async function GET(req){
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("brand");
    try{
        const products = await Product.find({brand})
        if(products.length > 0){
            sendResponse(products, 200)
        }else{
            sendResponse("No products found", 404)
        }
    } catch(e){
        console.error(e)
        sendResponse(e.message, 500)
    }
}