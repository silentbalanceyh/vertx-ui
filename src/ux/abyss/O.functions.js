import Is from './O.is';

const generator = (reference, names = []) => {
    const object = {};
    names.forEach(name => {
        object[name] = (values) => {
            let executor;
            if (reference.state) {
                executor = reference.state[name];
            }
            if (Is.isFunction(executor)) {
                return executor(values);
            } else {
                executor = reference.props[name];
                if (Is.isFunction(executor)) {
                    return executor(values);
                } else {
                    console.error(`${name} function 不存在！`);
                }
            }
        }
    });
    return object;
}
export default (reference) => generator(reference, [
    "onChange"
]);