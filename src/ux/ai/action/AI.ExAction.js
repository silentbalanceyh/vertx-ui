import Prop from '../../prop';
import Value from '../../Ux.Value';
import {Button} from "antd";
import Fn from "../../fun";
import React from "react";

const ai2ExFilterButton = () => {
    return {
        $button: (cell, reference) => {
            const ref = Value.fix(cell, reference);
            const button = Prop.fromHoc(ref, "button");
            return (
                <Button.Group className={"ux-group"}>
                    <Button type={"primary"} icon={"search"}
                            onClick={() => Fn.irExFilter(ref)}>{button.search}</Button>
                    <Button icon={"reload"}
                            onClick={Fn.irExClear(ref)}>{button.clear}</Button>
                </Button.Group>
            )
        }
    }
};

export default {
    ai2ExFilterButton,
}