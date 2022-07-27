import React from 'react';
import cl from 'components/UI/Loader/Loader.module.css';

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
