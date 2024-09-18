"use client";
import React from "react";
import { User } from "@/payload-types";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { useTheme } from "@/context/themecontext";
import useDeviceType from "@/hooks/use-device-type";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ProfileProps {
  user: User | null;
}

const ProfileDetails: React.FC<ProfileProps> = ({ user }) => {
  const isMobile = useDeviceType();
  const { theme, toggleTheme } = useTheme();

  const handlePhoneChange = (e: any) => {
    let value = e.replace(/\D/g, "");
    if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 9) value = `${value.slice(0, 10)}-${value.slice(10)}`;
    return value;
  };

  return (
    <MaxWidthWrapper>
      <div>
        <h1 className="text-3xl font-bold text-center mt-5"> My Profile</h1>
        <div className="flex flex-col space-y-4 mt-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="border border-gray-300 p-2 rounded-md dark:text-black"
              value={user?.name || ""}
              readOnly
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border border-gray-300 p-2 rounded-md dark:text-black"
              value={user?.email}
              readOnly
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="phone" className="font-semibold">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              className="border border-gray-300 p-2 rounded-md dark:text-black"
              value={handlePhoneChange(user?.phone)}
              readOnly
            />
            <Input
              defaultValue={user?.email}
              className=""
              placeholder="youremail@example.com"
            />

          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default ProfileDetails;
