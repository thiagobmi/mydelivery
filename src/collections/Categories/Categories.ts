import { CollectionConfig } from 'payload/types';

export const Categories: CollectionConfig = {
    slug: 'categories',
    admin: {
        useAsTitle: 'name',
        description: 'Categories of products available in the store',
    },
    labels: {
        singular: 'Category',
        plural: 'Categories',
    },
    access : {
        read:({ req }) => req.user.role === 'admin',
        create: ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
        delete: ({ req }) => req.user.role === 'admin',
    },
    fields: [
        {
            name:"user",
            type: "relationship",
            relationTo: "users",
            required: false,
            hasMany: false,
            admin:{
                condition: () => true
            },
        },
        {
            name:"name",
            label: "Name",
            type: "text",
            required: true,
        },
        {
            name:"description",
            label: "Description",
            type: "textarea",
            required: false,
        },
        {
            name: "image",
            label: "Category Image",
            type: "upload",
            relationTo: "category_images",
            required: false,
            
        },
    ]
}
