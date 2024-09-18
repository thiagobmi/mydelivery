import { ImgHTMLAttributes } from "react";
import image from "./logo.png";

export const myIcons = {
    logo: (props: ImgHTMLAttributes<HTMLImageElement>) => (
        <img src={image.src} alt="logo" {...props} />
    )
};
