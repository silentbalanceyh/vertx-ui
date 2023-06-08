import {LeftOutlined, RightOutlined} from '@ant-design/icons';
import {Button} from "antd";
import React from "react";
import Op from './Op';

export default (reference) => {
    const {
        $actions = {}, $step = 0, $stepConfig = [],
        $submitting = false
    } = reference.state;
    return (
        <Button.Group>
            <Button disabled={0 === $step || $step === ($stepConfig.length - 1)}
                    loading={$submitting}
                    onClick={Op.onPrev(reference)}>
                <LeftOutlined/>
                {$actions.prev}
            </Button>
            <Button type={"primary"}
                    disabled={$step === ($stepConfig.length - 1)}
                    loading={$submitting}
                    onClick={Op.onNext(reference)}>
                {$actions.next}
                <RightOutlined/>
            </Button>
        </Button.Group>
    );
}