import Env from './Ux.Env';

const _colorful = (reference = {}, Name, color = {}, type, stateless) => {
    if (Env.DEBUG) {
        const flag = type ? type : 'React Component';
        let message = `%c [Kid] [${(!stateless)
            ? flag
            : "Stateless Function Component"}] Control monitor: name = ${Name}`;
        console.groupCollapsed(message, `color:${color.group};font-weight:900`);
        console.log(`%c [Kid] Props -> `, `color:${color.props};font-weight:900`, reference.props);
        if (!stateless) {
            console.log(`%c [Kid] State -> `, `color:${color.state};font-weight:900`, reference.state);
        }
        console.groupEnd()
    }
};


const control = (reference = {}, Name) => {
    _colorful(reference, Name, {
        group : '#990000',
        props : '#660099',
        state : '#666666'
    }, 'Rx-Control');
};

const page = (reference = {}, Name) => {
    _colorful(reference, Name, {
        group : '#CC0033',
        props : '#660099',
        state : '#666666'
    }, 'Rx-Page');
};

const stateless = (props = {}, Name) => {
    _colorful({
        props,
        state : null
    }, Name, {
        group : '#99CC33',
        props : "#660099",
        state : "#666666"
    }, 'Rx-Stateless', true)
};

const container = (reference = {}, Name) => {
    _colorful(reference, Name, {
        group : '#009900',
        props : '#660099',
        state : '#666666'
    }, 'Rx-Container');
};

const component = (reference = {}, Name) => {
    _colorful(reference, Name, {
        group : '#CC9933',
        props : '#660099',
        state : '#666666'
    }, 'Rx-Component');
};

const form = (reference = {}, Name) => {
    _colorful(reference, Name, {
        group : '#0099FF',
        props : '#660099',
        state : '#666666'
    }, 'Rx-Form');
};

const filters = (reference = {}, {
    input = {}, query = {}, filters = {}, cond
}) => {
    if (Env.DEBUG) {
        let message = `%c [Kid] [Filter] Filters Data Process`;
        console.groupCollapsed(message, "color:red;font-weight:900");
        console.log(`%c [Kid] Input Query -> `, 'color:#009900;font-weight:900', input);
        console.log(`%c [Kid] Prop Query -> `, 'color:#660099;font-weight:900', query);
        console.log(`%c [Kid] Search Filter -> `, 'color:#0099FF;font-weight:900', filters);
        console.log(`%c [Kid] Cond -> `, 'color:blue;font-weight:900', cond);
        console.groupEnd();
    }
};

const sign = (uri, method, parameters, {
    seed, sig, secret
}) => {
    if (Env.DEBUG) {
        let message = `%c [Kid] [Sign] Sign with method ${method}. ( uri = ${uri})`;
        console.groupCollapsed(message, "color:#CCCC33;font-weight:900");
        console.log(`%c [Kid] Parameters -> `, 'color:#9999CC;font-weight:900', parameters);
        console.log(`%c [Kid] Seed -> `, 'color:#669966;font-weight:900', seed);
        console.log(`%c [Kid] Secret -> `, 'color:blue;font-weight:900', secret);
        console.log(`%c [Kid] Sig -> `, 'color:red;font-weight:900', sig);
        console.groupEnd();
    }
};

const request = (uri, method, parameters, token = '') => {
    if (Env.DEBUG) {
        let message = `%c [Kid] [Ajax] Ajax request with method ${method}. ( uri = ${uri})`;
        console.groupCollapsed(message, "color:#0066CC;font-weight:900");
        console.log(`%c [Kid] Parameters -> `, 'color:#9999CC;font-weight:900', parameters);
        console.log(`%c [Kid] Uri -> `, 'color:#669966;font-weight:900', uri);
        console.groupEnd();
    }
};

const response = (err, res, method) => {
    if (Env.DEBUG) {
        let message = `%c [Kid] [Ajax] Ajax response got with method. ${method}`;
        console.groupCollapsed(message, "color:#006699;font-weight:900");
        console.log(`%c [Kid] Resource -> `, 'color:#9999CC;font-weight:900', res);
        console.log(`%c [Kid] Error -> `, 'color:#669966;font-weight:900', err);
        console.groupEnd();
    }
    // For fetch api 专用
    return res
};

const error = (error) => {
    let message = `%c [Kid] [Error] Error occurs got. status = ${error.status}, code = ${error.code}, brief = ${error.statusText}`;
    console.groupCollapsed(message, "color:red;font-weight:900");
    console.log(`%c [Kid] Error message -> `, 'color:#ff0073;font-weight:900', error.message);
    console.log(`%c [Kid] Read message -> `, 'color:#ee0033;font-weight:900', error.info);
    console.groupEnd();
};

const debug = (object) => {
    if (Env.DEBUG) {
        console.info(object);
    }
};

export default {
    control,
    container,
    component,
    page,
    form,
    stateless,
    sign,
    request,
    response,
    error,
    debug,
    filters
}
