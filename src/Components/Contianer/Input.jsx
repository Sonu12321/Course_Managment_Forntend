import React from "react";

function InputBox({
    children,
    type = "text",
    className = "",
    ...props
}) {
    return (
        <input
            type={type}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${className}`}
            {...props}
        >
            {children}
        </input>
    );
}

export default InputBox;