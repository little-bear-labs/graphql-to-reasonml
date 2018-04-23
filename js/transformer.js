const { getLocation, parse } = require('graphql/language');
const constants = require('./constants');

const RecordDirective = 'bsRecord';

const transformers = {
  EnumTypeDefinition,
  ObjectTypeDefinition,
  InputObjectTypeDefinition,
};

function extractComment(node) {
  return node && node.description && node.description.value;
}

function extractName(node) {
  return node && node.name && node.name.value;
}

function extractInternalType(node) {
  if (!node.directives.length) {
    return null;
  }
  const record = node.directives.find(directive => {
    const name = extractName(directive);
    return name === RecordDirective;
  });

  if (!record) {
    return null;
  }

  return record.arguments[0].value.value;
}

function resolveType(type, state = {}) {
  if (!type) return state;
  switch (type.kind) {
    case 'ListType':
      return { ...resolveType(type.type), list: true };
    case 'NonNullType':
      return { ...resolveType(type.type), nullable: false };
    case 'NamedType':
      return {
        nullable: true,
        type: type.name.value,
        ...resolveType(type.type),
      };
    default:
      return state;
  }
}

function resolveMethod(field) {
  return {
    name: extractName(field),
    comment: extractComment(field),
    returnType: resolveType(field.type),
    arguments: field.arguments.map(argument => {
      return {
        name: extractName(argument),
        comment: extractComment(argument),
        type: resolveType(argument.type),
      };
    }),
  };
}

function InputObjectTypeDefinition(node) {
  return {
    ...ObjectTypeDefinition(node),
    kind: constants.InputObject,
  };
}

function ObjectTypeDefinition(node) {
  return {
    kind: constants.Object,
    name: extractName(node),
    comment: extractComment(node),
    internalType: extractInternalType(node),
    fields: node.fields.map(field => {
      return {
        name: extractName(field),
        comment: extractComment(field),
        ...(field.arguments && field.arguments.length
          ? { kind: constants.ObjectMethod, ...resolveMethod(field) }
          : { kind: constants.ObjectProperty, ...resolveType(field.type) }),
      };
    }),
  };
}

function EnumTypeDefinition(node) {
  return {
    kind: constants.PolymorphicVariant,
    name: extractName(node),
    comment: extractComment(node),
    variants: node.values.map(variant => {
      return {
        kind: constants.PolymorphicVariantValue,
        value: extractName(variant),
        comment: extractComment(variant),
      };
    }),
  };
}

function startAndEndLines(source, loc) {
  const start = getLocation(source, loc.start);
  const end = getLocation(source, loc.end);
  return `${start.line}:${start.column} - ${end.line}:${end.column}`;
}

function transform(source) {
  const doc = parse(source);
  return doc.definitions.map(node => {
    const transformer = transformers[node.kind];
    if (transformer) {
      try {
        return transformer(node);
      } catch (err) {
        throw new Error(
          `Failed to transform node: (${startAndEndLines(source, node.loc)}) ${
            err.stack
          }`,
        );
      }
    }
    throw new Error(`Unhandled node type: ${node.kind}`);
  });
}

module.exports = transform;
