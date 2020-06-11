import Ux from "ux";
import Ex from 'ex';

export default (reference, record) => (event) => {
    Ux.prevent(event);
    /*
     * 打开一个新的 tabs 页
     */
    let $state = Ux.clone(reference.state);
    let {$tabs = {}} = $state;
    $tabs = Ux.clone($tabs);
    const {dynamic = {}} = $tabs;
    if (dynamic) {
        $tabs.activeKey = dynamic.key;
        $tabs.items.push(dynamic);
        $tabs.items[0].disabled = true;
        /*
         * 读取Job相关数据
         */
        $state.$tabs = $tabs;
        Ex.I.uri(record.key)
            .then($inited => {
                $state.$inited = $inited;
                reference.setState($state);
            });
    }
}