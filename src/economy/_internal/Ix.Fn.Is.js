import Immutable from 'immutable';

const diff = (reference, query = {}) => {
    const {$previous} = reference.state;
    if ($previous) {
        return !Immutable.is($previous, query);
    } else {
        return true;
    }
};
export default {
    diff
};