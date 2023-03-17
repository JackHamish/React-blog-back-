import mongoose from "mongoose";

const ComentSchema = new mongoose.Schema(
    {
        coment: {
            type: String,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Coment", ComentSchema);
