import Cm from './gen.common';
import Ux from 'ux';
import {Dsl} from 'entity';

const rsVisible = (reference, visible = true) =>
    Cm.boolean(reference, "$visible", visible);
const rsLoading = (reference, loading = true) =>
    Cm.boolean(reference, "$loading", loading);
const rsSubmitting = (reference, submitting = true) =>
    Cm.boolean(reference, "$submitting", submitting);
const rsDirty = (reference, dirty = true) =>
    Cm.boolean(reference, "$dirty", dirty);
const rsOpened = (reference, opened = true) =>
    Cm.boolean(reference, "$opened", opened);
export default {
    rsVisible,
    rsLoading,
    rsSubmitting,
    rsDirty,
    /*
     * 判断页面是打开还是关闭
     */
    rxPostClose: (reference) => (key) => rsOpened(reference, false)(key),
    rxPostOpen: (reference) => (data) => rsOpened(reference, true)(data),

    rxLoading: (reference) => (loading, addOn = {}) => rsLoading(reference, loading)(addOn),
    rxSubmitting: (reference) => (submitting, addOn = {}) => rsSubmitting(reference, submitting)(addOn),
    rxDirty: (reference) => (dirty, addOn = {}) => rsDirty(reference, dirty)(addOn),
    /*
     * Assist 专用处理
     */
    rxAssist: (reference) => (key, data, deleted = false) => {
        const saved = Ux.onSave(reference, key, data, deleted);
        if (saved && Ux.isArray(saved)) {
            /*
             * 写 $a_<key> 专用
             */
            const $key = Ux.toKey(key);
            const state = {};
            state[$key] = Dsl.getArray(saved);
            reference.setState(state);
        }
    }
}