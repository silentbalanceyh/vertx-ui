import Ux from 'ux';

export default (reference, config = {}) => (inputText) => {
    if (inputText) {
        reference.setState({$loading: true});
        /*
         * 参数准备，处理参数基本信息
         */
        let params = {};
        const ajax = config.ajax;
        if (ajax && ajax.magic) {
            params = Ux.parseInput(ajax.magic, reference);
        }
        /*
         * 追加相关条件基本信息
         */
        const {condition = []} = config;
        const secondary = {"": false};
        condition.forEach(cond => {
            secondary[cond] = inputText;
        });
        params["$0"] = secondary;
        const query = {};
        query.criteria = Ux.clone(params);
        /*
         * 搜索 Ajax 调用，并更新
         * $data
         */
        return Ux.ajaxPost(ajax.uri, {
            $body: query
        }).then(data => reference.setState({
            $data: data.list, $loading: false
        }));
    } else {
        reference.setState({$data: []});
    }
}