module.exports = {
    parser: "babel-eslint",
    env: {
        es6: true,
        browser: true
    },
    parserOptions: {
        ecmaVersion: 7,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
            experimentalObjectRestSpread: true
        }
    },
    plugins: ["react", "jsx-a11y"],
    extends: ["react-app", "plugin:jsx-a11y/recommended"],
    rules: {
        "no-alert": 0, //禁止使用alert confirm prompt
        "arrow-parens": 0, // 允许使用箭头函数
        "no-debugger": 1, //禁止使用debugger
        "no-dupe-keys": 2, //在创建对象字面量时不允许键重复 {a:1,a:1}
        "no-multi-spaces": 0,
        "no-constant-condition": 2, //禁止在条件中使用常量表达式 if(true) if(1)
        "jsx-quotes": 1,
        "react/jsx-boolean-value": 1, // 如果属性值为 true, 可以直接省略
        "react/no-string-refs": 1, // 总是在Refs里使用回调函数
        "react/self-closing-comp": 1, // 对于没有子元素的标签来说总是自己关闭标签
        "react/jsx-no-bind": 0, // 当在 render() 里使用事件处理方法时，提前在构造函数里把 this 绑定上去
        "react/sort-comp": 0, // 按照具体规范的React.createClass 的生命周期函数书写代码
        "react/jsx-pascal-case": 1, // React模块名使用帕斯卡命名，实例使用骆驼式命名
        "react/jsx-closing-bracket-location": 0,
        "jsx-a11y/label-has-for": 0, // 这种警告直接Ignore
        "react/jsx-tag-spacing": 0, // 总是在自动关闭的标签前加一个空格，正常情况下也不需要换行
        "jsx-a11y/href-no-hash": 0,
        "jsx-a11y/anchor-is-valid": 0,
        "jsx-a11y/click-events-have-key-events": 0,
        "jsx-a11y/no-static-element-interactions": 0
    }
}
;
