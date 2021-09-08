import { Application, Router, RouterContext } from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import { applyGraphQL, gql, GQLError } from 'https://deno.land/x/oak_graphql@0.6.2/mod.ts';

import { users } from './data.ts';

const app = new Application();

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get('X-Response-Time');
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set('X-Response-Time', `${ms}ms`);
});

const types = gql`
  type User {
    id: ID
    firstName: String
    lastName: String
  }

  type Query {
    users: [User]
    user(id: ID): User
  }

  type Mutation {
    addUser(firstName: String, lastName: String): [User]
  }
`;

const resolvers = {
  Query: {
    users: () => {
      return users;
    },

    user: (_obj: any, { id }: { id: number }, _context: any, _info: any) => {
      const foundUser = users.find((user) => {
        console.log(user);
        return user.id === id;
      });
      return foundUser;
    },
  },

  Mutation: {
    addUser: (
      _obj: any,
      { firstName, lastName }: { firstName: string; lastName: string },
      _context: any
    ) => {
      const UsersList = [
        ...users,
        {
          id: users[users.length - 1].id + 1,
          firstName,
          lastName,
        },
      ];
      return UsersList;
    },
  },
};

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs: types,
  resolvers: resolvers,
  // context: (ctx: RouterContext) => {
  //   return {}};
  // },
});

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

console.log('Server start at http://localhost:8000');
await app.listen({ port: 8000 });
