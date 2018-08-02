import Immutable from 'immutable';
import Ux from "ux";
import Value from './Ux.Value';
import U from 'underscore';

/**
 * Form专用提交方法，统一提交流程，reference的props属性中包含两个特殊属性
 * 1. form变量为Ant Design的Form创建的引用；
 * 2. $key变量标识Form的提交模式：$key = undefined则是添加模式；
 * @method runSubmit
 * @param {React.PureComponent} reference React专用组件引用
 * @param {Function} fnSuccess 提交成功过后的回调函数
 * @param {Function} fnFailure 如果验证出现错误后的回调函数
 * @example
 *
 *     // Form提交专用流程
 *     Ux.runSubmit(reference, data => {
 *          const {$hotel} = reference.props;
 *          if ($hotel && $hotel.is()) {
 *              // 填充默认的酒店ID和Sigma相关值
 *              data.hotelId = $hotel._("key");
 *              data.sigma = $hotel._("sigma");
 *              if (fnSubmit) {
 *                  fnSubmit(data);
 *              }
 *          }
 *     });
 */
const runSubmit = (reference = {}, fnSuccess, fnFailure) => {
    const {form, $key} = reference.props;
    if (form) {
        form.validateFieldsAndScroll((error, values) => {
            if (error) {
                if (fnFailure && U.isFunction(fnFailure)) {
                    fnFailure(error);
                }
                return;
            }
            const params = Immutable.fromJS(values).toJS();
            params.language = Ux.Env['LANGUAGE'];
            if ($key) params.key = $key;
            // 去掉undefined
            Value.valueValid(params);
            // 成功过后的回调
            if (fnSuccess && U.isFunction(fnSuccess)) {
                fnSuccess(params);
            }
        });
    } else {
        console.error("[VI] Form Submitting met errors, reference is null.", form);
    }
};

const rxSubmit = (reference = {}, $_loading = "", {
    success = () => {
    },
    validate = () => true,
    promise,
    failure = () => {
    },
    loading = ($_loading) ? (is = false) => {
        const state = {};
        state[$_loading] = is;
        reference.setState(state);
    } : () => {
    }
}) => {
    loading(true);
    runSubmit(reference, (values) => {
        // 验证函数专用
        if (!validate(values, reference)) {
            return;
        }
        // 生成Promise
        const $promise = promise(values, reference);
        if ($promise) {
            $promise.catch(error => {
                loading(false);
                failure(error, reference);
            }).then(response => {
                loading(false);
                success(response, reference);
            })
        } else {
            console.warn("[Ux] Your promise is invalid!");
            loading(false);
            success(values, reference);
        }
    }, () => loading(false));
};

const rxInit = (props, params = {}) => {
    if (U.isFunction(props.zxInit)) {
        const {$router} = props;
        const paramData = Immutable.fromJS(params).toJS();
        if ($router) {
            Object.assign(paramData, $router.params());
        }
        // 特殊引用注入
        paramData.$props = props;
        props.zxInit(paramData);
    }
};
/**
 * @class Action
 * @description 通用Form操作相关方法
 */
export default {
    runSubmit,
    rxSubmit,
    rxInit
}
