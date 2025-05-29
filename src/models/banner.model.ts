import mongoose from "mongoose";
import { Schema } from "mongoose";
import * as Yup from "yup";

export const bannerDAO = Yup.object({
    title: Yup.string().required(),
    image: Yup.string().required(),
    isShown: Yup.boolean().required(),
})

export const BANNER_MODEL_NAME = "Banner";

export type TypeBanner = Yup.InferType<typeof bannerDAO>;

export interface Banner extends TypeBanner {};

const BannerSchema = new Schema<Banner>({
    image: {
        type: Schema.Types.String,
        required: true
    },
    title: {
        type: Schema.Types.String,
        required: true
    },
    isShown: {
        type: Schema.Types.Boolean,
        required: true
    },
}, {
    timestamps: true
}
).index({
    title: "text"
});

const BannerModel = mongoose.model(BANNER_MODEL_NAME, BannerSchema);
export default BannerModel;