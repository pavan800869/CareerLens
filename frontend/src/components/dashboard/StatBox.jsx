const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  return (
    <div className="w-full p-4">
      <div className="flex justify-between">
        <div>
          {icon}
          <h3 className="text-xl font-bold text-foreground mt-2">{title}</h3>
        </div>
        <div className="text-right">
          <span className="badge-green text-[10px] px-2 py-0.5 rounded-full">{increase}</span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {progress !== undefined && (
        <div className="w-full h-1 bg-accent rounded-full mt-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full" style={{ width: `${progress * 100}%` }}></div>
        </div>
      )}
    </div>
  );
};

export default StatBox;
