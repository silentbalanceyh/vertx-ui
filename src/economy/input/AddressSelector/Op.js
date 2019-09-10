import Yi from './yi';
import Yo from './yo';
import T from './util';

export default {
    ...Yi,
    ...Yo,
    onChange: T.onChange,
}