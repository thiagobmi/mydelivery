import { Access, CollectionConfig } from "payload/types";

const yourOwn: Access = async ({ req : {user}}) => {
    if(user.role === 'admin'){
        return true
    }
    return{
        user:{
            equals: user.id
        }
    }
}

export const OrdersItems: CollectionConfig = {
    slug:"order_items",
    admin:{
        useAsTitle:"id",
        description:"Order Items placed by users (change this)",
    },
    labels:{
        singular:"Order Items",
        plural:"Orders Items",
    },
    access:{
        read: yourOwn,
        create: ({ req }) => req.user && req.user.role === 'admin',
        update: ({ req }) => req.user && req.user.role === 'admin',
        delete: ({ req }) => req.user && req.user.role === 'admin',
    },
    fields:[
        {
            name:"user",
            label: "User",
            type: "relationship",
            relationTo: "users",
            required: true,
        },
        {
            name:"product",
            label: "Product",
            type: "relationship",
            relationTo: "products",
            required: true,
        },
        {
            name:"quantity",
            label: "Quantity",
            type: "number",
            required: true,
            min: 1,
            max: 1000,
        },
        {
            name:"notes",
            label: "Notes",
            type: "textarea",
            required: false,
        }
        //TODO: Add opções e adicionais
    ]

} 