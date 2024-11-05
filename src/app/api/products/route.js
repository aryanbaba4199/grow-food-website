import Product from "@/models/products/Product";
import connectDb from "@/app/lib/db";

connectDb(); // Removed 'await' since it should be executed synchronously here.

// GET method
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id"); // Extract 'id' from query params

  try {
    if (id) {
      // Fetch product by ID
      const product = await Product.findById(id);
      if (!product) {
        return new Response(JSON.stringify({ message: "Product not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(product), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Fetch all products if no ID is provided
      const products = await Product.find();
      return new Response(JSON.stringify(products), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ Error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST method
export async function POST(req) {
  try {
    const productData = await req.json(); // Parse JSON body
    const newProduct = new Product(productData);
    await newProduct.save();
    return new Response(JSON.stringify({ message: "Product Created" }), {
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

// PUT method
export async function PUT(req) {
  try {
    const formData = await req.json(); // Parse JSON body
    const id = formData._id;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          name: formData.name,
          description: formData.description,
          brand: formData.brand,
          categories: formData.categories,
          subCategory: formData.subCategory,
          image: formData.image,
          discount: formData.discount,
          price: formData.price,
          display: formData.display ?? true,
          sellingPrice: formData.sellingPrice,
          productQty: formData.productQty,
          minimumOrderQty: formData.minimumOrderQty,
          availableQty: formData.availableQty,
          foodPreference: formData.foodPreference,
          life: formData.life,
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ message: "Product updated", product: updatedProduct }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ Error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE method
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ message: "Product deleted" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ Error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
