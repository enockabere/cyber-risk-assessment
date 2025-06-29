"use client";

import React, { memo } from "react";
import { riskStyles } from "@/app/constants/riskStyles";
import { Question } from "@/app/types";
import { calculateRiskRating } from "@/app/lib/utils/utils";

interface QuestionCardProps {
  question: Question;
  index: number;
}

const QuestionCard = memo(({ question, index }: QuestionCardProps) => {
  const {
    probability,
    impact,
    controlDescription,
    text: selectedText,
  } = question.selectedOption;
  const rating = calculateRiskRating(probability, impact);
  const style = riskStyles[rating] ?? riskStyles["Not Rated"];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200 hover:border-gray-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
              {index + 1}
            </span>
            <h3 className="font-medium text-gray-800 text-sm leading-relaxed">
              {question.text}
            </h3>
          </div>
          <p className="text-xs text-gray-600 ml-9">
            <span className="font-medium text-gray-700">Selected:</span>{" "}
            {selectedText ? (
              selectedText
            ) : (
              <span className="italic text-gray-400">N/A</span>
            )}
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${style.bg}`}
        >
          <span>{style.icon}</span>
          {rating}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs ml-9">
        {probability && (
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-gray-500 font-medium">Probability</p>
            <p className="text-gray-800 font-semibold">{probability}</p>
          </div>
        )}
        {impact && (
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-gray-500 font-medium">Impact</p>
            <p className="text-gray-800 font-semibold">{impact}</p>
          </div>
        )}
        {controlDescription && (
          <div className="bg-blue-50 p-2 rounded sm:col-span-2 lg:col-span-1">
            <p className="text-blue-600 font-medium">Control Measure</p>
            <p className="text-blue-800 font-semibold">{controlDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
});

QuestionCard.displayName = "QuestionCard";
export default QuestionCard;
