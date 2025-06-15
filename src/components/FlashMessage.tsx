import React from "react";

interface Props {
    text: string,
    className?: string,
}

const FlashMessage: React.FC<Props> = ({ text, className }) => {
    return (
        <div
            className={`bg-orange-500 text-md py-3 px-10 rounded shadow-sm
                  fixed top-18 left-1/2 transform -translate-x-1/2 z-50
                  max-w-md sm:max-w-lg whitespace-nowrap
                  ${className || ""}`}
        >
            {text}
        </div>
    )
};

export default FlashMessage
