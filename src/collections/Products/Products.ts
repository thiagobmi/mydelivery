import { CollectionConfig } from 'payload/types';

export const Products: CollectionConfig = {
    slug: 'products',
    admin: {
        useAsTitle: 'name',
        description: 'Products available in the store',
    },
    labels: {
        singular: 'Product',
        plural: 'Products',
    },
    access: {
        read: ({ req }) => true,
        create: ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
        delete: ({ req }) => req.user.role === 'admin',
    },
    fields: [
        {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
        },
        {
            name: "category",
            label: "Category",
            type: "relationship",
            relationTo: "categories",
            admin: {
                condition: () => true
            },
            hasMany: false,
            required: true,
        },
        {
            name: "description",
            label: "Description",
            type: "textarea",
            required: true,
        },
        {
            name: "price",
            label: "Price (R$)",
            type: "number",
            required: true,
            min: 0.01,
            max: 1000,
        },
        {
            name: "image",
            label: "Product Image",
            type: "upload",
            relationTo: "product_images",
            required: true,
        },
    ]
};
