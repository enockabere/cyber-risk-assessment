import React from "react";
import { useSession } from "next-auth/react";
import { riskStyles } from "@/app/constants/riskStyles";

interface HeaderProps {
  averageRating: string | null;
}

const Header = ({ averageRating }: HeaderProps) => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Cyber Security Risk Assessment Results
        </h1>
        <p className="text-gray-600 mt-2">
          Comprehensive overview of your risk profile and mitigation strategies
          for <strong>{session?.user?.name || "your institution"}</strong>,
          located in Nairobi County, Kenya.
        </p>
      </div>
      {averageRating && (
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md">
          <div className="text-right">
            <p className="text-sm text-gray-500 font-medium">
              Overall Risk Rating
            </p>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold mt-1 ${riskStyles[averageRating].bg}`}
            >
              <span className="text-xl">{riskStyles[averageRating].icon}</span>
              {averageRating}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
