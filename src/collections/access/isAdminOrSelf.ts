import { Access } from "payload/config";

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (user) {
    if (user.role === "admin") {
      return true;
    }
    return {
      id: {
        equals: user.id,
      },
    };
  }
  return false;
};
