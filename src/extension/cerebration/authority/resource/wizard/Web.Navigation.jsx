import {Button, Icon} from "antd";
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
                <Icon type="left"/>
                {$actions.prev}
            </Button>
            <Button type={"primary"}
                    disabled={$step === ($stepConfig.length - 1)}
                    loading={$submitting}
                    onClick={Op.onNext(reference)}>
                {$actions.next}
                <Icon type="right"/>
            </Button>
        </Button.Group>
    )
}