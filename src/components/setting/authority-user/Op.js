import {Of} from 'app';
import {Dsl} from 'entity';
import Ux from 'ux';

export default {
    fnExecutor: (reference) => ({
        fnGenerate: (data, config, callback) =>
            Dsl.of(reference).bind(Of.apiUserPass).ok(response => {
                Ux.sexDialog(reference, "generated", response);
            }).async(data),
        fnDelete: (data, config, callback) => {
            console.log(data);
        }
    })
}