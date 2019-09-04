import './Cab.less';
import React from 'react';
import {Button, Col, Icon, Row, Upload} from 'antd';
import {LoadingAlert} from "web";

export default (reference, {
    button = {},
    upload = {},
    notice = {}
}) => {
    const {$fileList = [], $loading = false} = reference.state;
    button.loading = $loading;
    return (
        <div>
            <Row>
                <Col span={24}>
                    <LoadingAlert $alert={notice}/>
                </Col>
            </Row>
            <Row>
                <Col span={6} offset={9}>
                    <Upload {...upload.control} fileList={$fileList}>
                        {0 === $fileList.length ? (
                            <div>
                                <Icon type={upload.loading ? 'loading' : 'plus'}/>
                                <div className={upload.textClass}>{upload.text}</div>
                            </div>
                        ) : false}
                    </Upload>
                    <div className={"button"}>
                        <Button {...button}/>
                    </div>
                </Col>
            </Row>
        </div>
    );
}