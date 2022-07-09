import React from 'react';

const SearchInput = ({strings, value, placeholder, mode, onSearchHandler}) => {
    const [searchField, setSearchField] = useState("");
    const [searchShow, setSearchShow] = useState(false);

    const filteredStrings = strings.filter(
        string => {
            return (
                string.toLowerCase().includes(searchField.toLowerCase())
            );
        }
    );

    const handleChange = e => {
        setSearchField(e.target.value);
        if(e.target.value===""){
            setSearchShow(false);
        }
        else {
            setSearchShow(true);
        }
    };

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

    function searchList() {
        if (searchShow) {
            return () => {filteredStrings.map((string) =>  <li>{string}</li>);}
        }
    }

    return (
        <section className="garamond">
            <h2 className="f2">Search</h2>
            <input
                type = "search"
                onChange = {inputBehaviour}
            />
            <ul>{searchList()}</ul>
        </section>
    );
};

export default SearchInput;