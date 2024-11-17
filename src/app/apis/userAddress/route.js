import connectDb from "@/app/lib/db";
import Address from "@/models/users/addressSchema";

connectDb();

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); // Removed JSON.parse, assuming id is a string
    console.log(id);
    if (!id) {
        return sendResponse("Invalid ID", 400);
    }

    try {
        const address = await Address.find({userId : id});

        if (address) {
            
            return sendResponse(address, 200);
        } else {
            return sendResponse("User not found", 404);
        }
    } catch (e) {
        console.error(e);
        return sendResponse("Server error", 500);
    }
}

export async function POST(req){
    const formData = await req.json();

    try{
        const address = new Address(formData);
   
        await address.save();
        return sendResponse(address, 200);
    }catch(e){
        console.error(e);
        return sendResponse("Server error", 500);
    }
}


export const sendResponse = (data, status) => {
    return new Response(JSON.stringify({ data }), {
        status: status,
        headers: { 'Content-Type': 'application/json' }
    });
};
