"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { updateProfile } from "@/lib/redux/slices/authSlice";
import { ClipLoader } from "react-spinners";

export default function Profile() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    profileImage: "",
    profileImageFile: null,
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const fileInputRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  console.log("🚀 ~ Profile ~ user:", user)

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      setFormData({
        profileImage: `${process.env.NEXT_PUBLIC_BASE_URL}/${user.profile_image}` || "",
        profileImageFile: null,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        phone: user.mobile_number || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(file),
        profileImageFile: file,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("first_name", formData.firstName);
      formDataToSend.append("last_name", formData.lastName);
      formDataToSend.append("mobile_number", formData.phone);
      if (formData.profileImageFile) {
        formDataToSend.append("profile_image", formData.profileImageFile);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/update-user-profile`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      console.log("🚀 ~ handleSubmit ~ data:", data)
      dispatch(updateProfile(data.userdata));
      setLoading(false);
      toast.success(data?.message);
    } catch (error) {
      setLoading(false);
      console.error("Error updating profile:", error.message);
      toast.error(error.message || "Failed to update profile");
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <title>Concise-5 | User Profile</title>
      <section className="flex justify-center items-center">
        <form onSubmit={handleSubmit} className="space-y-6 p-5 max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div
                className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200"
                style={{
                  backgroundImage: `url(${
                    formData.profileImage || "/assets/images/no-image.png"
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <button
                type="button"
                onClick={handleImageClick}
                className="absolute  bottom-0 right-0 bg-blue-700  text-white p-2 rounded-full shadow-md hover:bg-primary/90 transition-colors"
                aria-label="Upload new profile picture"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                aria-label="Upload profile picture"
              />
            </div>
          </div>

          <div className="space-y-4 flex flex-col">
            <div className="space-y-3 gap-4">
              <div className="space-y-3">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                type="tel"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                disabled
                placeholder="john.doe@example.com"
                type="email"
                required
              />
            </div>
          </div>

          <Button
            disabled={loading}
            type="submit"
            className="w-full cursor-pointer bg-blue-700 hover:bg-blue-600"
          >
            {loading ? <ClipLoader color="white" size={20} /> : "Save"}
          </Button>
        </form>
      </section>
    </>
  );
}