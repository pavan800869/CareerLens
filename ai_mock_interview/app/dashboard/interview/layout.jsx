import React from "react";
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";

function InterviewLayout({ children }) {
  return (
    <div>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <SignIn />
        </div>
      </SignedOut>
    </div>
  );
}

export default InterviewLayout;
