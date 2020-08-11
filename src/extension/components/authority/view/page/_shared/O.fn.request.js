import Ux from "ux";
import {Dsl} from 'entity';

const doExecute = (reference, selected, doSelected) => {
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

export default (reference, doSelected) => {
    const {$keySet, $validation} = reference.state;
    let selected = new Set();
    if ($keySet) {
        Array.from($keySet).forEach(key => selected.add(key));
    } else {
        selected = new Set();
    }
    if (0 < $validation.length) {
        /*
         * 区分了业务和系统的情况
         */
        const validationKeys = Ux.immutable($validation);
        const validation = Array.from(selected).filter(key => validationKeys.contains(key));
        if (0 === validation.length) {
            Ux.sexMessage(reference, "empty")
        } else {
            doExecute(reference, selected, doSelected);
        }
    } else {
        /*
         * 不区分系统和业务的情况
         */
        const validated = Array.from(selected);
        if (0 === validated.length) {
            Ux.sexMessage(reference, "empty")
        } else {
            doExecute(reference, selected, doSelected);
        }
    }
}