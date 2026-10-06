
interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function SearchBar({value, onChange, placeholder = "Search..." }: SearchBarProps) {
    return(
        <div className="y2k-search-wrap">
            <input
            type = "text"
            className="y2k-search-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}></input>

            {value && (
                <button
                type = "button"
                className="y2k-search-clear"
                onClick={() => onChange("")}>
                    ✖
                </button>
            )}
        </div>
    );
}