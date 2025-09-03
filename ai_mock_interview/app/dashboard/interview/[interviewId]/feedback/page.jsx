"use client";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { ChevronsUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
  

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Unwrap params using React.use() for Next.js 15 compatibility
  const unwrappedParams = React.use(params);
  
  useEffect(() => {
    if (unwrappedParams?.interviewId) {
      GetFeedBack();
    }
  }, [unwrappedParams]);

  const GetFeedBack = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockId, unwrappedParams.interviewId))
        .orderBy(UserAnswer.id);

      setFeedbackList(result);
      
      if (result && result.length > 0) {
        const getTotalOfRating = result.reduce((sum, item) => sum + Number(item.rating || 0), 0);
        setAvgRating(Math.round(getTotalOfRating / result.length));
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      {feedbackList?.length === 0 ? (
        <h2 className="font-bold text-xl text-gray-500">No Interview Feedback Record Found</h2>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-green-500">Congratulations!</h2>
          <h2 className="font-bold text-2xl">Here is your interview feedback</h2>
          <h2 className="text-primary text-lg my-3">
            Your overall interview rating: <strong className={avgRating < 6 ? 'text-red-600' : 'text-green-500'}>
              {avgRating}/10
            </strong>
          </h2>

          <h2 className="text-sm text-gray-600 mb-6">
            Find below interview questions with correct answers, your answers and
            feedback for improvement
          </h2>

          {feedbackList && feedbackList.map((item, index) => (
            <Collapsible key={index} className="mt-7">
              <CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 text-left flex items-center justify-between gap-7 w-full hover:bg-secondary/80 transition-colors">
                {item.question} 
                <ChevronsUpDownIcon className="h-5 w-5"/>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-2 p-4">
                  <h2 className="text-red-600 p-2 rounded-lg bg-red-50">
                    <strong>Rating:</strong> {item.rating}/10
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                    <strong>Your Answer: </strong> {item.userAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                    <strong>Correct Answer: </strong> {item.correctAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary">
                    <strong>Feedback: </strong> {item.feedback}
                  </h2>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>
      )}
      
      <Button onClick={() => router.replace('/dashboard')} className="mt-6">
        Go Home
      </Button>
    </div>
  );
}

export default Feedback;
