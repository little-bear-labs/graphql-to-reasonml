const refmt = require('reason');

function printer(nodes) {
  const raw = `
    type ${nodes
      .map(({ name, content }) => {
        return `${name} = ${content}`;
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
