declare module "zero" {
    import entry from './index.entry';

    export {default as zero} from './annotation.a.zero';
    export {DiMap as G6On} from './variant-g6-metadata';

    export {
        DataSource,
        DatumUnique,
        ParamPanel,
        ParamInput,
        RestfulApi,
        ValueSource
    } from './variant-uca';
    export {
        FormDesigner
    } from './variant-form-designer';
    export default entry
}