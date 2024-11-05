import connectDb from "@/app/lib/db";
import Unit from "@/models/products/unitSchema";

connectDb();

export async function POST(req) {
    const formData = await req.json();
    try {
        const unit = new Unit(formData);
        await unit.save();
        return sendResponse('success', 200);
    } catch (e) {
        console.error(e);
        return sendResponse(e.message, 500);
    }
}

export async function GET(req) {
    try {

        const units = await Unit.find(); 

        if (units.length > 0) {
            return sendResponse(units, 200);
        } else {
            return sendResponse('No units found', 404);
        }
    } catch (e) {
        console.error(e);
        return sendResponse(e.message, 500);
    }
}

const sendResponse = (data, status) => {
    return new Response(JSON.stringify({ data }), {
        status: status,
        headers: { 'Content-Type': 'application/json' }
    });
};
