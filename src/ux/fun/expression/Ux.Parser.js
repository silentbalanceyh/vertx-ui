import E from '../../Ux.Error';
import Type from '../../Ux.Type';
import V from '../../Ux.Value';

const findValue = (target = {}, attrPath = []) => {
    E.fxTerminal(2 !== attrPath.length, 10035, target);
    if (2 === attrPath.length) {
        const targetKey = attrPath[0];
        const name = attrPath[1];
        if (targetKey && name) {
            return V.annexObject(target, `${targetKey}`, attrPath[1]);
        } else {
            console.error(`[ Ux ] 解析的配置不对，key = ${targetKey}, name = ${name}`);
        }
    } else {
        console.error(`[ Ux ] 解析表达式有问题，请检查：${target}`);
    }
};
export default {
    BOOL: {
        searcher: (value) => Boolean(value)
    },
    OPERATOR: {
        searcher: (value) => "AND" === value,
    },
    DATUM: {
        parser: (kv1 = "") => [kv1.split(',')],
        searcher: (value, props) => {
            const source = value[0];
            const filters = {};
            for (let idx = 1; idx < value.length; idx++) {
                const term = value[idx];
                if ("string" === typeof term) {
                    const kv = term.split('=');
                    filters[kv[0]] = kv[1];
                }
            }
            const unique = Type.elementUniqueDatum({props}, source, filters);
            return unique ? unique.key : undefined;
        }
    },
    PROP: {
        parser: (kv1 = "") => [kv1.split(',')],
        searcher: (value, props) => {
            const path = value[0];
            const attrPath = path.split('.');
            return findValue(props, attrPath);
        }
    },
    ENUM: {
        parser: (kv1) => {
            console.info(kv1);
        },
        searcher: (value) => value.split('`'),
    },
    FIX: {
        parser: (kv1) => [kv1],
        searcher: (value) => value
    },
    ROUTE: {
        parser: (kv1 = "") => [kv1],
        searcher: (value, props) => {
            const attr = value[0];
            if (attr) {
                const {$router} = props;
                if ($router) {
                    return $router._(attr);
                }
            }
        }
    },
    STATE: {
        parser: (kv1) => [kv1.split('.')],
        searcher: (value, props, state) => {
            const attrPath = value;
            if (1 === attrPath.length) {
                const attr = attrPath[0];
                return state[`$${attr}`];
            } else {
                return findValue(state, attrPath);
            }
        }
    }
}