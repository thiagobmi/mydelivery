"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/themecontext";
import Logo from "../../public/logoSVG";
import { User } from "@/payload-types";
import { UserProfileValidator, TUserProfileValidator } from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { X, ChevronRight } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import InputMask from "react-input-mask";
import LastOrder from "./OrderDisplay";
import Link from "next/link";

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "pending":
      return "Under Review";
    case "processing":
      return "Processing";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Unknown";
  }
};


const ProfilePage = ({ user }: { user: User }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<TUserProfileValidator>({
    resolver: zodResolver(UserProfileValidator),
  });

  const { theme } = useTheme();
  const router = useRouter();
  const [editing, setEditing] = useState(!user.profile_finished);
  const { data: userOrders, isLoading, error } = trpc.auth.getOrdersFromUser.useQuery();

  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      router.push("/");
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Error updating profile!");
      }
    },
  });

  const onSubmit = (data: TUserProfileValidator) => {
    updateProfileMutation.mutate(data);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Logo width={200} height={50} theme={theme} />
          <h1 className="text-xl font-bold mt-4">Loading profile...</h1>
        </div>
      </div>
    );
  }

  return (
    <MaxWidthWrapper>
      {!user.profile_finished && (
        <div className="flex justify-center items-center text-center mt-4">
          <Alert className="dark:bg-gray-800">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>You haven't finished your registration yet!</AlertTitle>
            <AlertDescription>Finish now to start shopping!</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex justify-between items-center mt-5">
        <h1 className="text-2xl font-bold">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-xl font-bold flex justify-between items-center">
            My Information
            <Button variant="ghost" className="ml-2" type="button" onClick={() => setEditing(!editing)}>
              {!editing ? <FaEdit className="text-2xl" color={theme === "dark" ? "white" : "black"} /> :
                <X width={30} height={30} color={theme === "dark" ? "white" : "black"} />}
            </Button>
          </h2>
          <div>
            <Label htmlFor="name" className="text-base font-bold">Name</Label>
            <Input {...register("name")} defaultValue={user.name || ""} readOnly={!editing} className={cn({ "focus-visible:ring-red-500": errors.name })} />
            {errors?.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email" className="text-base font-bold">Email</Label>
            <Input {...register("email")} defaultValue={user.email} readOnly={!editing} className={cn({ "focus-visible:ring-red-500": errors.email })} />
            {errors?.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone" className="text-base font-bold">Phone</Label>
            <Input
              defaultValue={user.phone ?? ""}
              readOnly={!editing}
              {...register("phone")}
              className={cn({ "focus-visible:ring-red-500": errors.phone })}
            />
            {errors?.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
          <div className="min-h-[2.5rem]"> {/* Adjust the height as needed */}
            {editing && <Button type="submit" className="w-full text-lg">Update Profile</Button>}
          </div>
        </form>
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex justify-between items-center">
            Last Order
            <Link href="/orders" className="flex items-center text-blue-500 hover:text-blue-700 text-sm">
              View all <ChevronRight className="" size={23} />
            </Link>
          </h2>
          <LastOrder order={userOrders ? userOrders[0] : null} isLoading={isLoading} error={error} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default ProfilePage;
