import { Cv } from "./cv";
import { CvSkill } from "./cv_skill";
import { Skill } from "./skill";
import { User } from "./user";

export interface Db {
  cv_skills: CvSkill[];
  cvs: Cv[];
  skills: Skill[];
  users: User[];
}
