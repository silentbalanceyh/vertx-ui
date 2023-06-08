import Ux from 'ux';

const dialog = (reference) => ({
    add: (params = {}, config = {}) => {
        let request = Ux.valueRequest(params);
        request = Ux.valueValid(request);
        return Ux.ajaxPost(config.uri, request)
            .then(Ux.ajax2Message(reference, config.dialog))
            .then(response => {
                Ux.of(reference)._.close(response);
                return Ux.promise(response);
            })
    },
    save: (params = {}, config = {}) => {
        let request = Ux.valueRequest(params);
        request = Ux.valueValid(request);
        return Ux.ajaxPut(config.uri, request)
            .then(Ux.ajax2Message(reference, config.dialog))
            .then(response => {
                Ux.of(reference)._.close(response);
                return Ux.promise(response);
            })
    },
    saveRow: (params = {}, config = {}) => {
        let request = Ux.valueRequest(params);
        return Ux.formRow(reference, request, config);
    },
    saveSelected: (data = []) => {
        const {rxRows} = reference.props;
        if (Ux.isFunction(rxRows)) {
            rxRows(data, {
                $visible: false, // 关闭窗口
            })
        } else {
            throw new Error("[ Ux ] 缺失核心函数 rxRow()");
        }
    }
});
export default {
    dialog,
}
