import Ux from "ux";
import {Modal} from 'antd';
import E from '../debug/error';
import Fn from '../global/async';
import U from 'underscore';

const xtParam = (params = {}, isPure = false) => {
    // 执行默认参数处理
    const data = Ux.clone(params);
    /*
     * Pure 模式下不处理其他默认字段的直接追加
     */
    if (!isPure) {
        /* 记录中的语言信息 */
        data.language = Ux.Env['LANGUAGE'];
        if (!data.hasOwnProperty('active')) {
            /* 默认记录启用 */
            data.active = true;
        }
        /*
         * 三个头部参数提取，仅保留 sigma 参数，其余两个参数不在此处体现
         * X-App-Id, X-App-Key, X-Sigma
         */
        const app = Ux.isInit();
        if (app && app.sigma) {
            data.sigma = app.sigma;
        }
    }
    return data;
};
const xtOp = (reference, executor = {}, isPure = false) => (event) => {
    event.preventDefault();
    // 提交处理
    reference.setState({$loading: true});
    // 提取Form
    const {form} = reference.props;
    if (form) {
        return new Promise((resolve, reject) => {
            // 执行 values 的提取
            form.validateFieldsAndScroll((error, values) => {
                if (error) {
                    reject(error);
                }
                resolve(values);
            })
        }).then((params) => {
            /*
             * 参数准备
             */
            const data = xtParam(params, isPure);
            /*
             * success 处理
             */
            return Fn.promise(executor.success, data)
            /*
             * Error
             */.catch(error => Fn.failure(reference, error));
        })
        /*
         * Error
         */.catch(error => Fn.failure(reference, error));
    } else {
        /*
         * Error
         */
        return E.error002().catch(error => Fn.failure(reference, error));
    }
};
const xtConfirm = (fnEvent, content) => (event) => {
    if (U.isFunction(fnEvent)) {
        event.preventDefault();
        if (content) {
            /* 带确认框 */
            Modal.confirm({
                content,
                onOk: () => fnEvent()
            })
        } else {
            /* 不带确认 */
            fnEvent();
        }
    } else {
        E.error007().catch(error => console.error(error));
    }
};
export default {
    xtConfirm,
    xtOp,
    xtParam
}