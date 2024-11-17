import Category from "@/models/products/categories";
import connectDb from "@/app/lib/db";

connectDb();

export async function POST(req) {
  const { name, icon } = await req.json();
  try {
    const existingCategory = await Category.findOne({ name });
    if (!existingCategory) {
      let newCategory = new Category({ name, icon });
      await newCategory.save();
      return new Response(
        JSON.stringify({ message: "Created" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      console.log("Category exists");
      return new Response(
        JSON.stringify({ message: "Category already exists" }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ Error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req) {
  try {
    const categories = await Category.find();
    return new Response(JSON.stringify(categories), {
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

export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const { name, icon } = await req.json();
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { name, icon },
      { new: true }
    );
    if (category) {
      console.log("Category updated");
      return new Response(JSON.stringify(category), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      console.log("Category not found");
      return new Response(
        JSON.stringify({ message: "Category not in database" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (err) {
    console.log("Error updating category", err);
    return new Response(JSON.stringify({ Error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    const category = await Category.findByIdAndDelete({ _id: id });
    if (category) {
      console.log("Category deleted");
      return new Response(JSON.stringify({ message: "Category deleted" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      console.log("Error deleting category");
      return new Response(
        JSON.stringify({ message: "Error deleting category" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ Error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
