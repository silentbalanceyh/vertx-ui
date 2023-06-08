import data from './images/captcha.png';
import T from '../data.engine';
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    mock: true,
    data: T.valueBlob(data),
}