declare module "zi" {
    import entry from './index.entry';

    export {
        LoadingContent,
        LazyColumn,
        Dialog,
        DialogMenu,
        DialogButton
    } from './variant';

    export {default as uca} from './annotation.a.uca.internal';

    export default entry
}