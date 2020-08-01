import Ux from "ux";
import Sd from "../_shared";
import Ex from "ex";

export default {
    $opSave: (reference) => (event) => {
        Ux.prevent(event);

        Sd.doRequest(reference, (selected) => {
            /*
             * 计算 selected
             */
            return Ex.authRequest(reference, Array.from(selected));
        });

        const {$keySet} = reference.state;
        if ($keySet) Ux.fn(reference).rxTree(Array.from($keySet));
    }
}