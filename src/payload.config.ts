import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import path from "path";
import { Users } from "./collections/Users";
import dotenv from 'dotenv'
import { Products } from "./collections/Products/Products";
import { Categories } from "./collections/Categories/Categories";
import { ProductImages } from "./collections/Products/ProductImages";
import { CategoryImages } from "./collections/Categories/CategoryImages";
import { Orders } from "./collections/Orders/Orders";
import { OrdersItems } from "./collections/Orders/OrderItem";
import Logo from '../public/logoSVG'

dotenv.config({
    path: path.resolve(__dirname, '../.env')
})

export default buildConfig({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
    collections: [Users, Products, Categories, ProductImages,CategoryImages, Orders],
    routes:{
        admin: '/admin'
    },
    admin: {
        user: "users",
        bundler: webpackBundler(),
        meta:{
            titleSuffix: "- My Delivery",
        },
        components:{
            graphics: {
                Logo
            }
        }
    },
    rateLimit:{
        max: 2000
    },
    editor: slateEditor({}),
    db: mongooseAdapter({
        url: process.env.MONGO_URL!,
    }),
    typescript:{
        outputFile: path.resolve(__dirname, 'payload-types.ts')
    },
    localization:{
        locales: ['pt-BR'],
        defaultLocale: 'pt-BR'
    }
})