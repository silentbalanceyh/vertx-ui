import Ux from 'ux';
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    /*
        "record@file": {
            "type": "FILE",
            "field": "record@fileKey",
            "fieldName": "record@name"
        }
     */
    FILE: (data, config = {}) => {
        const {field, fieldName} = config;
        const fileObj = {};
        fileObj.key = data[field];
        fileObj.uid = data[field];
        fileObj.name = data[fieldName];
        fileObj.status = "done";
        return [fileObj];
    },
    /*
        "record@sizeUi": {
            "type": "SIZE",
            "field": "record@size"
        }
     */
    SIZE: (data, config = {}) => {
        const { unit, field } = config;
        return Ux.toFileSize(data[field], unit);
    }
}