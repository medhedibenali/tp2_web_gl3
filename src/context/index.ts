import { createPubSub } from "graphql-yoga";
import { db } from "../db"

export const context = {
  db,
  pubSub: createPubSub(),
};
