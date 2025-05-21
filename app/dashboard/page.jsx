"use client";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../lib/redux/slices/authSlice";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Menu } from "lucide-react";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { getCountAndRating } from "@/lib/utils";
import postFetcher from "@/lib/postfetcher";

const colors = [
  { base: "bg-blue-700", hover: "hover:bg-blue-600" },
  { base: "bg-fuchsia-700", hover: "hover:bg-fuchsia-600" },
  { base: "bg-yellow-700", hover: "hover:bg-yellow-600" },
  { base: "bg-red-700", hover: "hover:bg-red-600" },
  { base: "bg-green-700", hover: "hover:bg-green-600" },
];

export default function DashboardPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  console.log("🚀 ~ DashboardPage ~ user:", user);
  const [count, setcount] = useState(0);
  const [percentage, setpercentage] = useState(0);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const requestBody = {
    userId: user?.user_id,
    type: user?.user_type === "manager" ? user.user_type : "user",
  };

  const { data, error, isLoading } = useSWR(
    user
      ? [
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/mb-title-sub-categories-by-tutorial-count-by-user-id-cat-filter
`,
          requestBody,
          user.Token,
        ]
      : null,
    postFetcher
  );
  // console.log("🚀 ~ DashboardPage ~ data:", data);
  useEffect(() => {
    if (data) {
      setCategories(data?.data || []);
    }
  }, [data]);

  useEffect(() => {
    const fetchCountAndRating = async () => {
      try {
        const countRating = await getCountAndRating(
          user.user_id,
          user.user_type
        );
        if (countRating) {
          setcount(countRating?.count_reviewed || 0);
          setpercentage(countRating?.percentage || 0);
        }
      } catch (error) {
        console.error("Error fetching count and rating:", error);
      }
    };

    if (user) {
      fetchCountAndRating();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <>
      <title>Concise-5 | Dashboard</title>
      <section className="flex flex-col max-w-7xl mx-auto  p-5">
        {isLoading && (
          <div className="flex items-center justify-center h-screen">
            <ClipLoader color="black" size={40} />
          </div>
        )}

        {!isLoading && categories.length > 0 && (
          <main className="">
            <div className="">
              <h1 className="text-2xl font-bold mb-2">
                Hello {user.first_name}!
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <Card className="px-2 gap-2 text-center flex flex-col items-center justify-center">
                  <p
                    lang="fr"
                    className="text-blue-500 font-medium text-xs sm:text-sm mb-2"
                  >
                    TOTAL TUTORIALS TAKEN BY YOU
                  </p>
                  <p className="text-blue-500 text-3xl sm:text-5xl font-bold">
                    {count}
                  </p>
                </Card>
                <Card className="px-2 gap-2 text-center flex flex-col items-center justify-center">
                  <p className="text-blue-500 font-medium text-xs sm:text-sm mb-2">
                    PERCENTAGE OF TUTORIALS THAT YOU FOUND VALUABLE
                  </p>
                  <p className="text-blue-500 text-3xl sm:text-5xl font-bold">
                    {percentage}%
                  </p>
                </Card>
              </div>
            </div>

            <div className="mb-5">
              <h2 className="text-xl font-bold text-center mb-5">
                CHOOSE ANY CATEGORY OF
                <br />
                5-MINUTE TUTORIALS
              </h2>

              <div className="flex items-center   justify-center flex-col gap-4">
                {categories?.map((category, index) => {
                  const color = colors[index % colors.length];
                  return (
                    <Button
                      key={category.sub_category_id}
                      asChild
                      onClick={() => console.log(category)}
                      className={`max-w-2xl w-full justify-between py-6 text-xl ${color.base} ${color.hover}`}
                    >
                      <Link href={`/dashboard/${category.sub_category_id}`}>
                        {category.sub_category_name}
                        <ArrowRight className="h-10 w-10" />
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          </main>
        )}

        {!isLoading && categories.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center mt-10 text-gray-500">
            <h2 className="text-lg font-semibold">No tutorials found.</h2>
            <p>
              Please check back later or contact your manager for more content.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
