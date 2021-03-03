export default {
    mock: true,
    data: [
        {
            "key": "ds1",
            "name": "数据库1",
            "type": "DB"
        },
        {
            "key": "table1",
            "name": "表名1",
            "parentId": "ds1",
            "type": "TABLE"
        },
        {
            "key": "field11",
            "name": "字段11-字段类型",
            "parentId": "table1",
            "type": "FIELD"
        },
        {
            "key": "field12",
            "name": "字段12-字段类型",
            "parentId": "table1",
            "type": "FIELD"
        },
        {
            "key": "field13",
            "name": "字段13-字段类型",
            "parentId": "table1",
            "type": "FIELD"
        },
        {
            "key": "field21",
            "name": "字段21-字段类型",
            "parentId": "table2",
            "type": "FIELD"
        },
        {
            "key": "field22",
            "name": "字段22-字段类型",
            "parentId": "table2",
            "type": "FIELD"
        },
        {
            "key": "field31",
            "name": "字段31-字段类型",
            "parentId": "table3",
            "type": "FIELD"
        },
        {
            "key": "field32",
            "name": "字段32-字段类型",
            "parentId": "table3",
            "type": "FIELD"
        },
        {
            "key": "field33",
            "name": "字段33-字段类型",
            "parentId": "table3",
            "type": "FIELD"
        },
        {
            "key": "table2",
            "name": "表名2",
            "parentId": "ds1",
            "type": "TABLE"
        },
        {
            "key": "table3",
            "name": "表名3",
            "parentId": "ds1",
            "type": "TABLE"
        },
        {
            "key": "ds2",
            "name": "数据库2",
            "type": "DB"
        },
        {
            "key": "ds3",
            "name": "数据库3",
            "type": "DB"
        }
    ]
}