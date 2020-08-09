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
            const request = Ex.authRequest(reference, Array.from(selected));
            /*
             * $body 修正
             */
            if (Ux.isArray(request.$body)) {
                request.$body.filter(item => item.hasOwnProperty('rows'))
                    .forEach(item => {
                        const originalRow = item.rows;
                        try {
                            const row = JSON.parse(originalRow);
                            // 权限管理必备
                            row.type = [
                                "resource.tree"
                            ]
                            item.rows = JSON.stringify(row);
                        } catch (error) {
                        }
                    })
            }
            return request;
        });

        const {$keySet} = reference.state;
        if ($keySet) Ux.fn(reference).rxTree(Array.from($keySet));
    }
}