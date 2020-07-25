import resource from './O.auth.resource'
import definition from './O.auth.definition'
import authRequest from './I.fn.auth.request'

export default {
    ...resource,
    ...definition,
    authRequest,
}