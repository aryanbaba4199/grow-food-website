import connectDb from "@/app/lib/db";
import SubCategory from "@/models/products/SubCategory";


connectDb();

export async function POST(req) {
  try {
    const formData = await req.json();

    const item = new SubCategory({
      name: formData.name,
    });

    await item.save();

    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ Error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req) {
  try {
    const subCategory = await SubCategory.find({});

    return new Response(JSON.stringify(subCategory), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ Error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
