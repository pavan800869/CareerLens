import React from 'react'
import { Briefcase, BookOpen, CalendarCheck, Trophy, Download, TrendingUp, MapPin, BarChart3 } from 'lucide-react';
import { mockTransactions } from "./data/mockData";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import GeographyChart from "./GeographyChart";
const StatCard = ({ icon, title, subtitle, progress, increase }) => (
  <div className="glass-card p-5 card-hover">
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center">
        {icon}
      </div>
      <span className="badge-green text-[10px] px-2 py-0.5 rounded-full">{increase}</span>
    </div>
    <h3 className="text-2xl font-bold text-foreground">{title}</h3>
    <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
    {/* Progress bar */}
    <div className="w-full h-1 bg-accent rounded-full mt-3 overflow-hidden">
      <div className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full transition-all" style={{ width: `${progress * 100}%` }}></div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Welcome to your dashboard</p>
        </div>
        <button className="gradient-btn text-white text-sm font-medium px-5 py-2.5 rounded-lg flex items-center gap-2">
          <Download className="w-4 h-4" /> Download Reports
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Briefcase className="w-5 h-5 text-neon-purple" />}
          title="15,045"
          subtitle="Internships Applied"
          progress={0.75}
          increase="+10%"
        />
        <StatCard
          icon={<BookOpen className="w-5 h-5 text-neon-cyan" />}
          title="80"
          subtitle="Skills Added"
          progress={0.50}
          increase="+30%"
        />
        <StatCard
          icon={<CalendarCheck className="w-5 h-5 text-neon-orange" />}
          title="5"
          subtitle="Interviews Scheduled"
          progress={0.65}
          increase="+15%"
        />
        <StatCard
          icon={<Trophy className="w-5 h-5 text-emerald-400" />}
          title="12"
          subtitle="Offers Received"
          progress={0.80}
          increase="+25%"
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        {/* Chart area */}
        <div className="lg:col-span-8 glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Most Growing Domains</h2>
              <p className="text-xs text-slate-500 mt-0.5">Trending career fields this quarter</p>
            </div>
            <button className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-emerald-400 hover:bg-secondary transition-colors">
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
          {/* Chart placeholder — keeping existing nivo charts if available */}
          <div className="h-64 rounded-lg bg-white/[0.02] border border-border p-2">
            <LineChart />
          </div>
        </div>

        {/* Recent Applications */}
        <div className="lg:col-span-4 glass-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recent Applications</h2>
          </div>
          <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
            {mockTransactions.map((transaction, i) => (
              <div
                key={`${transaction.txId}-${i}`}
                className={`flex items-center justify-between p-3 ${i !== mockTransactions.length - 1 ? 'border-b border-border' : ''} ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground font-medium truncate">{transaction.txId}</p>
                  <p className="text-xs text-slate-500">{transaction.user}</p>
                </div>
                <span className="text-xs text-slate-500 mx-3 flex-shrink-0">{transaction.date}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${
                  transaction.status === "Offer Received" 
                    ? 'badge-green' 
                    : 'badge-yellow'
                }`}>
                  {transaction.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Progress */}
        <div className="glass-card p-6 text-center">
          <h3 className="text-sm font-medium text-foreground mb-4">Application Progress</h3>
          {/* Custom progress circle */}
          <div className="relative w-28 h-28 mx-auto mb-4">
            <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeDasharray="326.7" strokeDashoffset="81.7" strokeLinecap="round" />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-foreground">75%</span>
            </div>
          </div>
          <p className="text-emerald-400 text-sm font-medium">15 Applications Sent</p>
          <p className="text-slate-500 text-xs mt-1">5 Interviews, 2 Offers</p>
        </div>

        {/* Bar chart */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Application Volume</h3>
          <div className="h-52 pt-4">
            <BarChart />
          </div>
        </div>

        {/* Geography chart */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Applicants by Region</h3>
          <div className="h-52 rounded-lg bg-white/[0.02] border border-border overflow-hidden">
            <GeographyChart />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
