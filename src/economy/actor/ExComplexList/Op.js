import U from 'underscore';

const init = (reference) => {
    const {fnData} = reference.props;
    const {query = {}} = reference.state;
    if (U.isFunction(fnData)) {
        fnData(query).then(data => {
            console.info(data);
        })
    }
};
export default {
    init
}