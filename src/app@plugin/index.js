import Function from './functions';
import Extension from './plugin';

export default {
    Function,
    Extension,

    pluginField: (ref) => (record, reference) => {
        return {};
    }
}