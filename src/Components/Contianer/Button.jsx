import React from 'react'

function Button({
    children,
    type = 'button',
    bgColor = 'bg-orange-500',
    textColor = 'text-white',
    className = '',
    disabled = false,
    ...props
}) {
    return (
        <button
            type={type}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 
            ${bgColor} ${textColor} 
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105'} 
            ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button