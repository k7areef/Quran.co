/**
 * @typedef {Object} HighlightedNameProps
 * @prop {string} name
 * @prop {string} search
 */

/**
 * @param {HighlightedNameProps} props
 */
function HighlightedName({ name, search }) {
    if (!search) return <span>{name}</span>;

    const regex = new RegExp(`(${search})`, 'gi');

    const parts = name.split(regex);

    return (
        <>
            {parts.map((part, index) =>
                regex.test(part) ? (
                    <span key={index} className="text-warning">{part}</span>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </>
    );
}

export default HighlightedName;