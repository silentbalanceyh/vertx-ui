import React from 'react';
import GridEditor from './UI.Grid';
import '../Cab.less';
import Ux from 'ux';
import Op from '../op';
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
const mountPalette = (attrs = {}, palette = []) => {
    if (Ux.isArray(palette)) {
        const {items = []} = palette[0] ? palette[0] : {};
        const $palette = {};
        items.forEach(item => $palette[item.key] = item.text);
        attrs.$palette = $palette;
    }
}
export default (reference) => {
    const {raft = {}, $palette = {}} = reference.state;
    const form = Ux.clone(raft.form);

    const attrs = Ux.onUniform(reference.state);
    attrs.data = form;
    mountSource(attrs, form);
    mountPalette(attrs, $palette);
    // rxSource
    const {rxApi} = reference.props;
    attrs.rxApi = rxApi;

    return (
        <div className={"canvas"}>
            <GridEditor {...attrs} reference={reference}
                        rxModelSave={Op.rxModelSave(reference)}/>
        </div>
    )
}