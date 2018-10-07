import Mock from './Ix.Fn.Mock';
import M from './Ix.Fn.Monitor';
import Control from './Ix.Fn.Inherit';
import Is from './Ix.Fn.Is';
import Func from './func';

export default {
    Mock,
    M,
    Limit: Control,
    Is,
    ...Func,
};