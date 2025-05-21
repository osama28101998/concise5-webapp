"use client";

import useSWR from "swr";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

 import { Worker } from "@react-pdf-viewer/core";
import { Viewer, Worker as PdfWorker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import postFetcher from "@/lib/postfetcher";

// // POST fetcher function
// const postFetcher = async ([url, payload]) => {
//   const res = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch data");
//   }

//   return res.json();
// };

const ScoreboardCard = () => {
  const userData = useSelector((state) => state.auth.user);

  const requestBody = {
    email: userData?.email,
    type: userData?.user_type === "manager" ? userData?.user_type : "user",
  };

  const { data, error, isLoading } = useSWR(
    userData
      ? [
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/get-summary-report-download-link`,
        requestBody,
          userData.Token
          
        ]
      : null,
    postFetcher
  );

  const downloadLink = data?.data?.summary_report_download_link
    ? `${process.env.NEXT_PUBLIC_BASE_URL}${data.data.summary_report_download_link}`
    : null;

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <>
      <title>Concise-5 | Scoreboard</title>
      <section className="flex flex-col items-center  space-y-5 min-h-screen">
        <div className="w-full ">
          <Card className="w-full rounded-none shadow-lg">
            {/* <CardHeader className="text-left">
              <CardTitle className="text-2xl font-bold">Scoreboard</CardTitle>
              <CardDescription>
                View or download your team's scoreboard report:
              </CardDescription>
            </CardHeader> */}
            <CardContent>
              {isLoading && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
              {error && (
                <div className="text-red-500 text-center py-2">
                  Error: {error.message}
                </div>
              )}
              {!isLoading && !error && !downloadLink && (
                <p className="text-center text-muted-foreground">
                  No summary report available at this time.
                </p>
              )}

              {downloadLink && (
                <div className=" overflow-hidden h-[80vh]">
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">

                    <Viewer
                      fileUrl={downloadLink}
                      plugins={[defaultLayoutPluginInstance]}
                    />
                  </Worker>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full max-w-sm flex bg-blue-600 hover:bg-blue-700 items-center rounded-full justify-center gap-2 mx-auto"
                disabled={isLoading || !downloadLink}
                onClick={() => downloadLink && window.open(downloadLink, "_blank")}
              >
                Download PDF
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </>
  );
};

export default ScoreboardCard;
