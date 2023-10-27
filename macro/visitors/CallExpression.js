const { astish } = require('../../src/core/astish')
const { parse } = require('../../src/core/parse')

const autoName = (key) => `i-${key}-${++id}`;
const variName = (key) => `--i-${key}-${++variId}`;
const vari = (name) => `var(${name})`;

let id = 0;
let variId = 0;

const parseAst = (item, t, p, key) => {
  if (item.type !== "ObjectExpression") {
    const name = variName(key);
    p.push({ name, item });
    return vari(name);
  }
  const obj = {};
  item.properties.forEach((pair) => {
    let key = t.isIdentifier(pair.key) ? pair.key.name : pair.key.value;
    const { type, value } = pair.value;
    const isPlainValue = type === "NumericLiteral" || type === "StringLiteral";
    obj[key] = isPlainValue ? value : parseAst(pair.value, t, p, key);
  });
  return obj;
};

const shorten = () => ``

module.exports = function CallExpression(path, state, t) {
  const { filename } = state
  if (
    t.isIdentifier(path.node.callee, { name: "css" }) &&
    path.node.arguments.length === 1 &&
    t.isObjectExpression(path.node.arguments[0])
  ) {
    const acc = [];
    
    const maybeIdentifier = path.parent.key || path.parent.id;
    const className = autoName(`${filename ? shorten(filename) + "-" : ""}${maybeIdentifier ? maybeIdentifier.name : ""}`);
    const obj = parseAst(path.node.arguments[0], t, acc);
    
    state.styleSheet.cssText += parse(astish(obj), '.' + className)
    
    const objectExpression = acc.length && t.objectExpression(acc.map((item) => t.objectProperty(t.stringLiteral(item.name), item.item)))
    const stringLiteral = t.stringLiteral(className)
    path.replaceWith(objectExpression ?  t.callExpression(t.identifier("css"), [stringLiteral, objectExpression]) : stringLiteral);

  }
}


