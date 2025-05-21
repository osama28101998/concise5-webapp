import { FileTextIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

const playlist = () => {
  return (
    <>
      <title>Concise-5 | Playlist</title>
      <section className="flex flex-col  items-center p-5 space-y-5 min-h-screen">
        {/* <Image
          src="/assets/images/concise5logo.webp"
          alt="Concise-5 Logo"
          width={200}
          height={200}
          className="object-cover border rounded-full"
          priority
        /> */}

        <span>Playlist is empty</span>
        <FileTextIcon size={60} />
      </section>
    </>
  );
};

export default playlist;
