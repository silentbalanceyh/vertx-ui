import Ux from 'ux';
/*
 * 主要用于加载数据的完整流程
 * 1）config 中带有 magic 处理（默认条件）
 * 2）params 为传入的新的 params
 */
export default (reference) => {
    /*
     * 进入 loading 环节
     */
    reference.setState({$loading: true});
    const {config = {}} = reference.state;
    const ajax = config.ajax;
    if (ajax) {
        /*
         * 参数准备，处理参数基本信息
         */
        const {$query} = reference.state;
        return Ux.ajaxPost(ajax.uri, {
            $body: $query
        }).then(data => reference.setState({
            $data: data.list, $loading: false
        }));
    }
}