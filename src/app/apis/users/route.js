import connectDb from "@/app/lib/db";
import User from "@/models/users/auth";
import jwt from "jsonwebtoken";

connectDb();

export async function POST(req) {
  const { formData } = await req.json();
  const { email } = formData;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = new User(formData);
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      "whe8r38659jkesefih8y8y4kGUg8ww88ioshf98",
      { expiresIn: "8760h" }
    );
    return new Response(JSON.stringify({ user, token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error during registration:", err);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const formData = JSON.parse(searchParams.get('formData'));

  const email = formData.email;
  const password = formData.password;

  try {
    const user = await User.findOne({ email: email });
    console.log(user);

    // Check if the user exists and if the password matches
    if (user && user.password === password) {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        "whe8r38659jkesefih8y8y4kGUg8ww88ioshf98",
        { expiresIn: "8760h" }
      );

      // Create a new user object without the password
      const { password: _, ...userWithoutPassword } = user.toObject(); // Convert Mongoose document to a plain object

      return new Response(JSON.stringify({ user: userWithoutPassword, token: token }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ message: "Password incorrect" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

