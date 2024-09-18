import { CollectionConfig } from "payload/types";
import { isAdminOrSelf } from "./access/isAdminOrSelf";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  // TODO: Add auth config
  // auth: {
  //     verify: {
  //         generateEmailHTML: ({ token }) => {
  //             return `<a href='${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}'>Verify account</a>`;
  //         }
  //     }
  // },
  admin: {
    useAsTitle: "email",
    description: "Users registered in the system",
  },
  labels: {
    singular: "User",
    plural: "Users",
  },

  access: {
    read: isAdminOrSelf,
    create: ({ req }) => req.user.role === 'admin',
    update: isAdminOrSelf,
    delete: ({ req }) => req.user.role === 'admin',
  },
  fields: [
    {
      name: "role",
      defaultValue: "user",
      required: true,
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
      access: {
        create: ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
        read: ({ req }) => req.user.role === 'admin',
      }
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: false,
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      required: false,
    },
    {
      name: "profile_finished",
      label: "Profile Complete",
      type: "checkbox",
      required: true,
      defaultValue: false,
    }
  ],
};
