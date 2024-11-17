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

export async function GET(req) {
    const adminEmails = [
        'aryanbaba4199@gmail.com', 
        'aryanbaba4198@gmail.com',
        'vt773178@gmail.com'
    ];

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // Check if the email is authorized
    if (!adminEmails.includes(email)) {
        return sendResponse("You are not authorized", 405);
    }

    try {
        const products = await Product.find();
        return sendResponse(products, 200); 
    } catch (err) {
        console.log(err);
        return sendResponse(err.message, 500);
    }
}


const sendResponse = (data, status) => {
    return new Response(JSON.stringify({ data }), {
        status: status,
        headers: { 'Content-Type': 'application/json' }
    });
};