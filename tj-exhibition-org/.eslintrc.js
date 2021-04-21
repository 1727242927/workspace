module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/standard"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unneeded-ternary": "off",
    "eol-last": "off",
    "prefer-const": "off",
    "space-before-function-paren": "off",
    camelcase: "off",
    "no-unreachable": "off",
    "no-useless-return": "off",
    "no-unused-vars": "off",
    "no-empty-pattern": "off",
    eqeqeq: "off",
    "no-unused-vars": "off"
  }
};
