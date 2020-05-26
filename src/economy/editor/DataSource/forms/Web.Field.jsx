import React from "react";
import Ux from 'ux';
import RestfulApi from '../../RestfulApi/UI';

import ReactJson from 'react-json-view';
import {Button, Popover} from 'antd';

export default {
    source: (reference, jsx) => {
        const {rxSource} = reference.props;
        return (
            <RestfulApi rxSource={rxSource} rxSubmit={(value) => {
                console.info(value);
            }}/>
        )
    },
    typesJson: (reference, jsx) => {
        const values = Ux.formHit(reference, "types");
        const view = {
            magic: {
                $body: values ? values : []
            }
        }
        return (
            <div style={{
                paddingLeft: 20
            }}>
                <Popover trigger={"click"} content={
                    <ReactJson src={view} name={null} enableClipboard={false}
                               theme={'monokai'}/>
                } placement={"bottom"} overlayClassName={"web-data-types"}>
                    <Button icon={"code"} type={"primary"} shape={"circle"}
                            disabled={!values || 0 === values.length}/>
                </Popover>
            </div>
        )
    }
}