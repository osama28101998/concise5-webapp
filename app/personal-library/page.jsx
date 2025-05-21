"use client";
import { ArrowUpRight, Check, FileTextIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import postFetcher from "@/lib/postfetcher";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { getDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { setSelectedTutorial } from "@/lib/redux/slices/tutorialSlice";

const colors = [
  { base: "bg-blue-700", hover: "hover:bg-blue-600", text: "text-white" },
  { base: "bg-fuchsia-700", hover: "hover:bg-fuchsia-600", text: "text-white" },
  { base: "bg-yellow-700", hover: "hover:bg-yellow-600", text: "text-white" },
  { base: "bg-red-700", hover: "hover:bg-red-600", text: "text-white" },
  { base: "bg-green-700", hover: "hover:bg-green-600", text: "text-white" },
];

const PersonalLibrary = () => {
  const [personalLibrary, setPersonalLibrary] = useState([]);
  const [titlesByCategory, setTitlesByCategory] = useState({});
  const [loadingCategory, setLoadingCategory] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const requestBody = {
    userId: user?.user_id,
    type: user?.user_type === "manager" ? user.user_type : "user",
  };

  const { data, error, isLoading } = useSWR(
    user
      ? [
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/mb-title-sub-categories-by-tutorial-count-by-user-id`,
        requestBody,
          user.Token
          
        ]
      : null,
    postFetcher
  );

  useEffect(() => {
    if (data?.data) {
      setPersonalLibrary(data.data);
    }
  }, [data]);

  // Handle click on accordion to load tutorial titles
  const handleAccordionClick = async (sub_category_id) => {
    if (titlesByCategory[sub_category_id]) return; // Don't re-fetch if already loaded
    setLoadingCategory(sub_category_id);

    const payload = {
      user_id: user.user_id,
      filter: "reviewed",
      type: user.user_type === "manager" ? user.user_type : "user",
      categoryId: sub_category_id,
    };
    console.log("🚀 ~ handleAccordionClick ~ payload:", payload)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/mb-get-titles-for-library-by-pagination-filtered-by-categoryID`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      console.log("🚀 ~ handleAccordionClick ~ res:", res)

      const json = await res.json();
      setTitlesByCategory((prev) => ({
        ...prev,
        [sub_category_id]: json?.data || [],
      }));
    } catch (err) {
      console.error("Fetch error:", err);
      setTitlesByCategory((prev) => ({ ...prev, [sub_category_id]: [] }));
    } finally {
      setLoadingCategory(null);
    }
  };

  const handleClick = (data) => {
    console.log("🚀 ~ handleClick ~ params:", data);
    dispatch(setSelectedTutorial(data));
    router.push(`/personal-library/${data.id}`);
  };

  return (
    <section>
      <title>Concise-5 | Personal Library</title>
      <div className="flex flex-col items-center p-5 space-y-5">
        <div className="bg-blue-700 text-center text-white p-5 rounded-md w-full max-w-2xl">
          {user?.first_name} Personal Library Of Tutorials Taken
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {!isLoading && personalLibrary && (
        <div className="flex items-center p-5 justify-center flex-col gap-4 w-full">
          <Accordion type="single" collapsible className="w-full max-w-2xl">
            {personalLibrary.map((category, index) => {
              const color = colors[index % colors.length];
              return (
                <AccordionItem
                  key={category.sub_category_id}
                  value={`item-${category.sub_category_id}`}
                  className="mb-4 border-none"
                  onClick={() => handleAccordionClick(category.sub_category_id)}
                >
                  <AccordionTrigger
                    className={`${color.base} ${color.hover} ${color.text} px-4 py-3 rounded-md text-xl font-medium [&>svg]:text-white  [&>svg]:stroke-[3]`}
                  >
                    {category.sub_category_name} ({category?.tutorial_count})
                  </AccordionTrigger>
                  <AccordionContent className=" py-3 mt-2  rounded-md">
                    {loadingCategory === category.sub_category_id ? (
                      <p>Loading...</p>
                    ) : titlesByCategory[category.sub_category_id]?.length >
                      0 ? (
                      titlesByCategory[category.sub_category_id].map(
                        (title) => (
                          <div
                            onClick={() => handleClick(title)}
                            key={title.id}
                            className="border relative cursor-pointer space-y-3 rounded-lg border-l-8 border-l-blue-600 p-4 mb-2 bg-white shadow-sm"
                          >
                            <ArrowUpRight className="text-white absolute right-3 top-2 bg-blue-600 rounded" />

                            <h2>Completed on: {getDate(title.reviewed_at)}</h2>
                            <h3 className="text-blue-600 font-bold text-lg">
                              {title.title_name}
                            </h3>
                            {/* <p className="text-gray-700 text-sm mt-1">
                              SME: {title.sme_name}
                            </p> */}
                            <p className="text-gray-600 text-sm mt-1">
                              <span className="underline">Skills Taught:</span>
                              {title.skills_taught}
                            </p>
                            <p className="text-sm text-blue-600">
                              Was this tutorial valuable to you
                            </p>
                            <div className="text-blue-600 justify-between max-w-16 w-full flex items-center">
                              <p className="flex space-y-2 flex-col h-10">
                                Yes
                                {title.satisfied === "yes" && <Check />}
                              </p>
                              <p className="flex flex-col h-10">
                                No
                                {title.satisfied === "no" && <Check />}
                              </p>
                            </div>
                            <Link
                              href="#"
                              className="text-blue-600 text-sm hover:underline flex items-center mt-2"
                            >
                              <FileTextIcon className="h-4 w-4 mr-1" /> View
                              tutorial
                            </Link>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-gray-500 italic">No data found.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
    </section>
  );
};

export default PersonalLibrary;
