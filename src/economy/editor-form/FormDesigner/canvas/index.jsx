import React from 'react';
import GridEditor from './UI.Grid';
import '../Cab.less';

export default (reference) => {
    const {raft = {}} = reference.state;
    const form = raft.form;
    return (
        <div className={"canvas"}>
            <GridEditor data={form}/>
        </div>
    )
}