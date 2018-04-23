const refmt = require('reason');
const { lowerFirstChar } = require('../util');

function printer(nodes) {
  const raw = `
    type ${nodes
      .map(({ name, content, comment }) => {
        return `
        ${comment ? `/* ${comment} */` : ''}
        ${lowerFirstChar(name)} = ${content}`;
      })
      .join(' and ')}`;

  try {
    const ast = refmt.parseREI(raw);
    return refmt.printREI(ast);
  } catch (err) {
    console.error(
      'Parsing ReasonML syntax failed... This should never happen.',
    );
    console.log(raw);
    throw err;
  }
}

module.exports = printer;
