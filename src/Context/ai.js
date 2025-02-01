// "use server"
// import OpenAI from "openai";

// // Initialize OpenAI client


// // Function to generate product description
// export const generateDescription = async (product) => {
//     console.log("Initializing OpenAI", process.env.NEXT_PUBLIC_OPEN_AI);
// const openai = new OpenAI({
//   apiKey: process.env.NEXT_PUBLIC_OPEN_AI, 
// });
//   const prompt = `Generate a 200-word product description for a product named "${product.name}" from the brand "${product.brand}" in the category "${product.categories}".`;

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo", 
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//     });

   
//     return response.choices[0].message.content.trim();
//   } catch (error) {
//     console.error("Error generating description:", error);
//     return ""; 
//   }
// };
