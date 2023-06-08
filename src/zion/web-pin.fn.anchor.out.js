import {Button} from "antd";
import React from "react";
import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;

const anchorColumn = (field, onClick) => {
    return (
        <div className={"ux_hidden"}>
            <Button id={`${Cv.K_UI.BTN_CLEAR_PREFIX}${field}`} onClick={onClick}/>
        </div>
    );
};
const anchorSearch = (reference) => (
    <div className={"ux_hidden"} key={`${Cv.K_UI.BTN_CLEAR_SEARCH}_container`}>
        <Button id={Cv.K_UI.BTN_CLEAR_SEARCH} onClick={event => {
            __Zn.prevent(event);
            __Zn.of(reference).in({
                searchText: ""
            }).done()
            // reference.?etState({searchText: ""});
            // const ref = __Zn.onReference(reference, 1);
            // if (ref) {
            //     ref.?etState({
            //         $condition: {},
            //         $filters: {}
            //     });
            //     const {$terms = {}} = ref.state;
            //     __ACTIVE.activeColumn($terms);
            // }
        }}/>
    </div>
);
const anchorTree = (reference) => (
    <div className={"ux_hidden"}>
        <Button id={Cv.K_UI.BTN_TREE_OFF} onClick={(event) => {
            __Zn.prevent(event);
            __Zn.of(reference).in({disabled: true}).done();
            // reference.?etState({$disabled: true});
        }}/>
        <Button id={Cv.K_UI.BTN_TREE_ON} onClick={(event) => {
            __Zn.prevent(event);
            __Zn.of(reference).in({disabled: false}).done();
            // reference.?etState({$disabled: false});
        }}/>
    </div>
);
export default {
    anchorColumn,
    anchorTree,
    anchorSearch,
}