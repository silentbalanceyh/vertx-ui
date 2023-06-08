declare module "zet" {
    import entry from './index.entry';

    export {default as _Refuse} from './tracer.c.refuse.async';

    export {default as _I} from './levy.c.api.interface';

    export default entry;
}