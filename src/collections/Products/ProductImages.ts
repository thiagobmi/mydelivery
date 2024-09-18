import { CollectionConfig } from "payload/types";

export const ProductImages: CollectionConfig = {
    slug: "product_images",
    admin: {
        useAsTitle: "altText",
        description: "Images of the products available in the store",
    },
    labels: {
        singular: "Product Image",
        plural: "Product Images",
    },
    access: {
        read: async ({ req }) => {
            const referer = req.headers.referer;
            if (!req.user || !referer?.includes("sell")) {
                return true;
            }
            return req.user.role === 'admin';
        },
        create: ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
        delete: ({ req }) => req.user.role === 'admin',
    },
    upload: {
        staticURL: "/product_images",
        staticDir: "./public/product_images",
        resizeOptions: {
            height: 1024,
            width: 1024,
        },

        imageSizes: [
            {
                name: "thumbnail",
                width: 400,
                height: 300,
                position: "center",
            },
            {
                name: "card",
                width: 768,
                height: 1024,
                position: "center",
            },
            {
                name: "tablet",
                width: 1024,
                height: undefined,
                position: "center",
            },
        ],
        mimeTypes: ["image/*"],
    },
    fields: [
        {
            name: "altText",
            label: "Alt Text",
            type: "text",
            required: false,
        },
    ],
};
