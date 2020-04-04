import onInit from './O.fn.init';
import command from './O.command';
import validator from './O.validator';
import executor from './O.executor';

export default {
    onInit,
    event: {
        validator,
        command,
        executor,
    }
}