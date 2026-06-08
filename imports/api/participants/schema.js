import ISO6391 from "iso-639-1";
import SimpleSchema from "simpl-schema";
import {dbMetadataSchema} from "../collection/schema";

export const GENDER_OPTIONS = ["male", "female", "nonbinary", "noAnswer"];
export const EDUCATION_OPTIONS = [
  "lessThanHighSchool",
  "highSchoolDiploma",
  "someCollege",
  "bachelorsDegree",
  "mastersDegree",
  "doctorateOrHigher",
];
export const AGE_MIN = 5;
export const AGE_MAX = 99;

export const getGenderOptions = (t) => {
  const options = [];
  GENDER_OPTIONS.map((g) =>
    options.push({
      label: t(`Collections.Participants.Genders.${g}`),
      value: g,
    }),
  );
  return options;
};

export const getEducationOptions = (t) => {
  const options = [];
  EDUCATION_OPTIONS.map((g) =>
    options.push({
      label: t(`Collections.Participants.Educations.${g}`),
      value: g,
    }),
  );
  return options;
};

export const getLanguageOptions = () =>
  ISO6391.getAllCodes().map((code) => ({
    value: code,
    label: ISO6391.getNativeName(code),
  }));

export const participantDemographicsSchema = new SimpleSchema({
  age: {type: SimpleSchema.Integer, optional: true},
  education: {type: String, allowedValues: EDUCATION_OPTIONS, optional: true},
  gender: {type: String, allowedValues: GENDER_OPTIONS, optional: true},
  nativeLanguage: {type: String, allowedValues: ISO6391.getAllCodes(), optional: true},
});

export const participantSchema = new SimpleSchema({
  questionnaireID: {type: SimpleSchema.Integer},
  surveyCompleted: {type: Boolean, optional: true, defaultValue: false},
})
  .extend(dbMetadataSchema)
  .extend(participantDemographicsSchema);
