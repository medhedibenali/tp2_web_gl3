import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "http";
import { Query } from "./resolvers";
import fs from "fs";
import path from "path";
import { db } from "./db";

export const schema = createSchema({
  typeDefs: fs.readFileSync(
    path.join(__dirname, "schema/schema.graphql"),
    "utf-8"
  ),
  resolvers: {
    Query,
  },
});

function main() {
  const yoga = createYoga({ schema, context: { db } as any });
  const server = createServer(yoga);
  server.listen(4000, () => {
    console.info("Server is running on http://localhost:4000/graphql");
  });
}

main();
