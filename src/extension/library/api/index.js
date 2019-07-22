import application from './application';
import oauth from './oauth';
import form from './form';
import employee from './employee';

export default {
    ...application,
    ...oauth,
    ...form,
    ...employee,
}