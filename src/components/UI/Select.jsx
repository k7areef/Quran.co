/**
 * @typedef {Object} SelectProps
 * @property {object[]} options
 * @property {object} current
 * @property {Function} setCurrent
 * @property {string} [className=""]
 */

import React from "react";

/**
 * @param {SelectProps} props
 */
function Select({ current, setCurrent, options, className }) {

    const [isOpen, setIsOpen] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutSide = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutSide);

        return () => {
            document.removeEventListener('click', handleClickOutSide);
        };
    }, [ref]);

    const handleChose = React.useCallback((option) => {
        setCurrent(option);
        setIsOpen(false);
    }, [setCurrent]);

    return (
        <div className={`select relative ${className}`} ref={ref}>
            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                className="bg-item py-2 px-4 rounded-md border-2 border-muted/30"
            >
                {current.label}
            </button>
            <div className={`select-options absolute z-20 top-full right-0 w-max min-w-full text-nowrap mt-2 grid transition-all ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className={`options bg-card border border-muted/30 rounded-md overflow-hidden transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}>
                    {
                        options.map((option, index) => (
                            <div
                                key={index}
                                className="option-item"
                            >
                                <button
                                    type="button"
                                    onClick={() => handleChose(option)}
                                    className={`p-2 w-full text-right ${current.key === option.key ? 'bg-primary text-white' : 'sm:hover:bg-primary sm:hover:text-white'}`}
                                >
                                    {option.label}
                                </button>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div >
    )
}

export default Select;