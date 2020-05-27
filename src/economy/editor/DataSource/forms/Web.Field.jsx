import React from "react";
import Ux from 'ux';

import ReactJson from 'react-json-view';
import {Button, Popover} from 'antd';
import RestfulApi from '../../RestfulApi/UI';
import ParamParser from '../../ParamParser/UI';

export default {
    source: (reference, jsx) => {
        const {rxSource} = reference.props;
        return (
            <RestfulApi rxSource={rxSource} rxSubmit={(value) => {
                if (value) {
                    const formValues = {};
                    formValues.uri = value.uri;
                    formValues.method = value.method;
                    if (value.name) {
                        formValues.comment = value.name;
                    }
                    Ux.formHits(reference, formValues);
                }
            }}/>
        )
    },
    magic: (reference, jsx) => {
        return (
            <ParamParser reference={reference} {...jsx}/>
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