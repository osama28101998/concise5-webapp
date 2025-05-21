"use client";
import fetcher from "@/lib/fetcher";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import useSWR from "swr";

const IntroDuctionVideo = () => {
  const user = useSelector((state) => state.auth.user);

   
  const { data, error, isLoading } = useSWR(
    user && user.Token
      ? [
           `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/settings/ins_video_file`,
          user.Token,
        ]
      : null,
    fetcher
  );
  console.log("🚀 ~ IntroDuctionVideo ~ data:", data);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader color="black" size={40} />
      </div>
    );
  if (error)
    return <p className="text-center text-red-500">Failed to load video</p>;

  const videoPath = data?.data?.value;
  const videoUrl = videoPath
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/${videoPath}`
    : null;

  //  const videoUrl = videoPath
  //   ? `http://34.16.62.73/oe/${videoPath}`
  //   : null;
  return (
    <>
      <title>Concise-5 | Introduction Video</title>

      <section className="flex items-center justify-center flex-col p-5">
        {/* <Image
          src="/assets/images/concise5logo.webp"
          alt="About Us"
          width={200}
          height={200}
          className="object-cover border rounded-full"
          priority
        /> */}

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Introduction Video
        </h1>

        {videoUrl ? (
          <video controls width="800" className="rounded shadow-lg">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="text-center text-gray-500">
            Video path found but failed to play.
            <br />
            <code className="text-sm break-words">{videoUrl}</code>
          </div>
        )}
      </section>
    </>
  );
};

export default IntroDuctionVideo;
