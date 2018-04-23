const constants = require('../constants');
const KindType = 'Type';

function lowerFirstChar(input) {
  return input[0].toLowerCase() + input.slice(1);
}

const typeTransformers = {
  [constants.PolymorphicVariant]: transformPolymorphicVariant,
  [constants.InputObject]: transformObject,
  [constants.Object]: transformObject,
};

function transformPolymorphicVariant(node) {
  const name = lowerFirstChar(node.name);
  const content =
    '[' +
    node.variants
      .map(({ value, comment }) => {
        let str = '';
        if (comment) {
          str += ` /* ${comment} */ \n`;
        }
        return str + '`' + value;
      })
      .join('|') +
    ']';

  return {
    kind: KindType,
    name,
    content,
  };
}

function unwrapNamedNode(node, namedNodes) {
  // return a reference to the type we will create elsewhere.
  return lowerFirstChar(node.name);
}

function resolveInputFieldType(node, namedNodes) {
  switch (node.type) {
    case 'Boolean':
      return 'bool';
    case 'String':
      return 'string';
    case 'Int':
      return 'int';
    case 'Float':
      return 'float';
    case 'ID':
      return 'string';
    default:
      if (!namedNodes[node.type]) {
        throw new Error(`Undefined graphql type: ${node.type}`);
      }
      return unwrapNamedNode(namedNodes[node.type], namedNodes);
  }
}

function resolveProperty(node, namedNodes) {
  const reasonType = resolveInputFieldType(node, namedNodes);
  const concreteType = node.list ? `array(${reasonType})` : reasonType;
  return node.nullable ? `option(${concreteType})` : concreteType;
}

function resolveMethod(node, externalTypes, namedNodes) {
  const type = resolveProperty(node.returnType, namedNodes);
  const args = node.arguments
    .map(argument => {
      const typeSignature = resolveProperty(argument.type, namedNodes);
      const optional = argument.type.nullable ? ' = ?' : '';
      return `${argument.comment ? `/* ${argument.comment} */` : ''} ~${
        argument.name
      }:${typeSignature}${optional}`;
    })
    .join(', ');

  return `(${args}, unit) => ${type}`;
}

function resolveInputField(node, externalTypes, namedNodes) {
  return `
    ${node.comment ? `/* ${node.comment} */` : ''}
    ${node.name}: ${
    node.kind === constants.ObjectProperty
      ? resolveProperty(node, namedNodes)
      : resolveMethod(node, externalTypes, namedNodes)
  }
  `;
}

function flattenFields(node, externalTypes, namedNodes) {
  return node.fields
    .map(node => {
      return resolveInputField(node, externalTypes, namedNodes);
    })
    .join(', ');
}

function transformObject(node, externalTypes, namedNodes) {
  return {
    kind: KindType,
    name: lowerFirstChar(node.name),
    content: `{ ${flattenFields(node, externalTypes, namedNodes)} }`,
  };
}

function transformer(transformed) {
  // map types to internal types when available.
  const internalTypes = transformed.reduce(
    (sum, { name, internalType }) => ({
      ...sum,
      [name]: internalType,
    }),
    {},
  );

  const namedNodes = transformed.reduce(
    (sum, node) => ({
      ...sum,
      [node.name]: node,
    }),
    {},
  );

  return transformed.map(node => {
    if (!typeTransformers[node.kind]) {
      throw new Error(`Printer not implemented for: ${node.kind}`);
      return null;
    }
    return typeTransformers[node.kind](node, internalTypes, namedNodes);
  });
}

module.exports = transformer;
