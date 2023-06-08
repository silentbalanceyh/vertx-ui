import Tabular from './fnTabularData'
import Ux from 'ux';

export default {
    mock: false,
    data: Tabular.data,
    processor: (response, params) => Ux.valueFilter(response, params.types)
}