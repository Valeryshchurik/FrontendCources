import React from 'react';
import {useState} from "react";

const SearchInput = ({placeholder, mode, onSearch}) => {
    const [value, setValue] = useState('')

    function handleKeyDown(event){
        setValue(event.target.value)
        if ((event.key === 'Enter') && (mode===3)) {
            console.log('Ccccccccccccccc')
            onSearch(value);
        }
    }

    return (
        <section>
            <h2>Search</h2>
            <input
                placeholder = {placeholder}
                value={value}
                type="search"
                onKeyDown={handleKeyDown}
            />
        </section>
    );
};

export default SearchInput;