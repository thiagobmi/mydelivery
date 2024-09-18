import { CollectionConfig } from "payload/types";

export const CategoryImages: CollectionConfig = {
    slug: "category_images",
    admin: {
        useAsTitle: "altText",
        description: "Images of the product categories available in the store",
    },
    labels: {
        singular: "Category Image",
        plural: "Category Images",
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
        staticURL: "/category_images",
        staticDir: "./public/category_images",
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
