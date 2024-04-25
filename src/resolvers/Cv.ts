import { Context } from "../types";

export const Cv = {
  skills: async (parent: any, args: any, { prisma }: Context) => {
    const skills = await prisma.cvSkill.findMany({
      where: { cvId: parent.id },
      select: {
        skillId: true,
      },
    });
    const skillIds = skills.map((skill) => skill.skillId);
    const cvSkills = await prisma.skill.findMany({
      where: { id: { in: skillIds } },
    });
    return cvSkills;
  },

  user: async (parent: any, args: any, { prisma }: Context) => {
    const id = parent.userId;
    const userInfo = await prisma.user.findUnique({
      where: { id: id },
    });
    return userInfo;
  },
};
