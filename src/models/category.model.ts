import mongoose from "mongoose";
import * as Yup from "yup";

const Schema = mongoose.Schema;

export const categoryDAO = Yup.object({
    name: Yup.string().required(),
    description: Yup.string().required(),
    icon: Yup.string().required(),
});

export type Category = Yup.InferType<typeof categoryDAO>;

const categorySchema = new Schema<Category>({
    name: {
        type: Schema.Types.String,
        required: true,
        min: 3
    },
    description: {
        type: Schema.Types.String,
        required: true,
        min: 3
    },
    icon: {
        type: Schema.Types.String,
        required: true,
    },
},{
    timestamps: true,
});

const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;