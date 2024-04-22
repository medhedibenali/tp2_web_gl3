export const Query = {
  hello: () => "Hello GL3",
  getAllCvs: (parent: any, args: any, { db }: any, info: any) => {
    return db.cvs;
  },
  getCvById: (parent: any, { id }: any, { db }: any, info: any) => {
    const cv = db.cvs.find((cv: any) => cv.id === id);
    if (!cv || cv === undefined) {
      throw new Error(` the cv you demanded of the id ${id} does not exist `);
    }
    return cv;
  },
};


