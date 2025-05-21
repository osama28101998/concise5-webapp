"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { useSelector } from "react-redux";
const PrivacyPolicy = () => {
  const user = useSelector((state) => state.auth.user);
  const [Content, setContent] = useState("");

  const { data, error, isLoading } = useSWR(
    user && user.Token
      ? [
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/settings/privacy_policy`,
          user.Token,
        ]
      : null,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setContent(data?.data?.value || "");
    }
  }, [data]);
  return (
    <>
      <title>Concise-5 | Privacy Policy</title>
      <section className="flex items-center justify-center  flex-col py-5">
        {/* <Image
          src="/assets/images/concise5logo.webp"
          alt="About Us"
          width={200}
          height={200}
          className="object-cover border rounded-full"
          priority
        /> */}

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Privacy Policy
        </h1>

        <div className="bg-white rounded-lg p-6 ">
          {isLoading && (
            <div className="flex items-center justify-center h-screen">
              <ClipLoader color="black" size={40} />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center py-4">
              <p>Error loading content: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Try Again
              </button>
            </div>
          )}
          {data && (
            <div
              className="prose max-w-none "
              dangerouslySetInnerHTML={{ __html: Content }}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
