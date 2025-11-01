import React from 'react';
import Navbar from './shared/Navbar';

const AiInterview = () => {
  return (
    <div>

      <div className="max-w-9xl mx-20 mt-5" style={{ overflow: "hidden" }}>
        <iframe
          src={"http://localhost:3000/dashboard"}
          width="100%"
          height="100%"
          style={{
            height: "80vh",
            overflow: "hidden",
          }}
          allow="camera; microphone; autoplay; encrypted-media"
        />
      </div>
    </div>
  );
};

export default AiInterview;
