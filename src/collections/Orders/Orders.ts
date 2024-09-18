import { Access, CollectionConfig } from "payload/types";

const yourOwn: Access = async ({ req: { user } }) => {
    if (user.role === 'admin') {
        return true;
    }
    return {
        user: {
            equals: user.id,
        },
    };
};

export const Orders: CollectionConfig = {
    slug: "orders",

    admin: {
        useAsTitle: "id",
        description: "Orders placed in the store",
    },

    labels: {
        singular: "Order",
        plural: "Orders",
    },

    access: {
        read: yourOwn,
        create: ({ req }) => req.user && req.user.role === 'admin',
        update: ({ req }) => req.user && req.user.role === 'admin',
        delete: ({ req }) => req.user && req.user.role === 'admin',
    },

    fields: [
        {
            name: "user",
            label: "User",
            type: "relationship",
            relationTo: "users",
            required: true,
        },
        {
            name: "total",
            label: "Total",
            type: "number",
            required: true,
            min: 0.01,
            max: 1000000,
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { label: "Pending", value: "pending" },
                { label: "Processing", value: "processing" },
                { label: "Completed", value: "completed" },
                { label: "Cancelled", value: "cancelled" },
            ],
            defaultValue: "pending",
            required: true,
        },
        {
            name: "notes",
            label: "Notes",
            type: "textarea",
            required: false,
        },
        {
            name: "address",
            label: "Delivery Address",
            type: "group",
            fields: [
                {
                    name: "state",
                    label: "State",
                    type: "text",
                    required: true,
                },
                {
                    name: "city",
                    label: "City",
                    type: "text",
                    required: true,
                },
                {
                    name: "street",
                    label: "Street",
                    type: "text",
                    required: true,
                },
                {
                    name: "zip",
                    label: "ZIP Code",
                    type: "text",
                    required: true,
                },
                {
                    name: "number",
                    label: "Number",
                    type: "text",
                    required: true,
                },
                {
                    name: "complement",
                    label: "Complement",
                    type: "text",
                    required: false,
                },
            ],
        },
        {
            name: "items",
            label: "Items",
            type: "array",
            required: true,
            fields: [
                {
                    name: "product",
                    label: "Product",
                    type: "relationship",
                    relationTo: "products",
                    required: true,
                },
                {
                    name: "quantity",
                    label: "Quantity",
                    type: "number",
                    required: true,
                    min: 1,
                },
                {
                    name: "notes",
                    label: "Notes",
                    type: "textarea",
                    required: false,
                },
            ],
        },
    ],
};
