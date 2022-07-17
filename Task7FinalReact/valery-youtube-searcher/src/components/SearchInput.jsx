import React from 'react';
import {useState} from "react";

const SearchInput = ({placeholder, mode, onSearch}) => {
    const [value, setValue] = useState('Supreme proffesional')

    function handleKeyDown(event){
        setValue(event.target.value)
        if (event.key === 'Enter'){
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
                onChange={event => setValue(event.target.value)}
                onKeyDown={handleKeyDown}
            />
        </section>
    );
};

export default SearchInput;