"use client";  // Ensure this is client-side

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSections from "./_compnents/QuestionsSections";
import RecordAnswerSection from "./_compnents/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Import `usePathname` from next/navigation for routing in `app` directory
import { usePathname } from "next/navigation";

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Use the `usePathname` hook to get the current path
  const pathname = usePathname();
  
  // Unwrap params using React.use() for Next.js 15 compatibility
  const unwrappedParams = React.use(params);

  useEffect(() => {
    if (unwrappedParams?.interviewId) {
      GetInterviewDetail();
    }
  }, [unwrappedParams]);

  const GetInterviewDetail = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, unwrappedParams.interviewId));

      if (result && result.length > 0) {
        const jsonMockResp = JSON.parse(result[0]?.jsonMockResp);
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Post message to the parent app after the path is determined
  useEffect(() => {
    if (pathname) {
      window.parent.postMessage(
        {
          action: "navigate",
          url: `http://localhost:3000${pathname}`,
        },
        "*"
      );
    }
  }, [pathname]);

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  // Show error state if no data is available
  if (!mockInterviewQuestion || !interviewData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Interview not found or invalid data</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Questions */}
        <QuestionsSections
          activeQuestionIndex={activeQuestionIndex}
          mockInterViewQuestion={mockInterviewQuestion}
        />
        {/* Video/ Audio Recording */}
        <RecordAnswerSection
          activeQuestionIndex={activeQuestionIndex}
          mockInterViewQuestion={mockInterviewQuestion}
          interviewData={interviewData}
        />
      </div>

      <div className="flex justify-end gap-6 mt-6">
        {activeQuestionIndex > 0 && (
          <Button 
            disabled={activeQuestionIndex === 0} 
            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
          >
            Previous Question
          </Button>
        )}

        {activeQuestionIndex < mockInterviewQuestion.length - 1 && (
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
            Next Question
          </Button>
        )}

        {activeQuestionIndex === mockInterviewQuestion.length - 1 && (
          <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
            <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
