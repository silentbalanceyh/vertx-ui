import Ux from 'ux';
import __V from './pedestal.v.constant.option';
import __TAB from './idyl.fn.rx.container.tab';

const rxRowOpen = (reference, config = {}) => (id, record, metadata) => {
    const {
        reference,
    } = metadata;
    const {
        rxBefore,
        rxAfter
    } = config;
    /* Loading 效果 */
    Ux.of(reference).loading(false).handle(() => {
        // __RS.r?Loading(reference)();
        // rxBefore, 打开之前的函数
        if (Ux.isFunction(rxBefore)) {
            rxBefore(id, record, metadata);
        }
        // ?x(reference).view(id, record, metadata)
        rxView(reference)(id, record, metadata).then(data => {
            // rxAfter, 打开后函数
            // 此处rxAfter一定要在 open 方法之前调用，否则会出现
            // 状态不同步的问题
            if (Ux.isFunction(rxAfter)) {
                rxAfter(id, data, metadata);
            }
            /* 关闭 Loading 用*/
            Ux.of(reference).load(false).handle(() => {
                __TAB.rxTabOpen(reference)(id, data, record);
            });
            // __RS.r?Loading(reference, false)({});
        });
    })
}
const rxSelected = (reference) => ($selected = [], $data = []) => {

    Ux.of(reference).in({
        $selected
    }).handle(() => {
        Ux.of(reference)._.selected_($data);
        // const {r?PostSelected} = reference.props;
        // if (Ux.isFunction(r?PostSelected)) {
        //     r?PostSelected($data);
        // }
    })
};
const rxView = (reference) => (key, record = {}, metadata = {}) => {
    if (key) {
        const {options = {}} = reference.state;
        let uri;
        const {ajax = {}} = metadata;
        if (ajax.uri) {
            uri = ajax.uri;
        } else {
            uri = options[__V.Opt.AJAX_GET_URI];
        }
        /*
         * operation for uri
         */
        const params = {};
        if (Ux.isEmpty(record)) {
            params['key'] = key;
        } else {
            Object.keys(record).forEach(key => {
                if (!Ux.isObject(record[key]) && !Ux.isArray(record[key])) {
                    params[key] = record[key];
                }
            })
        }
        return Ux.ajaxGet(uri, params);
    } else {
        return Ux.promise({})
    }
};

const rxDelete = (reference) => (key, callback) => {
    if (key) {
        const {options = {}, $selected = []} = reference.state;
        const uri = options[__V.Opt.AJAX_DELETE_URI];
        return Ux.ajaxDelete(uri, {key}).then(() => {
            const num = $selected.indexOf(key);
            //删除后从选中项中清除
            if (-1 !== num) {
                $selected.splice(num, 1);
            }
            //修改状态
            let of = Ux.of(reference);
            if (0 === $selected.length) {
                of = of.in({
                    $selected: []
                });
                // reference.?etState({$selected: []});
            } else {
                of = of.in({
                    $selected
                });
                // reference.?etState({$selected: []});
                // reference.?etState({$selected});
            }
            // 删除后续方法
            of.handle(() => {
                // const {r?PostDelete} = reference.props;
                // if (Ux.isFunction(r?PostDelete)) {
                //     r?PostDelete({key}, reference);
                // }
                of._.delete_({key});

                callback(key);
            })
        }).catch((error) => Ux.ajaxError(reference, error))
    }
};
export default {
    rxSelected,     // 选中
    rxDelete,       // 行删除
    rxView,         // 查看行
    rxRowOpen,      // 打开行
}