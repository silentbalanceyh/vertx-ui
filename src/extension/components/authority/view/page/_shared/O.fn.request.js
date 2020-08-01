import Ux from "ux";
import {Dsl} from 'entity';

export default (reference, doSelected) => {
    const {$keySet, $validation} = reference.state;
    let selected = new Set();
    if ($keySet) {
        Array.from($keySet).forEach(key => selected.add(key));
    } else {
        selected = [];
    }
    const validationKeys = Ux.immutable($validation);
    const validation = Array.from(selected).filter(key => validationKeys.contains(key));
    if (0 === validation.length) {
        Ux.sexMessage(reference, "empty")
    } else {
        if (Ux.isFunction(doSelected)) {
            reference.setState({$submitting: true});
            /*
             * 修改 selected
             */
            const request = doSelected(selected);
            if (request) {
                // 保存
                Ux.ajaxPut("/api/view/:ownerType/:ownerId", request).then(processed => {
                    Ux.sexDialog(reference, "saved", () => {
                        const {$views} = reference.state;
                        const state = {$submitting: false};
                        if ($views && Ux.isArray(processed)
                            && 0 < processed.length) {
                            const viewData = Dsl.getArray($views);
                            processed.forEach(view => viewData.saveElement(view));
                            state.$views = viewData.to();
                        }
                        reference.setState(state);
                    });
                }).catch(error => {
                    console.error(error);
                    Ux.sexMessage(reference, "server");
                    reference.setState({$submitting: false});
                })
            } else {
                // 调试专用
                reference.setState({$submitting: false});
            }
        }
    }
}