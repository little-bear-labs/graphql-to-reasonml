const fs = require('fs');
const graphql = require('graphql');
const gql = require('graphql-tag');
const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./fixtures/simple_test.bs.js').resolvers;

describe('executable schema', () => {
  const schema = fs.readFileSync(
    __dirname + '/fixtures/simple.graphql',
    'utf8',
  );

  it('should be executable', async () => {
    const executableSchema = makeExecutableSchema({
      typeDefs: schema,
      resolvers,
    });

    const query = gql`
      query getUser {
        user {
          name
          email
        }
      }
    `;

    const result = await graphql.execute({
      schema: executableSchema,
      document: query,
    });

    expect(result).toMatchObject({
      data: {
        user: {
          name: 'foo',
          email: 'foo',
        },
      },
    });
  });
});
