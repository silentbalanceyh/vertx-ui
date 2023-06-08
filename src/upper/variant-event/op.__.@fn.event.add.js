import __F from '../o.silver.bullet.form';

export default (config = {}) => reference => params =>
    __F.form(reference).add(params, config)