import {QQuery} from 'entity';

const cabQuery = (reference, key = "grid") => {
    const {$hoc} = reference.state;
    if ($hoc) {
        const config = $hoc._(key);
        if (config && config.query) {
            /*
             * 构造 $query
             */
            const queryRef = new QQuery(config.query, reference);
            return queryRef.to();
        }
    }
};

export default {
    cabQuery,
}