// eslint-disable-next-line import/no-anonymous-default-export
/**
 * @name zoe.DataContainer
 * @interface DataContainer
 */
const DataContainer = {
    /** **/ _: () => ({}),
    /** **/ __type: () => "",
    /** **/ is: () => "",
    /** **/ to: () => ({}),
    /** **/ raw: () => ({})
}
/**
 * @name zoe.BindContainer
 * @interface BindContainer
 */
const BindContainer = {
    /** **/ bind: () => ({}),
    /** **/ __type: () => ""
}

/**
 * @name zoe.DataObject
 * @class DataObject
 *
 */
const DataObject = {
    /** **/ _: () => ({}),
    /** **/ __type: () => "",
    /** **/ is: () => "",
    /** **/ to: () => ({}),
    /** **/ raw: () => ({}),
    /** **/ isEmpty: () => ({}),
    /** **/ $: () => ({}),
    /** **/ find: () => ({}),
    /** **/ set: () => ({}),
}
/**
 * @name zoe.DataArray
 * @class DataArray
 *
 */
const DataArray = {
    /** **/ is: () => "",
    /** **/ to: () => ({}),
    /** **/ raw: () => ({}),
    /** **/ setValue: () => ({}),
    /** **/ filter: () => ({}),
    /** **/ $: () => ({}),
    /** **/ push: () => ({}),
    /** **/ saveElement: () => ({}),
    /** **/ getElement: () => ({}),
    /** **/ removeElement: () => ({}),
    /** **/ updateElement: () => ({}),
    /** **/ searchElement: () => ({}),
    /** **/ counter: () => ({}),
    /** **/ dirty: () => ({}),
    /** **/ asc: () => ({}),
    /** **/ desc: () => ({}),
    /** **/ _: () => ({}),
    /** **/ __type: () => "",
}
/**
 * @name zoe.DataArray
 * @class Navigator
 *
 */
const Navigator = {
    /** **/ init: () => ({}),
    /** **/ __type: () => "",
    /** **/ flush: () => ({}),
    /** **/ get: () => ({}),
    /** **/ bind: () => ({}),
    /** **/ isActive: () => ({}),
    /** **/ setActive: () => ({}),
    /** **/ setKeys: () => ({}),
}
/**
 * @name zoe.StateIn
 * @class StateIn
 */
const StateIn = {
    /** **/ callback: () => ({}),
    /** **/ to: () => ({}),
}
/**
 * @name zoe.StateOut
 * @class StateOut
 */
const StateOut = {
    /** **/ rinit: () => ({}),
    /** **/ ravamp: () => ({}),
    /** **/ radial: () => ({}),
    /** **/ rework: () => ({}),
    /** **/ rapt: () => ({}),
    /** **/ rush: () => ({}),
    /** **/ to: () => ({}),
    /** **/ navigator: () => ({}),
    /** **/ stream: () => ({}),
    /** **/ ready: () => ({}),
}
/**
 * @name zoe.DataRouter
 * @class DataRouter
 */
const DataRouter = {
    /** **/ to: () => ({}),
    /** **/ _: () => ({}),
    /** **/ __type: () => "",
    /** **/ __state: () => "",
    /** **/ same: () => ({}),
    /** **/ bind: () => ({}),
    /** **/ push: () => ({}),
    /** **/ uri: () => ({}),
    /** **/ paramsQs: () => ({}),
    /** **/ params: () => ({}),
    /** **/ state: () => ({}),
    /** **/ key: () => ({}),
    /** **/ from: () => ({}),
}
/**
 * @name zoe.DataEvent
 * @class DataEvent
 */
const DataEvent = {
    /** **/ clone: () => ({}),
    /** **/ bind: () => ({}),
    /** **/ start: () => ({}),
    /** **/ config: () => "",
    /** **/ next: () => "",
    /** **/ end: () => ({}),
    /** **/ getInput: () => ({}),
    /** **/ getName: () => ({}),
    /** **/ getTarget: () => ({}),
    /** **/ getRef: () => ({}),
    /** **/ getData: () => ({}),
    /** **/ getPrev: () => ({}),
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    BindContainer,
    DataContainer,
    DataArray,
    DataObject,
    Navigator,
    StateIn,
    StateOut,
    DataRouter,
    DataEvent,
}