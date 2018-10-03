import Ux from 'ux';
import U from 'underscore';
import E from "../Ux.Error";
import Prop from "../prop";
import Param from "../fun/Ux.Param";
import Async from "../prop/Ux.Field";
import Dialog from "../Ux.Dialog";
import Uson from "../structure/Ux.Uson";

const _xtParams = (reference, config = {}) => {
    // 必须保证ajax参数信息
    E.fxTerminal(!config.ajax, 10053, config);
    if (config.ajax) {
        /**
         * 读取上层引用，这里是ListSelector中对应的Form本身
         * 所以上层引用才会是reference
         */
        const ref = Prop.onReference(reference, 1);
        E.fxTerminal(!ref, 10079, ref);
        if (ref) {
            /**
             * 解析Ajax参数信息
             */
            return Param.parseAjax(ref, config.ajax.params);
        }
    }
};

const xt2Loading = (reference, config = {}) => event => {
    // 常用的事件处理
    if (U.isFunction(event.preventDefault)) {
        event.preventDefault();
    }
    // 初始化数据
    reference.setState({
        $loading: true,             // 是否在加载
        $visible: true,             // 窗口是否显示
        $data: [],                  // 当前窗口的数据信息
        $tableKey: Ux.randomUUID(), // 专用的表格绑定的key信息
        $select: undefined          // 在窗口中的选中项
    });
    // 判断ajax处理，函数内部会判断，这里不判断
    const params = _xtParams(reference, config);
    const {mock} = reference.props;
    Async.asyncData(config.ajax, params,
        ($data) => reference.setState({
            $loading: false,
            $data
        }), mock);
};
const xt2Dialog = (reference = {}, show = false) => (event) => {
    if (U.isFunction(event.preventDefault)) {
        event.preventDefault();
    }
    // 设置窗口开关事件
    let state = {};
    state.$visible = show;
    // 重置页面数据
    state.$page = 1;
    state = Ux.clone(state);
    reference.setState(state);
};
const xtLinker = (reference = {}, config = {}) => {
    const {$select} = reference.state;
    const ref = Ux.onReference(reference, 1);
    const linker = config['linker'];
    if (linker) {
        // 使用Linker设置最终数据
        const values = Uson.create($select)
            .keep(Object.keys(linker))
            .convert(linker)
            .date(config['linkerDate']).to();
        E.fxInfo(true, 10081, linker, values);
        // 调用Form数据处理Linker
        Prop.formHits(ref, values);
        // 执行Linker过后的回调
        const {fnCallback} = config;
        if (U.isFunction(fnCallback)) {
            fnCallback($select);
        }
    }
};
const xt2Select = (reference = {}, config = {}) => (event) => {
    if (U.isFunction(event.preventDefault)) {
        event.preventDefault();
    }
    const {$select} = reference.state;
    const ref = Ux.onReference(reference, 1);
    // 判断ListSelector中的选中项，状态中的$select是否存在
    if ($select) {
        xtLinker(reference, config);
        // 关闭窗口
        reference.setState({$visible: false});
    } else {
        // 未选中时若包含了验证，则提示验证信息
        E.fxTerminal(!config.validation, 10080, config.validation);
        if (config.validation) {
            Dialog.showError(ref, config.validation);
        }
    }
};
const _xtPagination = (reference, config = {}) => {
    const {$data = {}, $page} = reference.state;
    const pagination = {
        showQuickJumper: true
    };
    pagination.total = $data.count;
    if (config.ajax && config.ajax.params) {
        const pager = config.ajax.params.pager;
        E.fxTerminal(!pager, 10048, pager);
        if (pager) {
            pagination.pageSize = pager.size;
            pagination.current = $page ? $page : pager.page;
        }
    }
    return pagination;
};
const _xt2Change = (reference, config = {}) => (pagination, filters, sorter) => {
    reference.setState({$loading: true, $visible: true});
    const {mock} = reference.props;
    if (config.ajax) {
        const params = _xtParams(reference, config);
        params.pager.size = pagination.pageSize;
        params.pager.page = pagination.current;
        // 补充设置$page页面值
        Async.asyncData(config.ajax, params, ($data) => reference.setState({
            $loading: false, $data, $page: pagination.current
        }), mock);
    }
};
const xtPager = (reference, config = {}) => {
    const pager = {};
    if ("client" !== config.pagination) {
        pager.onChange = _xt2Change(reference, config);
        pager.pagination = _xtPagination(reference, config);
    } else {
        pager.pagination = true;
    }
    return pager;
};
const xtSelection = (reference) => ({
    type: 'radio',
    onSelect: keys => {
        reference.setState({$select: keys});
    }
});
export default {
    xt2Loading,
    xt2Dialog,
    xt2Select,
    xtPager,
    xtSelection
};