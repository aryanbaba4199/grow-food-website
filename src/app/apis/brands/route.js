import connectDb from "@/app/lib/db";
import Brand from "@/models/products/brandSchema";

connectDb();

// GET method
export async function GET() {
  try {
    const brands = await Brand.find();
    return new Response(JSON.stringify(brands), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ Error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST method
export async function POST(req) {
  try {
    const { name, icon } = await req.json(); // Parse the request body
    const existingBrand = await Brand.findOne({ name });

    if (!existingBrand) {
      const newBrand = new Brand({ name, icon });
      await newBrand.save();
      return new Response(
        JSON.stringify({ message: 'Brand created successfully' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: 'Brand already exists' }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ Error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// PUT method
export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const { name, icon } = await req.json(); // Parse the request body

  try {
    const brand = await Brand.findByIdAndUpdate(id, { name, icon }, { new: true });

    if (brand) {
      return new Response(JSON.stringify(brand), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: 'Brand not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ Error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req){
    const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  try{
    const brand = await Brand.findByIdAndDelete({_id : id});
    if(brand){
      console.log("Brand deleted");
      return new Response(JSON.stringify({message : 'Brand Deleted'}, {
        status : 200,
        headers : {'Content-Type': 'application/json'},
      }))
    }else{
      console.log("Brand not found");
      return new Response(JSON.stringify({message : 'Brand Not Found'}, {
        status : 404,
        headers : {'Content-Type': 'application/json'},
      }))
    }
  }catch(error){
    return new Response(JSON.stringify({ Error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
  }
}
