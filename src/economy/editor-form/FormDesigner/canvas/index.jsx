import React from 'react';
import GridEditor from './UI.Grid';
import '../Cab.less';
import Ux from 'ux';
import {Dsl} from 'entity';

const mountSource = (attrs = {}, form = {}) => {
    if (form.assist) {
        const source = [];
        Object.keys(form.assist).forEach(each => {
            if ("tabular" === each || "category" === each) {
                const {magic = {}} = form.assist[each];
                const {$body = []} = magic;
                $body.forEach(type => {
                    const item = {};
                    item.key = type;
                    item.value = type;
                    if ("tabular" === each) {
                        item.type = "TABULAR"
                    } else {
                        item.type = "CATEGORY"
                    }
                    item.name = type;
                    source.push(item);
                })
            } else {
                const item = {};
                item.key = each;
                item.value = each;
                item.name = each;
                item.type = "ASSIST";
                source.push(item);
            }
        });
        attrs.$a_model_sources = Dsl.getArray(source);
    }
}
const mountForm = (form = {}) => {
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
}
export default (reference) => {
    const {raft = {}} = reference.state;
    const form = Ux.clone(raft.form)
    mountForm(form, reference);

    const attrs = Ux.onUniform(reference.state);
    attrs.data = form;
    mountSource(attrs, form);
    // rxSource
    const {rxApi} = reference.props;
    attrs.rxApi = rxApi;
    console.error(raft);
    return (
        <div className={"canvas"}>
            <GridEditor {...attrs} reference={reference}/>
        </div>
    )
}