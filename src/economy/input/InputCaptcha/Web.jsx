import React from 'react';
import {Spin} from 'antd';
import Op from './Op';

const renderImage = (reference) => {
    const {$image, $imageLoading = false} = reference.state;
    if ($image) {
        return (
            <div className={"captcha"} onClick={Op.rxImage(reference)}>
                <Spin spinning={$imageLoading}>
                    {/* eslint-disable-next-line */}
                    <img src={$image}/>
                </Spin>
            </div>
        )
    } else {
        return false;
    }
}
export default {
    "image": renderImage
}