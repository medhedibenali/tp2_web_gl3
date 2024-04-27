export const Cv = {
  skills: ({ id }: { id: string }, args: any, { db }: any) => {
    let cvskill: string[];
    let skillids: string[] = [];
    cvskill = db.cv_skills.filter((cvskill: any) => cvskill.cv === id);
    cvskill.forEach((skillid: any) => {
      skillids.push(skillid.skill); // an array of strings that stores the cv' skills ids
    });
    return db.skills.filter((skill: any) => skillids.includes(skill.id));
  },

  user: ({ user }: { user: string }, args: any, { db }: any) => {
    const userByCv = db.users.find((u: any) => u.id === user);
    userByCv.role = userByCv.role === "admin" ? "ADMIN" : "USER"; //to match the roles enum
    return userByCv;
  },
};

export const DeletedCv = {
  user: Cv.user,
};
