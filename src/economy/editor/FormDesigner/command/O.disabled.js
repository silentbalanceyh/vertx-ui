import Ux from 'ux';

export default {
    database: (reference) => {
        const {$source} = reference.props;
        return !Ux.isFunction($source);
    }
}