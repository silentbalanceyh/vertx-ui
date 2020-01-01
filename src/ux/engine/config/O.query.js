import Q from '../query';

const cabQuery = (reference, key = "grid") => {
    const {$hoc} = reference.state;
    if ($hoc) {
        const config = $hoc._(key);
        if (config && config.query) {
            /*
             * 构造 $query
             */
            return Q.qrCombine(config.query, reference);
        }
    }
};
export default {
    cabQuery,
}