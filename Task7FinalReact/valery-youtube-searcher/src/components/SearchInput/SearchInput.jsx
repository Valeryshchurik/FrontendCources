import cl from 'components/SearchInput/SearchInput.module.css';
import React, { useCallback, useState } from 'react';

function SearchInput({ placeholder, onSearch }) {
    const [value, setValue] = useState('Supreme proffesional');

    const handleKeyDown = useCallback(
        (event) => {
            setValue(event.target.value);
            if (event.key === 'Enter') {
                onSearch(value);
            }
        },
        [onSearch, value],
    );

    return (
        <section>
            <h2>Search</h2>
            <input
                className={cl.search}
                placeholder={placeholder}
                value={value}
                type="search"
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={handleKeyDown}
            />
        </section>
    );
}

export default SearchInput;
