import React, { useState } from "react";

export default function NapzPrintStudio() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center p-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-8 shadow-2xl border-4 border-black">
            <h1 className="text-3xl font-black text-white mb-4">
              NETNAPZ PRINT STUDIO
            </h1>
            <p className="text-white/90 mb-6">
              Custom product printing service
            </p>
            <button
              onClick={() => setIsActive(!isActive)}
              className="bg-white text-orange-600 font-bold py-3 px-6 rounded-xl border-2 border-black hover:scale-105 transition-transform"
            >
              {isActive ? "Studio Active" : "Enable Studio"}
            </button>
          </div>
          <p className="text-gray-600 mt-4 text-sm">
            Print studio component - Base protected
          </p>
        </div>
      </div>
    </div>
  );
}