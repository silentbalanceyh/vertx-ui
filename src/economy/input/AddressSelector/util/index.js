import parser from './O.parser';
import load from './O.load';
import onChange from './O.fn.change';
import onCallback from './O.fn.callback';

export default {
    ...load,
    ...parser,
    onChange,
    onCallback,
}