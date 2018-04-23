const fs = require('fs');
const graphqlLang = require('graphql/language');
const subject = require('../js/transformer');
const reasonTransformer = require('../js/reason/transformer');
const reasonPrinter = require('../js/reason/printer');

describe('transformer', () => {
  const fixtures = fs
    .readdirSync(__dirname + '/fixtures')
    .filter(value => {
      return /\.graphql$/.test(value);
    })
    .map(fileName => {
      return fileName.split('.')[0];
    })
    .forEach(fixture => {
      describe(fixture, () => {
        it('should match re fixture', () => {
          const expected = fs.readFileSync(
            __dirname + `/fixtures/${fixture}.re`,
            'utf8',
          );
          const raw = fs.readFileSync(
            __dirname + `/fixtures/${fixture}.graphql`,
            'utf8',
          );
          const source = new graphqlLang.Source(raw);
          const transformed = subject(source);
          const reason = reasonTransformer(transformed);
          const printed = reasonPrinter(reason);
          console.log(printed);
          expect(printed).toEqual(expected);
        });
      });
    });
});
