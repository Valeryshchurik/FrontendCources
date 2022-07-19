import React from 'react';
import cl from './Loader.module.css';

const Loader = () => {
    return (
        <div>
            <div className={cl.loader}>
            </div>
            <div className={cl.written}>
                Loading...
            </div>
        </div>
    );
};

export default Loader;
