const refmt = require('reason');
const { lowerFirstChar } = require('../util');
const constants = require('../constants');

function printTypes(nodes) {
  return `
    type ${nodes
      .map(({ name, content, comment }) => {
        return `
        ${comment ? `/* ${comment} */` : ''}
        ${lowerFirstChar(name)} = ${content}`;
      })
      .join(' and ')}`;

}

function printVariants(nodes) {
  return nodes.reduce((sum, node) => {
    return sum + `
      ${node.comment ? `/* ${node.comment} */` : ''}
      [@bs.deriving jsConverter]
      type ${lowerFirstChar(node.name)} = ${node.content};
    `;
  }, '');
}

function printer(nodes) {
  const typesOutput = printTypes(nodes.filter(({kind}) => kind === constants.KindType))
  const variantsOutput = printVariants(nodes.filter(({kind}) => kind === constants.KindVariant))

  const raw = `${variantsOutput} ${typesOutput}`;

  try {
    const ast = refmt.parseRE(raw);
    return refmt.printRE(ast);
  } catch (err) {
    // eslint-disable-next-line
    console.error(
      'Parsing ReasonML syntax failed... This should never happen.',
      err,
    );
    throw err;
  }
}

module.exports = printer;
