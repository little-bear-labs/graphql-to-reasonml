const fs = require('fs');
const graphqlLang = require('graphql/language');
const subject = require('../js/transformer');
const reasonTransformer = require('../js/reason/transformer');
const reasonPrinter = require('../js/reason/printer');

describe('transformer', () => {
  describe('simple', () => {
    it('should parse', () => {
      const raw = fs.readFileSync(
        __dirname + '/fixtures/simple.graphql',
        'utf8',
      );
      const source = new graphqlLang.Source(raw);
      const transformed = subject(source);
      const reason = reasonTransformer(transformed);
      const printed = reasonPrinter(reason);
      console.log(printed);
    });
  });
});
