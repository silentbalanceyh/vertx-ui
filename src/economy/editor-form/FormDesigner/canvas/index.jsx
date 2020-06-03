import React from 'react';
import GridEditor from './UI.Grid';
import '../Cab.less';
import Ux from 'ux';

export default (reference) => {
    const {raft = {}} = reference.state;
    const form = Ux.clone(raft.form)
    {
        // 布局修正处理
        if (!form.hasOwnProperty("window")) {
            form.window = 1;
        }
        if (!form.options) {
            form.options = {};
        }
        form.options.window = form.window;
    }
    return (
        <div className={"canvas"}>
            <GridEditor {...Ux.onUniform(reference.state)} data={form}/>
        </div>
    )
}