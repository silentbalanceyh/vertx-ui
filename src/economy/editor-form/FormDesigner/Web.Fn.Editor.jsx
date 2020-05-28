import React from 'react';

export default (reference) => {
    const {raft = {}} = reference.state;
    if (raft.form) {
        console.info(raft.form.initial);
        console.info(raft.form.assist);
    }
    return (
        <div>
            容器
        </div>
    )
}