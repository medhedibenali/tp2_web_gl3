export interface Cv {
  id: string;
  name: string;
  age: number;
  job: string;
  user: string;
}

export type AddCvInput = Omit<Cv, "id"> & {
  skills: string[];
};

export type UpdateCvInput = Partial<AddCvInput> & {
  id: string;
};
