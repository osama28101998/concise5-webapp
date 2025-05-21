"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Head from "next/head";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const DetailPage = () => {
  const params = useParams();
  const tutorial = useSelector((state) => state.tutorial.selectedTutorial);
  console.log("🚀 ~ DetailPage ~ tutorial:", tutorial);
  const { voice: selectedVoice } = useSelector((state) => state.settings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);


  
  if (!tutorial) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading tutorial...</p>
      </div>
    );
  }

  const fetchAudio = async () => {
    setIsLoading(true);
    setError(null);

    const text = tutorial.updated_content;
    const plainText = text
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    try {
      const response = await fetch("/api/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: plainText, voice: selectedVoice }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch audio");
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      console.log("🚀 ~ fetchAudio ~ url:", url);
      setAudioUrl(url);
      setIsModalOpen(true);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  console.log(tutorial.title_name);
  const title = tutorial.title_name;
   useEffect(() => {
    if (title) {
      document.title = `Concise-5 | ${title}`;
    }
  }, [title]);
  return (
    <>
 
      <section className="max-w-4xl mx-auto md:px-6 py-10 space-y-10">
      <title>Concise-5 |{title}</title>
      <div className="bg-white rounded-lg p-6 space-y-6">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 text-center">
          {tutorial.title_name}
        </h1>

        <p className="text-gray-700 text-center">
          <span className="font-medium underline text-gray-800">
            Skills taught:
          </span>{" "}
          {tutorial.skills_taught}
        </p>

        <div className="flex flex-col sm:space-y-0 space-y-2 sm:flex-row items-center justify-between py-4 text-gray-700 text-sm">
          <h2 className="font-semibold">{tutorial.main_category_name}</h2>
          <p className="text-blue-600 font-semibold">
            5-minute update/tutorial
          </p>
        </div>

        <p className="text-gray-700 leading-relaxed">
          This concise tutorial will take 5 minutes of your time, focusing on
          delivering new information you may not have known before. Let’s begin!
        </p>

        <div
          className="prose prose-blue max-w-none"
          dangerouslySetInnerHTML={{ __html: tutorial.updated_content }}
        />

        <p className="text-gray-700">
          On behalf of the <span className="font-semibold">Concise 5</span>{" "}
          team, we hope you found this helpful.
        </p>
      </div>

      <div className="rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">References</h3>
        <ol className="list-decimal list-inside space-y-2">
          {tutorial.references.map((reference, index) => (
            <li className="text-blue-600" key={index}>
              <Link
                className="text-blue-600 hover:underline break-words"
                target="_blank"
                href={reference.text}
              >
                {reference.text}
              </Link>
            </li>
          ))}
        </ol>

        <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
          <DialogTrigger asChild>
            <Button
              className="capitalize bg-blue-800 hover:bg-blue-600 text-white w-full"
              onClick={fetchAudio}
              disabled={isLoading}
            >
              {isLoading
                ? "Loading audio..."
                : "Play audio version of this tutorial"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Audio Version</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {error && <p className="text-red-600">{error}</p>}
              {audioUrl ? (
                <div className="space-y-4">
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    className="w-full"
                    controls
                    autoPlay
                  />
                  <Button
                    onClick={togglePlayPause}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {audioRef.current?.paused ? "Play" : "Pause"}
                  </Button>
                </div>
              ) : (
                <ClipLoader color="blue" size={40} />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
    </>
  );
};

export default DetailPage;
