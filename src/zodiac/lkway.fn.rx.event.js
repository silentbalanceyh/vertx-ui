import __Zn from './zero.module.dependency';

export default {
    // 异步
    rxSubmitting: (reference, deleted = false) => ($submitting = true, addOn = {}) => {
        if (deleted) {
            // 防穿透构造
            return () => __Zn.promise({});
        }
        const combine = {
            ...addOn,
            $submitting,
        };
        return __Zn.of(reference).in(combine).future(() => __Zn.promise(combine))
    }
}