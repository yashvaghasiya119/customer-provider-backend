import monggose from "mongoose";

export async function mongoConnection(){
try {
    await monggose.connect("mongodb+srv://learnAtlas:TGjJXl0UHxxV0g7n@cluster0.uot18y5.mongodb.net")
    // await monggose.connect("mongodb+srv://yash:yashclear@cluster0.8ofow89.mongodb.net/")
    console.log("Connected to MongoDB Atlas successfully!");
    
} catch (error) {
    console.log(error);
    
}
}

// learnAtlas : TGjJXl0UHxxV0g7n
// mongodb+srv://learnAtlas:TGjJXl0UHxxV0g7n@cluster0.uot18y5.mongodb.net/