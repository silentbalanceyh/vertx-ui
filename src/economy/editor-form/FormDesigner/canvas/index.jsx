import React from 'react';
import GridEditor from './UI.Grid';
import '../Cab.less';
import Ux from 'ux';

export default (reference) => {
    const {raft = {}} = reference.state;
    const form = Ux.clone(raft.form)
    if (!form.hasOwnProperty("window")) {
        form.window = 1;
    }
    if (!form.options) {
        form.options = {};
    }
    form.options.window = form.window;
    return (
        <div className={"canvas"}>
            <GridEditor data={form}/>
        </div>
    )
}