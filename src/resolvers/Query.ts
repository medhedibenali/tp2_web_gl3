import { Context } from "../types";

export const Query = {
  hello: () => "Hello GL3",
  getAllCvs: async (parent: any, args: any, { prisma }: Context, info: any) => {
    return await prisma.cv.findMany();
  },
  getCvById: async (
    parent: any,
    { id }: any,
    { prisma }: Context,
    info: any
  ) => {
    const cv = await prisma.cv.findUnique({
      where: {
        id: id,
      },
    });
    if (!cv || cv === undefined) {
      throw new Error(` the cv you demanded of the id ${id} does not exist `);
    }
    return cv;
  },
};
