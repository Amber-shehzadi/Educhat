import React, { ReactNode } from "react";

const GridBackground = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen h-auto w-full bg-[#f0f2f5]   bg-dot-black/[0.2]  relative">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-[#f0f2f5]  [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      {children}
    </div>
  );
};

export default GridBackground;
