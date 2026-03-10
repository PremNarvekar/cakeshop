import React from "react";

const IcingDrip = ({ fill = "#FFFFFF" }: { fill?: string }) => {
    return (
        <div className="w-full h-auto relative z-20">
            <svg
                viewBox="0 0 1440 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-[60px] md:h-[120px] block"
                preserveAspectRatio="none"
            >
                <path
                    d="M0,0 C320,120 420,120 720,60 C1020,0 1120,0 1440,60 L1440,120 L0,120 Z"
                    fill={fill}
                />
            </svg>
        </div>
    );
};

export default IcingDrip;
