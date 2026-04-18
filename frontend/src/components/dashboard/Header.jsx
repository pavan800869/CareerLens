const Header = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
};

export default Header;
