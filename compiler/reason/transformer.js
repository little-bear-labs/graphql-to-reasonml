const constants = require('../constants');
const { lowerFirstChar } = require('../util');

const ContextVariable = `'ctx`;

const typeTransformers = {
  [constants.PolymorphicVariant]: transformPolymorphicVariant,
  [constants.InputObject]: transformInputObject,
  [constants.Object]: transformObject,
};

function transformPolymorphicVariant(node) {
  const content =
    '[' +
    node.variants
      .map(({ value, comment }) => {
        let str = '';
        if (comment) {
          str += ` /* ${comment} */ \n`;
        }
        return str + `[@bs.as "${value}"] ` + '`' + value;
      })
      .join('|') +
    ']';

  return {
    kind: constants.KindVariant,
    name: node.name,
    content,
    comment: node.comment,
  };
}

function unwrapNamedNode(node, namedNodes) {
  if (node.kind === constants.PolymorphicVariant) {
    // we want to accurately cast the types so variants are strings
    // until the helper methods are used to cast them.
    return 'string';
  }

  const nodeType = namedNodes[node.name];
  return nodeType && nodeType.internalType ?
    nodeType.internalType :
    lowerFirstChar(node.name);
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


  // XXX: Lists are easier to use so we chose them over an array.
  const concreteType = node.list ? `list(${reasonType})` : reasonType;
  // TODO: Use option somehow instead of nullable
  return node.nullable ? `Js.nullable(${concreteType})` : concreteType;
}

function resolveArguments(node, namedNodes) {
  const args = (node.arguments || [])
    .map(argument => {
      const typeSignature = resolveProperty(argument.type, namedNodes);
      // Even if argument is optional reasonml must handle it.
      return `${argument.comment ? `/* ${argument.comment} */` : ''} ~${
        argument.name
      }:${typeSignature}`;
    })

  args.push(ContextVariable);

  return `(${args.join(', ')})`;
}

function resolveMethod(node, externalTypes, namedNodes) {
  const type = node.returnType ?
    resolveProperty(node.returnType, namedNodes) :
    resolveProperty(node, namedNodes);

  return `${resolveArguments(node, namedNodes)} => ${type}`;
}

function resolveInputField(node, externalTypes, namedNodes) {
  return `
    ${node.comment ? `/* ${node.comment} */` : ''}
    "${node.name}": ${
    node.kind === constants.ObjectProperty
      ? resolveProperty(node, namedNodes)
      : resolveMethod(node, externalTypes, namedNodes)
  }
  `;
}

function resolveObjectField(node, externalTypes, namedNodes) {
  return `
    ${node.comment ? `/* ${node.comment} */` : ''}
    "${node.name}": ${resolveMethod(node, externalTypes, namedNodes)
  }
  `;
}

function flattenInputFields(node, externalTypes, namedNodes) {
  return node.fields
    .map(node => {
      return resolveInputField(node, externalTypes, namedNodes);
    })
    .join(', ');
}

function flattenObjectFields(node, externalTypes, namedNodes) {
  return node.fields
    .map(node => {
      return resolveObjectField(node, externalTypes, namedNodes);
    })
    .join(', ');
}

function transformInputObject(node, externalTypes, namedNodes) {
  return {
    kind: constants.KindType,
    name: lowerFirstChar(node.name),
    content: `{ . ${flattenInputFields(node, externalTypes, namedNodes)} }`,
    comment: node.comment,
  };
}

function transformObject(node, externalTypes, namedNodes) {
  return {
    kind: constants.KindType,
    name: lowerFirstChar(node.name),
    content: `{ . ${flattenObjectFields(node, externalTypes, namedNodes)} }`,
    comment: node.comment,
    args: [ContextVariable],
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
    }
    return typeTransformers[node.kind](node, internalTypes, namedNodes);
  });
}

module.exports = transformer;
