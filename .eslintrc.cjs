/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
    root: true,
    extends: [
        "plugin:vue/essential",
        "eslint:recommended",
    ],
    rules: {
        indent: ["error", 4, {SwitchCase: 1}],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "never"],
        "no-console": ["error", {allow: ["error"]}],
        camelcase: 0,
        "space-before-function-paren": ["error", "never"],
        "object-curly-spacing": ["error", "never"],
        "arrow-parens": ["error", "as-needed"],
        "arrow-body-style": ["error", "as-needed"],
        "promise/always-return": "off",
        "promise/no-return-wrap": ["error", {allowReject: true}],
    },
    plugins: ["html", "promise"],
}
