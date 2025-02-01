import React from "react";

const Indicator = ({ status }) => {
  const steps = [
    { name: "Ordered", key: "notprocessed" },
    { name: "Processing", key: "processing" },
    { name: "Dispatch", key: "dispatch" },
    { name: "Delivered", key: "delivered" },
  ];

  const getStepStatus = (key) => {
    const statuses = ["notprocessed", "processing", "dispatch", "delivered"];
    const currentIndex = statuses.indexOf(status);
    const stepIndex = statuses.indexOf(key);
    return stepIndex <= currentIndex
      ? "bg-[#15892e] text-white"
      : "bg-gray-300 text-gray-500";
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Step Labels */}
      <div className="flex justify-between w-full max-w-xl">
        {steps.map((step) => (
          <div
            key={step.key}
            className={`text-center text-sm  px-2 font-medium ${
              status === step.key ? "text-[#15892e]" : "text-gray-500"
            }`}
          >
            {step.name}
          </div>
        ))}
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center w-full max-w-xl">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center w-full">
            {/* Circle Indicator */}
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${getStepStatus(
                step.key
              )}`}
            >
              {index + 1}
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-grow h-1 ${
                  index < steps.findIndex((s) => s.key === status)
                    ? "bg-[#15892e]"
                    : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Indicator;
