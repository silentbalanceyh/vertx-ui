import React from 'react';

export default (reference) => () => {
    const {$inited} = reference.state;
    console.info($inited);
    return (
        <div>
            Designer
        </div>
    )
}