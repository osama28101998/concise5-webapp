"use client";

import { ClipLoader } from "react-spinners";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ClipLoader size={40} color="#2563EB" />
    </div>
  );
}