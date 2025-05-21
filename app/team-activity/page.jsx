"use client";
import { Card } from "@/components/ui/card";
import { useState, useMemo } from "react";
import { Calendar, ArrowUpDown, Search, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import postFetcher from "@/lib/postfetcher";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const TeamActivity = () => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useSWR(
    user
      ? [
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/get-user-by-manager-id`,
        { id: user?.user_id },
          user.Token
          
        ]
      : null,
    postFetcher
  );
  
const filteredData = useMemo(() => {
  if (!data?.data) return [];

  let result = data.data.filter((member) =>
    searchQuery
      ? `${member.first_name} ${member.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true
  );

  if (timeFilter !== "all") {
    const cutoffDate = new Date();
    cutoffDate.setDate(
      cutoffDate.getDate() -
        { "5days": 5, "15days": 15, "30days": 30 }[timeFilter]
    );
    result = result.filter(
      (member) => new Date(member.user_created_date) >= cutoffDate
    );
  }

  return result.sort((a, b) =>
    sortFilter === "name"
      ? a.first_name.localeCompare(b.first_name)
      : (Number.parseFloat(b.percentage_yes) || 0) -
        (Number.parseFloat(a.percentage_yes) || 0)
  );
}, [data, searchQuery, timeFilter, sortFilter]);

  const { totalTutorials, avgPercentage } = useMemo(
    () => ({
      totalTutorials: filteredData.reduce(
        (sum, member) => sum + (member.tutorials_count || 0),
        0
      ),
      avgPercentage: filteredData.length
        ? (
            filteredData.reduce(
              (sum, member) =>
                sum + (Number.parseFloat(member.percentage_yes) || 0),
              0
            ) / filteredData.length
          ).toFixed(1)
        : "0.0",
    }),
    [filteredData]
  );

  const handleClick = (params) => {
    console.log("🚀 ~ handleClick ~ params:", params)
    router.push(`/team-activity/${params.id}?fname=${params.first_name}`)
    // console.log("🚀 ~ handleClick ~ params:", params)
    // console.log("🚀 ~ handleClick ~ params:", params.id);
  };

  return (
    <>
      <title>Concise-5 | Team Activity</title>
      <section className="flex flex-col items-center p-5 space-y-5">
        <div className="rounded-md bg-blue-700 px-3 py-1.5 text-white">
          Your Team Activity
        </div>

        <div className="mb-10 grid w-full grid-cols-2 gap-4">
          <Card className="flex flex-col items-center justify-center gap-3 p-5 text-center">
            <p className="text-sm font-medium text-blue-500">
              Total Tutorials Taken
            </p>
            <p className="text-4xl font-bold text-blue-500">{totalTutorials}</p>
          </Card>
          <Card className="flex flex-col items-center justify-center gap-3 p-5 text-center">
            <p className="text-sm font-medium text-blue-500">
              Average Valuable Tutorials
            </p>
            <p className="text-4xl font-bold text-blue-500">{avgPercentage}%</p>
          </Card>
        </div>

        <div className="w-full space-y-4">
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by first name..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-2">
                    <Calendar className="h-4 w-4" /> Time Period
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup
                    value={timeFilter}
                    onValueChange={setTimeFilter}
                  >
                    {["all", "5days", "15days", "30days"].map((value) => (
                      <DropdownMenuRadioItem key={value} value={value}>
                        {value === "all"
                          ? "All"
                          : `Last ${value.replace("days", "")} days`}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-2">
                    <ArrowUpDown className="h-4 w-4" /> Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup
                    value={sortFilter}
                    onValueChange={setSortFilter}
                  >
                    <DropdownMenuRadioItem value="name">
                      First Name
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="rating">
                      Rating
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="w-full space-y-3">
            {isLoading ? (
              <div className="rounded-lg border p-4 text-center">
                Loading...
              </div>
            ) : filteredData.length ? (
              filteredData.map((member) => (
                <div
                  onClick={() => handleClick(member)}
                  key={member.id}
                  className="relative cursor-pointer rounded-lg border border-l-8 border-l-blue-600 bg-white p-4 shadow-sm"
                >
                  <ArrowUpRight className="absolute right-3 top-2 rounded bg-blue-600 text-white" />
                  <h2 className="text-lg font-semibold">{`${member.first_name} ${member.last_name}`}</h2>
                  <h3 className="text-lg font-bold text-blue-600">
                    {member.email}
                  </h3>
                  <div className="mt-3 flex justify-between text-blue-600">
                    <div className="flex flex-col items-center">
                      <h4 className="capitalize">Tutorials Taken</h4>
                      <p>{member.tutorials_count || 0}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <h4 className="capitalize">Valuable Tutorials</h4>
                      <p>{member.percentage_yes || "0.0"}%</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border p-4 text-center">
                No team members found.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default TeamActivity;
