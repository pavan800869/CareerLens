import React, { useState } from 'react';

export default function PopupModal({ trigger, title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="gradient-btn text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          Open
        </button>
      )}

      {open && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">{title || 'Modal'}</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="text-muted-foreground text-sm">
              {children || 'Modal content goes here.'}
            </div>
          </div>
        </div>
      )}
    </>
  );
}