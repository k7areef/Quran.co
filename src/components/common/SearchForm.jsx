/**
 * @typedef {Object} SearchFormProps
 * @prop {string} [className='']
 * @prop {string} [placeholder='بحث...']
 * @prop {function} [onChange=() => {}]
 * @prop {string} [type='text']
 * @prop {string} [name='']
 * @prop {string} [id='search_id']
 */

import React from "react";
import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * @param {SearchFormProps} props
 */
function SearchForm({ className, placeholder, onChange, ...props }) {

    const [searchValue, setSearchValue] = React.useState("");

    const handleSubmit = React.useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
        if (onChange) onChange(e);
    };

    const handleReset = () => {
        setSearchValue("");
        if (onChange) {
            onChange({ target: { value: "" } });
        }
    };

    return (
        <form onSubmit={handleSubmit} onReset={handleReset} className={`search-from relative ${className}`}>
            {/* Input */}
            <input
                required
                {...props}
                id={props.id}
                type={props.type}
                value={searchValue}
                placeholder={placeholder}
                onChange={handleInputChange}
                className="peer w-full p-3 ps-10 bg-card border-2 border-border rounded-lg transition-colors duration-200 focus:border-primary placeholder:text-white/50 placeholder:duration-200 placeholder:transition-opacity focus:placeholder:opacity-0"
            />
            {/* Clear Btn */}
            <button
                type="reset"
                title="تنظيف"
                aria-label="Clear"
                className="w-8 h-8 text-sm rounded-full transition duration-200 sm:hover:bg-border/80 bg-border absolute left-3 top-1/2 -translate-y-1/2 scale-80 opacity-0 peer-valid:scale-100 peer-valid:opacity-100"
            >
                <FontAwesomeIcon icon={faXmark} />
                <span className="sr-only">Clear</span>
            </button>
            {/* Label */}
            <label
                htmlFor={props.id}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors duration-200 peer-focus:text-white"
            >
                <FontAwesomeIcon icon={faSearch} />
                <span className="sr-only">Search</span>
            </label>
        </form>
    )
}

export default SearchForm;