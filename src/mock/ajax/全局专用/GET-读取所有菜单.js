export default {
    mock: true,
    data: {
        REPORT: require('./menus/data-report.json'),
        DataAnalysis: require('./menus/data-analyzing.json'),
        DataAsset: require('./menus/data-asset.json'),
        DataMarket: require('./menus/data-market.json'),
        Persona: require('./menus/data-person.json'),
        SystemAdmin: require('./menus/data-setting.json')
    },
    processor: (data = {}, params) => {
        const {appCode} = params;
        const result = data[appCode];
        return result ? result : {};
    }
}