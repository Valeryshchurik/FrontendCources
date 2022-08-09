import React from 'react';
import cl from 'components/UI/Loader/Loader.module.css';

function Loader() {
    return (
        <div>
            <div className={cl.loader} />
            <div className={cl.written}>
                Loading...
            </div>
        </div>
    );
}

export default Loader;
