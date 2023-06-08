export default {
    V_LIMIT: {
        TreeList: {
            Form: [
                "$formAdd",
                "$formEdit",
                "$formFilter",
                "$list",
                "$query",
                "$mockData",
                "rxSearch",
                "rxInject",
                "rxSet",
                "rxEditPost",
                "rxDeletePost",
                "rxSwitchView",
                "rxAddRow",
                "$tree",
                "$formTreeAdd",
                "$formTreeEdit",
                "rxItemDelete",
                "rxTree",
                "rxItemAdd",
                "rxItemEdit",
                // 新添加的属性
                "rxParamTree",
                "$content",
                "$root"
            ]
        },
        TabList: {
            // ComplexList中搜索框需要过滤的属性
            Filter: [
                "$formAdd",
                "$formEdit",
                "$mockData",
                "$formFilter",
                "rxSearch",
                "rxInject",
                "rxSet",
                "rxEditPost",
                "rxDeletePost",
                "rxSwitchView",
                "rxAddRow",
                "$list",
                "$tree",
                "$formTreeAdd",
                "$formTreeEdit",
                "rxItemDelete",
                "rxTree",
                "rxItemAdd",
                "rxItemEdit"
            ],
            Add: [
                "$formAdd",
                "$formEdit",
                "$formFilter",
                "$list",
                "$query",
                "$mockData",
                "rxSearch",
                "rxInject",
                "rxSet",
                "rxEditPost",
                "rxDeletePost",
                "rxSwitchView",
                "rxAddRow",
                "$tree",
                "$formTreeAdd",
                "$formTreeEdit",
                "rxItemDelete",
                "rxTree",
                "rxItemAdd",
                "rxItemEdit"
            ],
            Edit: [
                "$formAdd",
                "$formEdit",
                "$formFilter",
                "$list",
                "$mockData",
                "$query",
                "rxSearch",
                "rxInject",
                "rxSet",
                "rxEditPost",
                "rxDeletePost",
                "rxSwitchView",
                "rxAddRow",
                "$tree",
                "$formTreeAdd",
                "$formTreeEdit",
                "rxItemDelete",
                "rxTree",
                "rxItemAdd",
                "rxItemEdit"
            ]
        },
        ComplexList: {
            // ComplexList中搜索框需要过滤的属性
            Filter: [
                "$formAdd",
                "$formEdit",
                "$mockData",
                "$formFilter",
                "rxSearch",
                "rxInject",
                "rxSet",
                "rxEditPost",
                "rxDeletePost",
                "rxSwitchView",
                "$list"
            ],
            Add: [
                "$formAdd",
                "$formEdit",
                "$formFilter",
                "$list",
                "$query",
                "$mockData",
                "rxSearch",
                "rxInject",
                "rxSet",
                "rxEditPost",
                "rxDeletePost",
                "rxSwitchView",
            ],
            Edit: [
                "$formAdd",
                "$formEdit",
                "$formFilter",
                "$list",
                "$mockData",
                "$query",
                "rxSearch",
                "rxInject",
                "rxSet",
                "rxEditPost",
                "rxDeletePost",
                "rxSwitchView",
            ]
        },
        DialogList: {
            Shared: [
                "$formAdd",
                "$formEdit",
                "fnView",
                "fnMock",
                "rxDelete"
            ]
        },
        DialogMenu: {
            Filter: [
                "$executor",
                "$component",
                "$disabled",
                "config"
            ]
        },
        DialogButton: {
            Filter: [
                "$disabled",
                "$button",
                "$dialog",
                "$mode",
                "$inited",
                "$content",
            ]
        }
    }
}