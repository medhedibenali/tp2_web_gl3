import { GraphQLError } from "graphql";
import { CV_ADDED, CV_DELETED, CV_UPDATED } from "../events";
import {
  AddCvInput,
  Context,
  CvSkill,
  Db,
  Input,
  UpdateCvInput,
} from "../types";

function verifyUser(user: string | undefined, db: Db) {
  if (user && !db.users.some(({ id }) => id === user)) {
    throw new GraphQLError("User does not exist");
  }
}

function createCvSkills(
  cv: string,
  skills: string[] | undefined,
  db: Db,
): CvSkill[] | null {
  if (!skills) {
    return null;
  }

  const cvSkills: CvSkill[] = [];

  // Check if all skills exist
  if (skills.length === 0) {
    return cvSkills;
  }

  const uniqueSkills = skills.filter((value, index, array) =>
    array.indexOf(value) === index
  );

  const allSkillsExist = uniqueSkills.every((id) =>
    db.skills.some((skill) => skill.id === id)
  );

  if (!allSkillsExist) {
    throw new GraphQLError("One or more skills do not exist");
  }

  cvSkills.push(...uniqueSkills.map((skill) => ({ cv, skill })));

  return cvSkills;
}

export const Mutation = {
  addCv: (
    _parent: unknown,
    { input }: Input<AddCvInput>,
    { db, pubSub }: Context,
  ) => {
    const { user, skills, ...data } = input;

    verifyUser(user, db);

    const cv = crypto.randomUUID();
    const cvSkills: CvSkill[] = createCvSkills(cv, skills, db)!;

    // Create a new CV
    const newCv = {
      id: cv,
      ...data,
      user,
    };

    db.cvs.push(newCv);
    db.cv_skills.push(...cvSkills);

    pubSub.publish(CV_ADDED, newCv);

    // Make sure to return the new CV including user data correctly
    return newCv;
  },

  updateCv: (
    _parent: unknown,
    { input }: Input<UpdateCvInput>,
    { db, pubSub }: Context,
  ) => {
    const { id, user, skills, ...data } = input;

    // Find the CV
    const cvIndex = db.cvs.findIndex((cv) => cv.id === id);
    if (cvIndex === -1) {
      throw new GraphQLError("CV not found");
    }

    verifyUser(user, db);

    const cvSkills: CvSkill[] | null = createCvSkills(id, skills, db);

    // Update the CV
    const updatedCv = {
      ...db.cvs[cvIndex],
      ...data,
    };

    if (user) {
      updatedCv.user = user;
    }

    db.cvs[cvIndex] = updatedCv;

    if (cvSkills) {
      db.cv_skills = db.cv_skills.filter((cvSkill) => cvSkill.cv === id);
      db.cv_skills.push(...cvSkills);
    }

    pubSub.publish(CV_UPDATED, updatedCv);

    return updatedCv;
  },

  deleteCv: (
    _parent: unknown,
    { id }: { id: string },
    { db, pubSub }: Context,
  ) => {
    const cvIndex = db.cvs.findIndex((cv) => cv.id === id);

    if (cvIndex === -1) {
      throw new Error("CV not found");
    }

    const [cv] = db.cvs.splice(cvIndex, 1);
    db.cv_skills = db.cv_skills.filter((cvSkill) => cvSkill.cv !== cv.id);

    pubSub.publish(CV_DELETED, cv);

    return cv;
  },
};

