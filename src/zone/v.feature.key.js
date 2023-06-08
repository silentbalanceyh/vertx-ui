const KEY_APP = `${process.env.K_SESSION}SESSION/APP/${process.env.APP.toUpperCase()}`;
const KEY_USER = `${process.env.K_SESSION}SESSION/USER`;
const KEY_MENU = `${process.env.K_SESSION}SESSION/MENU`;
const PAGE_HOME = `${process.env.K_DEFAULT ? process.env.K_DEFAULT : "zero.desktop"}`
export default {
    // For Allocation
    PAGE_HOME,
    PAGE_APP: `${KEY_MENU}/APP`,
    PAGE_OPEN: `${KEY_MENU}/OPEN`,
    PAGE_AT: `${KEY_MENU}/AT`,
    PAGE_MENU: `${KEY_MENU}/DATA`,

    // For Application / Session / Redux
    KEY_APP,
    KEY_USER,
    KEY_EVENT: process.env.K_EVENT,


    // For App
    X_LANG: `${KEY_APP}/LANG`,
    X_APP_ID: `${KEY_APP}/ID`,
    X_APP_KEY: `${KEY_APP}/KEY`,
    X_SIGMA: `${KEY_APP}/SIGMA`,
    X_SESSION: `${KEY_APP}/SESSION_ID`,
    // For Development
    KEY_MDATA: `${process.env.K_SESSION}MONITOR/DATA/`,
}