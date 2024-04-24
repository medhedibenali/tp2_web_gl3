export interface AddCvInput {
    name: string;
    age: number;
    job: string;
    userId: string;
    skillids: string[];
  }
  
  export interface Skill {
    id: string;
    name: string;
  }

  export interface UpdateCvInput {
    id: string;
    name: string;
    age: number;
    job: string;
    userId: string;
    skillids: string[];
  }
  
  export const Mutation = {
    addCv: (parent: any, args : { input : AddCvInput} , { db }: any, info: any) => {
      const { name, age, job, userId, skillids } = args.input;
      const user = db.users.find((user:any) => user.id === userId);
      if (!user) {
        throw new Error("User does not exist");
      }
    
      // Check if all skills exist
      if (skillids.length > 0) {
        const allSkillsExist = skillids.every(id => db.skills.some((skill:any) => skill.id === id));
        if (!allSkillsExist) {
          throw new Error("One or more skills do not exist");
        }
      }
    
      // Create a new CV
      const newCv = {
        id: Date.now().toString(),
        name,
        age,
        job,
        user: userId,
        skills: skillids
      };
      db.cvs.push(newCv);
    
      // Make sure to return the new CV including user data correctly
      console.log(db);
      return {
        ...newCv,
        ...user,
        role: user.role === "admin" ? "ADMIN" : "USER",
        skills: skillids.map(id => db.skills.find((skill:any) => skill.id === id))
      };
    }
  ,  
    
    updateCv: async (parent: any, args : { input : UpdateCvInput} , { db }: any, info: any) => {
      const { id, name, age, job, userId, skillids } = args.input;
  
      // Find the CV
      const cvIndex = db.cvs.findIndex((cv:any) => cv.id === id);
      if (cvIndex === -1) {
        throw new Error("CV not found");
      }
  
      // Validate user and skills as in addCv
      const userExists = db.users.some((user:any) => user.id === userId);
      if (!userExists) {
        throw new Error("User does not exist");
      }
  
      const allSkillsExist = skillids && skillids.every(id => db.skills.some((skill:any) => skill.id === id));
      if (skillids && !allSkillsExist) {
        throw new Error("One or more skills do not exist");
      }
  
      // Update the CV
      const updatedCv = { ...db.cvs[cvIndex], name, age, job, user: userId, skills: skillids };
      db.cvs[cvIndex] = updatedCv;
      return updatedCv;
    },
  
    deleteCv: async (parent: any, args : { id : String} , { db }: any, info: any) => {
      const cvIndex = db.cvs.findIndex((cv:any) => cv.id === args.id);
      if (cvIndex === -1) {
        throw new Error("CV not found");
      }
      db.cvs.splice(cvIndex, 1);
      console.log(db);
      return `CV with id ${args.id} was deleted successfully.`;
    }
  };
 