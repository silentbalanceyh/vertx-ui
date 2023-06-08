import __F from '../o.silver.bullet.form';

export default () => reference => params =>
    __F.form(reference).filter(params);