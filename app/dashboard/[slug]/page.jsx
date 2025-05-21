"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import postFetcher from "@/lib/postfetcher";
import {
  Bookmark,
  ChevronDown,
  ChevronLeft,
  FileText,
  Headset,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import useSWR from "swr";
import { toast } from "sonner";

const Detail = () => {
  const { voice: selectedVoice } = useSelector((state) => state.settings);
  const router = useRouter();
  const [audioUrl, setAudioUrl] = useState(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isListenMode, setIsListenMode] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const params = useParams();
  const slug = params.slug;
  const requestBody = {
    user_id: user?.user_id,
    categoryId: slug,
    type: user?.user_type === "manager" ? user?.user_type : "user",
  };

  const { data, error, isLoading } = useSWR(
    user
      ? [
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/mb-get-titles-by-userID-for-day-filtered-by-category-ID`,
          requestBody,
          user.Token,
        ]
      : null,
    postFetcher
  );

  const [allReadMessage, setAllReadMessage] = useState("");
  useEffect(() => {
    const fetchAllReadMessage = async () => {
      if (data && data.data && data.data.length === 0) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/settings/all_read_message`
          );
          const result = await response.json();
          if (result.status === 1 && result.data) {
            setAllReadMessage(result.data.value);
          }
        } catch (error) {
          console.error("Error fetching all read message:", error);
        }
      }
    };

    fetchAllReadMessage();
  }, [data]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isReadModalOpen, setIsReadModalOpen] = useState(false);
  const [questionsData, setQuestionsData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleReadClick = () => {
    setIsListenMode(false);
    setIsReadModalOpen(true);
  };

  const getQuestionare = async () => {
    try {
      setIsQuestionsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/questions/${selectedItem.id}`
      );
      const result = await response.json();

      if (!result.data?.questions || result.data.questions.length === 0) {
        toast.error("No questions found for this tutorial.");
        setQuestionsData(null);
        return;
      }

      const initialAnswers = {};
      result.data.questions.forEach((question) => {
        initialAnswers[question.id] = "";
      });

      setQuestionsData(result);
      setUserAnswers(initialAnswers);
      setCurrentStep(0);
      setCorrectAnswers(0);
      setAnsweredCorrectly(new Array(result.data.questions.length).fill(null));
      setShowResults(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions. Please try again.");
    } finally {
      setIsQuestionsLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    if (showResults) return; // Prevent answer changes when results are shown

    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    const currentQuestion = questionsData.data.questions[currentStep];
    const isCorrect = value === currentQuestion.answer;
    const newAnsweredCorrectly = [...answeredCorrectly];
    newAnsweredCorrectly[currentStep] = isCorrect;
    setAnsweredCorrectly(newAnsweredCorrectly);

    const totalCorrect = newAnsweredCorrectly.filter(
      (correct) => correct === true
    ).length;
    setCorrectAnswers(totalCorrect);
  };

  const handleNext = () => {
    if (showResults) return; // Prevent navigation when results are shown
    if (currentStep < questionsData.data.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (showResults) return; // Prevent navigation when results are shown
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDialogClose = (open) => {
    if (!open) {
      setIsListenMode(false);
      setAudioUrl(null);
      setIsAudioLoading(false);
      setQuestionsData(null);
      setShowResults(false);
      setIsReadModalOpen(false);
    }
  };

  const handleSubmit = async () => {
    const feedbackArray = Object.entries(userAnswers).map(([key, value]) => ({
      q_id: Number(key),
      feedback: value.toLowerCase(),
    }));

    const payload = {
      reviewer_id: user?.user_id,
      lib_id: selectedItem?.user_lib_id,
      reviewer_type: user?.user_type === "manager" ? "manager" : "user",
      feedback: feedbackArray,
    };

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/mb-user-single-assessment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      toast.success(result?.message);
      setLoading(false);
       setIsListenMode(false);
      setAudioUrl(null);
      setIsAudioLoading(false);
      setQuestionsData(null);
      setShowResults(false);
      setIsReadModalOpen(false);
      setSelectedItem(null)
    } catch (error) {
      setLoading(false);
      console.error("Error submitting feedback:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleListen = async () => {
    setIsListenMode(true);
    setIsReadModalOpen(true);
    setAudioUrl(null);
    setIsAudioLoading(true);

    const text = selectedItem.updated_content;
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
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error("Error fetching audio:", error);
      toast.error("Failed to load audio. Please try again.");
    } finally {
      setIsAudioLoading(false);
    }
  };

  const title = data?.data[0]?.main_category_name;

  useEffect(() => {
    if (title) {
      document.title = `Concise-5 | ${title}`;
    }
  }, [title]);

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center h-screen">
          <ClipLoader color="black" size={40} />
        </div>
      )}
      {!isLoading && data && (
        <>
          <div className="text-center py-2 space-y-8">
            <Button
              onClick={() => router.back()}
              className={"bg-blue-600 hover:bg-blue-800 cursor-pointer"}
            >
              <ChevronLeft className="bg-white text-blue-500 rounded-full" />{" "}
              Back to Main Categories
            </Button>
            <h1>From This Week's Menu</h1>
            <span>YOU HAVE SELECTED THE FOLLOWING CATEGORY:</span>
            <p className="text-blue-600 text-4xl">
              {data?.data[0]?.main_category_name || "No Name Found"}
            </p>
          </div>
          {selectedItem && (
            <h2 className="text-center text-green-600 capitalize text-xl font-semibold mb-4">
              you have chosen
            </h2>
          )}
          <div className="max-w-3xl mx-auto p-5 flex items-center justify-center w-full">
            {!selectedItem ? (
              data?.data.length > 0 ? (
                <Accordion
                  type="single"
                  collapsible
                  defaultValue="item-1"
                  className="w-full border p-2 border-blue-500 rounded-md"
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      Choose any 5-minute tutorial
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 py-1 transition-opacity duration-300 ease-in-out">
                        {data?.data.map((item, index) => (
                          <div
                            onClick={() => handleItemClick(item)}
                            key={index}
                            className="cursor-pointer hover:bg-blue-100 rounded-md border-b py-2"
                          >
                            <li className="flex flex-col px-1 items-start space-y-2">
                              <h6 className="text-blue-600 font-bold">
                                {item.title_name}
                              </h6>
                              <p>
                                <span className="underline uppercase">
                                  skill taught:
                                </span>{" "}
                                {item.skills_taught}
                              </p>
                            </li>
                            <div className="flex items-end justify-end">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Playlist Clicked");
                                }}
                                className="bg-transparent text-black hover:bg-gray-300"
                              >
                                Add to playlists
                                <Bookmark />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <div className="w-full border p-4 border-blue-500 rounded-md text-center">
                  <p className="text-lg">
                    {allReadMessage || "No tutorials available at this time."}
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col space-y-3">
                <div className="w-full border p-2 border-blue-500 rounded-md transition-all duration-300 ease-in-out">
                  <div className="space-y-2 py-1">
                    <div className="rounded-md py-2">
                      <div className="flex">
                        <div className="flex flex-col px-1 items-start space-y-2">
                          <h6 className="text-blue-600 font-bold">
                            {selectedItem.title_name}
                          </h6>
                          <p>
                            <span className="underline uppercase">
                              skill taught:
                            </span>{" "}
                            {selectedItem.skills_taught}
                          </p>
                        </div>
                        <div>
                          <ChevronDown
                            onClick={() => setSelectedItem(null)}
                            className="border rounded-full cursor-pointer border-blue-500 text-blue-500"
                          />
                        </div>
                      </div>
                      <div className="flex items-end justify-end">
                        <Button className="bg-transparent text-black hover:bg-gray-300 flex items-center space-x-2">
                          <Bookmark className="shrink-0" />
                          <span className="flex-1 text-center">
                            Add to playlist
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleReadClick}
                  className="bg-transparent hover:bg-blue-50 cursor-pointer text-black border-blue-500 border-2 flex items-center space-x-2 px-4 py-5"
                >
                  <FileText className="shrink-0" />
                  <span className="flex-1 text-center">Select Read</span>
                </Button>

                <span className="text-center">OR</span>

                <Button
                  onClick={handleListen}
                  className="bg-transparent hover:bg-blue-50 cursor-pointer text-black border-blue-500 border-2 flex items-center space-x-2 px-4 py-5"
                >
                  <Headset className="shrink-0" />
                  <span className="flex-1 text-center">Select Listen</span>
                </Button>

                {/* Read Modal */}
                <Dialog open={isReadModalOpen} onOpenChange={handleDialogClose}>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-center text-xl">
                        {selectedItem.title_name}
                      </DialogTitle>
                      <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </DialogClose>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="mb-4">
                        <p className="text-center text-lg mb-2">
                          <span className="underline">Skills Taught:</span>{" "}
                          {selectedItem.skills_taught}
                        </p>
                      </div>

                      <div className="mb-4">
                        <div className="flex sm:flex-row flex-col py-2 items-center justify-between">
                          <h3 className="font-semibold text-lg">
                            {selectedItem.main_category_name}
                          </h3>
                          <p className="capitalize text-blue-400">
                            5-minute update/tutorial
                          </p>
                        </div>

                        {!questionsData ? (
                          <div className="prose max-w-none">
                            <div className="flex flex-col space-y-5">
                              <span>
                                This concise 5 tutorial will take 5 minutes of
                                your time with the focus of giving new
                                information you may have not known before, let's
                                begin
                              </span>

                              {!isListenMode &&
                                selectedItem.updated_content && (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: selectedItem.updated_content,
                                    }}
                                  />
                                )}

                              {isListenMode && (
                                <div className="flex flex-col items-center space-y-4">
                                  {isAudioLoading ? (
                                    <ClipLoader color="blue" size={40} />
                                  ) : (
                                    audioUrl && (
                                      <audio
                                        controls
                                        autoPlay
                                        className="w-full"
                                      >
                                        <source
                                          src={audioUrl}
                                          type="audio/mp3"
                                        />
                                        Your browser does not support the audio
                                        element.
                                      </audio>
                                    )
                                  )}
                                </div>
                              )}

                              <Button
                                onClick={getQuestionare}
                                className="capitalize cursor-pointer bg-blue-600 hover:bg-blue-800"
                                disabled={isQuestionsLoading || isAudioLoading}
                              >
                                {isQuestionsLoading ? (
                                  <ClipLoader color="white" size={20} />
                                ) : (
                                  "Finished"
                                )}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-6 space-y-6">
                            <h3 className="text-xl font-semibold text-center mb-4">
                              Question {currentStep + 1} of{" "}
                              {questionsData?.data?.questions?.length}
                            </h3>
                            {currentStep <
                              questionsData?.data?.questions?.length && (
                              <div className="space-y-4">
                                <p className="text-lg font-medium">
                                  {
                                    questionsData?.data?.questions[currentStep]
                                      .question
                                  }
                                </p>
                                <RadioGroup
                                  key={
                                    questionsData?.data?.questions[currentStep]
                                      .id
                                  }
                                  value={
                                    userAnswers[
                                      questionsData?.data?.questions[
                                        currentStep
                                      ].id
                                    ] || ""
                                  }
                                  onValueChange={(value) =>
                                    handleAnswerChange(
                                      questionsData?.data?.questions[
                                        currentStep
                                      ].id,
                                      value
                                    )
                                  }
                                  disabled={showResults} // Disable radio group when results are shown
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="Yes"
                                      id={`r1-${questionsData?.data?.questions[currentStep].id}`}
                                      disabled={showResults}
                                    />
                                    <Label
                                      htmlFor={`r1-${questionsData?.data?.questions[currentStep].id}`}
                                    >
                                      Yes
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="No"
                                      id={`r2-${questionsData?.data?.questions[currentStep].id}`}
                                      disabled={showResults}
                                    />
                                    <Label
                                      htmlFor={`r2-${questionsData?.data?.questions[currentStep].id}`}
                                    >
                                      No
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <Button
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentStep === 0 || showResults}  
                              >
                                Previous
                              </Button>
                              <Button
                                className={"bg-blue-600 hover:bg-blue-700"}
                                onClick={handleNext}
                                disabled={showResults} 
                              >
                                {currentStep ===
                                questionsData?.data?.questions?.length - 1
                                  ? "Submit"
                                  : "Next"}
                              </Button>
                            </div>
                          </div>
                        )}
                        {showResults && (
                          <div className="text-center space-y-3">
                            <h3 className="text-2xl font-semibold mb-4">
                              Results
                            </h3>
                            <p className="text-lg">
                              You got {correctAnswers} out of{" "}
                              {questionsData?.data?.questions?.length} questions
                              correct.
                            </p>
                            {correctAnswers >= 2 ? (
                              <>
                                <p className="text-white bg-green-500 rounded-md p-2">
                                  Congratulations Your Quiz is Passed !
                                </p>
                                <Button
                                  className={"bg-blue-600 hover:bg-blue-700"}
                                  onClick={handleSubmit}
                                  disabled={loading}
                                >
                                  {loading ? (
                                    <ClipLoader color="white" size={20} />
                                  ) : (
                                    "Submit Answers"
                                  )}
                                </Button>
                              </>
                            ) : (
                              <div className="space-y-3 flex flex-col items-center justify-center">
                                <p className="text-white bg-red-500 rounded-md p-2">
                                  You Failed to pass
                                </p>
                                <Button
                                  className={"bg-red-500 hover:bg-red-600"}
                                  onClick={() => setIsReadModalOpen(false)}
                                >
                                  Close
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Detail;