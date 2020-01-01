import {Button} from "antd";
import React from "react";
import Abs from '../../abyss';
import Ut from "../../unity";
import Dt from '../datum';

const anchorColumn = (field, onClick) => {
    return (
        <div className={"ux-hidden"}>
            <Button id={`__BTN_CLEAR_${field}`} onClick={onClick}/>
        </div>
    );
};
const anchorSearch = (reference) => (
    <div className={"ux-hidden"}>
        <Button id={"__BTN_CLEAR_SEARCH"} onClick={event => {
            Abs.prevent(event);
            reference.setState({searchText: ""});
            const ref = Dt.onReference(reference, 1);
            if (ref) {
                ref.setState({
                    $condition: {},
                    $filters: {}
                });
                const {$terms = {}} = ref.state;
                activeColumn($terms);
            }
        }}/>
    </div>
);
const anchorTree = (reference) => (
    <div className={"ux-hidden"}>
        <Button id={"__BTN_TREE_OFF"} onClick={(event) => {
            Abs.prevent(event);
            reference.setState({$disabled: true});
        }}/>
        <Button id={"__BTN_TREE_ON"} onClick={(event) => {
            Abs.prevent(event);
            reference.setState({$disabled: false});
        }}/>
    </div>
);
const activeColumn = ($terms = {}) => {
    Object.keys($terms)
        /* 列筛选必须调用 */
        .map(id => `__BTN_CLEAR_${id}`)
        .forEach(id => Ut.connectId(id))
};
const activeSearch = () => Ut.connectId("__BTN_CLEAR_SEARCH");
const activeTreeOn = () => Ut.connectId("__BTN_TREE_ON");
const activeTreeOff = () => Ut.connectId("__BTN_TREE_OFF");
export default {
    anchorTree,
    activeTreeOff,
    activeTreeOn,

    anchorColumn,
    activeColumn,
    anchorSearch,
    activeSearch,
}