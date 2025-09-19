import React from "react";

type LoaderType = "ring" | "dual-ring" | "dots";

interface LoaderProps {
  type?: LoaderType;
  size?: number; // px
  color?: string; // tailwind color or hex
  speed?: number; // seconds
}

const Loader: React.FC<LoaderProps> = ({
  type = "ring",
  size = 48,
  color = "#2563eb",
  speed = 1,
}) => {
  const commonStyle: React.CSSProperties = {
    "--loader-size": `${size}px`,
    "--loader-color": color,
    "--loader-speed": `${speed}s`,
  } as React.CSSProperties;

  if (type === "ring") {
    return (
      <div
        role="status"
        aria-label="Loading"
        style={commonStyle}
        className="inline-block border-[calc(var(--loader-size)/8)] border-gray-200 border-t-[calc(var(--loader-size)/8)] rounded-full animate-spin"
      ></div>
    );
  }

  if (type === "dual-ring") {
    return (
      <div
        role="status"
        aria-label="Loading"
        style={commonStyle}
        className="relative inline-block"
      >
        <span
          className="absolute inset-0 rounded-full border-[calc(var(--loader-size)/10)] border-transparent border-t-[calc(var(--loader-size)/10)]"
          style={{
            borderTopColor: color,
            animation: `spin var(--loader-speed) linear infinite`,
          }}
        ></span>
        <span
          className="absolute inset-0 rounded-full border-[calc(var(--loader-size)/14)] border-transparent border-b-[calc(var(--loader-size)/14)] scale-70"
          style={{
            borderBottomColor: `${color}99`,
            animation: `spin calc(var(--loader-speed)*1.3) linear infinite`,
          }}
        ></span>
      </div>
    );
  }

  if (type === "dots") {
    return (
      <div
        role="status"
        aria-label="Loading"
        style={commonStyle}
        className="flex gap-[calc(var(--loader-size)/4.8)] items-center mt-10"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="rounded-full"
            style={{
              width: size / 5,
              height: size / 5,
              background: color,
              animation: `bounce var(--loader-speed) ease-in-out infinite`,
              animationDelay: `${(i * speed) / 3}s`,
            }}
          ></span>
        ))}
      </div>
    );
  }

  return null;
};

export default Loader;
