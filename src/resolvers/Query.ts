import { GraphQLError } from "graphql";

export const Query = {
  hello: () => "Hello GL3",
  getCvs: (parent: any, args: any, { db }: any, info: any) => {
    return db.cvs;
  },
  getCvById: (parent: any, { id }: {id:string}, { db }: any, info: any) => {
    const cv = db.cvs.find((cv: any) => cv.id === id);
    if (!cv) {
      throw new GraphQLError(` the cv you demanded of the id ${id} does not exist `);
    }
    return cv;
  },
};


