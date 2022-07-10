import React from 'react';

const SearchInput = ({placeholder, mode, onSearchHandler}) => {
    function inputBehaviour(){
        switch (mode) {
            case 1:
                onSearchHandler(searchField);
                break;
            case 2:
                setTimeout(onSearchHandler.bind(null, searchField), 300);
                break;
            case 3:
                break;
        }
    }

    return (
        <section className="garamond">
            <h2 className="f2">Search</h2>
            <input
                placeholder = {placeholder}
                value={filter.query}
                type = "search"
                onChange = {inputBehaviour}
            />
            <ul>{searchList()}</ul>
        </section>
    );
};

export default SearchInput;