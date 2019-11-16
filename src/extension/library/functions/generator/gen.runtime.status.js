import Cm from './gen.common';

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
    rxClosePost: (reference) => (key) => rsOpened(reference, false)(key),
    rxOpenPost: (reference) => (data) => rsOpened(reference, true)(data),

    rxLoading: (reference) => (loading, addOn = {}) => rsLoading(reference, loading)(addOn),
    rxSubmitting: (reference) => (submitting, addOn = {}) => rsSubmitting(reference, submitting)(addOn),
    rxDirty: (reference) => (dirty, addOn = {}) => rsDirty(reference, dirty)(addOn)
}