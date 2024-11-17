import Product from "@/models/products/Product";
import { sendResponse } from "../../userAddress/route";
import connectDb from "@/app/lib/db";

connectDb();

export async function GET(req) {
    console.log('searching in database...');
  // Get the search query parameter from the request URL
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return sendResponse("No search query provided", 400); // Bad request if query is missing
  }

  try {
    // Find products where the brand, category, or name matches the search query
    const products = await Product.find({
      $or: [
        { brand: { $regex: query, $options: "i" } },
        { categories: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    }).limit(10); 

    return sendResponse(products, 200); // Send products if found
  } catch (error) {
    console.error("Error fetching products:", error);
    return sendResponse("Error fetching products", 500);
  }
}
