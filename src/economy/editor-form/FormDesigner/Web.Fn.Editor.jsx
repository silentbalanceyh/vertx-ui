import React from 'react';

export default (reference) => {
    const {raft = {}} = reference.state;
    console.error(raft.form.assist);
    return (
        <div>
            容器
        </div>
    )
}