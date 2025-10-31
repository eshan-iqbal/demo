export function GridBackground() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-background">
      <div
        className="absolute inset-0 bg-transparent h-full w-full"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border) / 0.2) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.2) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background to-transparent"></div>
    </div>
  );
}
