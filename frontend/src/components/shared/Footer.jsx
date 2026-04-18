import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-surface py-12 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold text-foreground mb-2">Career<span className="gradient-text-purple">Lens</span></h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Your gateway to top internships and dream careers. Find, apply, and grow with AI-powered tools.</p>
          </div>

          {/* For Students */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">For Students</h3>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="text-sm text-muted-foreground hover:text-neon-purple transition-colors">Browse Jobs</Link></li>
              <li><Link to="/ai-mock-interview" className="text-sm text-muted-foreground hover:text-neon-purple transition-colors">AI Mock Interview</Link></li>
              <li><Link to="/profile" className="text-sm text-muted-foreground hover:text-neon-purple transition-colors">My Profile</Link></li>
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">For Recruiters</h3>
            <ul className="space-y-2">
              <li><Link to="/admin/companies" className="text-sm text-muted-foreground hover:text-neon-purple transition-colors">Companies</Link></li>
              <li><Link to="/admin/jobs" className="text-sm text-muted-foreground hover:text-neon-purple transition-colors">Post Jobs</Link></li>
              <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-neon-purple transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Connect</h3>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground hover:text-neon-purple hover:border-neon-purple/30 transition-all" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.676 0H1.324C.593 0 0 .592 0 1.324v21.352C0 23.408.593 24 1.324 24H12.82V14.706H9.692v-3.578h3.128V8.408c0-3.1 1.893-4.787 4.657-4.787 1.325 0 2.463.1 2.794.144v3.238l-1.918.001c-1.503 0-1.794.715-1.794 1.762v2.31h3.587l-.468 3.578h-3.119V24h6.116C23.407 24 24 23.408 24 22.676V1.324C24 .592 23.407 0 22.676 0z" /></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground hover:text-neon-purple hover:border-neon-purple/30 transition-all" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.835 9.835 0 01-2.828.775 4.934 4.934 0 002.165-2.724 9.867 9.867 0 01-3.127 1.195 4.924 4.924 0 00-8.38 4.49A13.978 13.978 0 011.67 3.149 4.93 4.93 0 003.16 9.724a4.903 4.903 0 01-2.229-.616v.062a4.93 4.93 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.93 4.93 0 004.6 3.417A9.869 9.869 0 010 21.543a13.978 13.978 0 007.548 2.212c9.057 0 14.01-7.507 14.01-14.01 0-.213-.004-.425-.015-.636A10.012 10.012 0 0024 4.557z" /></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground hover:text-neon-purple hover:border-neon-purple/30 transition-all" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452H16.85v-5.569c0-1.327-.027-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.94v5.666H9.147V9.756h3.448v1.464h.05c.48-.91 1.653-1.871 3.401-1.871 3.634 0 4.307 2.39 4.307 5.498v5.605zM5.337 8.29c-1.105 0-2-.896-2-2 0-1.106.895-2 2-2 1.104 0 2 .895 2 2 0 1.104-.896 2-2 2zM7.119 20.452H3.553V9.756h3.566v10.696zM22.225 0H1.771C.791 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451c.979 0 1.771-.774 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-xs text-slate-500">© 2025 CareerLens. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;