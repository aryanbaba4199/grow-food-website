import Product from "@/models/products/Product";
import connectDb from "@/app/lib/db";

connectDb();

export async function POST(req){
    const {formData} =await req.json();
    console.log('form data is ', formData);
    try{
        const products = await Product.insertMany(formData);
        return sendResponse('success', 200)
    }catch(e){
        console.error(e);
        return sendResponse('error', 500)
       
    }
}


const sendResponse = (data, status) => {
    return new Response(JSON.stringify({ data }), {
        status: status,
        headers: { 'Content-Type': 'application/json' }
    });
};