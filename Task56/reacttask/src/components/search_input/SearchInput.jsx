import React from 'react';
import {useState} from "react";

const SearchInput = ({placeholder, mode, onSearch}) => {
    const [value, setValue] = useState('')

    function inputBehaviour(value){
        setValue(value)
        console.log(mode)
        switch (mode) {
            case 1:
                console.log(value)
                onSearch(value);
                break;
            case 2:
                console.log('Bbbbbbbbbbbbbbbbb')
                setTimeout(onSearch.bind(null, value), 1000);
                break;
            default:
                break;
        }
    }

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
                onChange={event => inputBehaviour(event.target.value)}
                onKeyDown={handleKeyDown}
            />
        </section>
    );
};

export default SearchInput;