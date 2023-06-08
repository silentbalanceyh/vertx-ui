import Loadable from 'react-loadable';
import {LoadingContent} from "./variant";

export default (loaderFn) => Loadable({
    loader: () => loaderFn(),
    loading: LoadingContent,
})