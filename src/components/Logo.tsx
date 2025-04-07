
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8 bg-rose-200 rounded-full flex items-center justify-center">
        <span className="text-rose-600 font-bold text-lg">G</span>
      </div>
      <span className="font-semibold text-lg">
        Glam
        <span className="text-rose-600 font-bold">Finance</span>
        <span className="text-xs align-top ml-1">PH</span>
      </span>
    </div>
  );
};

export default Logo;
