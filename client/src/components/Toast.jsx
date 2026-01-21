import React, { useEffect } from 'react';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, 3000)
        return () => clearTimeout(timer)
    }, [onClose])

    const styles = {
        success: {
            bg: "bg-green-100 dark:bg-green-900",
            border: "border-green-500 dark:border-green-700",
            text: "text-green-900 dark:text-green-100",
            hover: "hover:bg-green-200 dark:hover:bg-green-800",
            iconColor: "text-green-600",
            Icon: FaCheckCircle,
            title: "Success"
        },
        info: {
            bg: "bg-blue-100 dark:bg-blue-900",
            border: "border-blue-500 dark:border-blue-700",
            text: "text-blue-900 dark:text-blue-100",
            hover: "hover:bg-blue-200 dark:hover:bg-blue-800",
            iconColor: "text-blue-600",
            Icon: FaInfoCircle,
            title: "Info"
        },
        warning: {
            bg: "bg-yellow-100 dark:bg-yellow-900",
            border: "border-yellow-500 dark:border-yellow-700",
            text: "text-yellow-900 dark:text-yellow-100",
            hover: "hover:bg-yellow-200 dark:hover:bg-yellow-800",
            iconColor: "text-yellow-600",
            Icon: FaExclamationTriangle,
            title: "Warning"
        },
        error: {
            bg: "bg-red-100 dark:bg-red-900",
            border: "border-red-500 dark:border-red-700",
            text: "text-red-900 dark:text-red-100",
            hover: "hover:bg-red-200 dark:hover:bg-red-800",
            iconColor: "text-red-600",
            Icon: FaTimesCircle,
            title: "Error"
        }
    }

    const style = styles[type] || styles.info;
    const Icon = style.Icon;

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div role="alert" className={`${style.bg} ${style.border} ${style.text} border-l-4 p-4 rounded-lg flex items-center transition duration-300 ease-in-out ${style.hover} transform hover:scale-105 shadow-lg max-w-sm`}>
                <Icon className={`h-5 w-5 flex-shrink-0 mr-2 ${style.iconColor}`} />
                <div>
                    <p className="text-xs font-bold">{style.title}</p>
                    <p className="text-sm font-semibold">{message}</p>
                </div>
                <button onClick={onClose} className="ml-auto pl-2 text-gray-500 hover:text-black dark:text-gray-300 dark:hover:text-white">
                    ×
                </button>
            </div>
        </div>
    )
}

export default Toast
