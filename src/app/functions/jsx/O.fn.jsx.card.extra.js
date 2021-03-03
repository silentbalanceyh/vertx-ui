import Ux from 'ux';

export default (reference, fnBind, config = {}) => {
    const {$extra = []} = reference.state;
    return Ux.opExtra($extra,
        Ux.isFunction(fnBind) ? fnBind(reference) : {},
        config
    );
}