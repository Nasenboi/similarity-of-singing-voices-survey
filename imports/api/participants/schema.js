import ISO6391 from "iso-639-1";
import SimpleSchema from "simpl-schema";
import {dbMetadataSchema} from "../collection/schema";

// -- Demographics --

export const GENDER_OPTIONS = ["male", "female", "nonbinary", "noAnswer"];

export const getGenderOptions = (t) => {
  const options = [];
  GENDER_OPTIONS.map((g) =>
    options.push({
      label: t(`Collections.Participants.Demographics.Genders.${g}`),
      value: g,
    }),
  );
  return options;
};

export const EDUCATION_OPTIONS = [
  "lessThanHighSchool",
  "highSchoolDiploma",
  "someCollege",
  "bachelorsDegree",
  "mastersDegree",
  "doctorateOrHigher",
];

export const getEducationOptions = (t) => {
  const options = [];
  EDUCATION_OPTIONS.map((g) =>
    options.push({
      label: t(`Collections.Participants.Demographics.Educations.${g}`),
      value: g,
    }),
  );
  return options;
};

export const OCCUPATION_OPTIONS = ["student", "university", "fullTime", "partTime", "selfEmployed", "unemployed", "retired"];

export const getOccupationOptions = (t) => {
  const options = [];
  OCCUPATION_OPTIONS.map((g) =>
    options.push({
      label: t(`Collections.Participants.Demographics.Occupations.${g}`),
      value: g,
    }),
  );
  return options;
};

export const AGE_MIN = 5;
export const AGE_MAX = 99;

export const getLanguageOptions = () =>
  ISO6391.getAllCodes().map((code) => ({
    value: code,
    label: ISO6391.getNativeName(code),
  }));

export const participantDemographicsSchema = new SimpleSchema({
  age: {type: SimpleSchema.Integer, optional: true},
  education: {type: String, allowedValues: EDUCATION_OPTIONS, optional: true},
  occupation: {type: String, allowedValues: OCCUPATION_OPTIONS, optional: true},
  gender: {type: String, allowedValues: GENDER_OPTIONS, optional: true},
  nativeLanguage: {type: String, allowedValues: ISO6391.getAllCodes(), optional: true},
});

// -- Gold-MSI and Audio --

export const PLAYBACK_OPTIONS = ["inEar", "overEar", "phone", "speakers"];

export const getPlaybackOptions = (t) => {
  const options = [];
  PLAYBACK_OPTIONS.map((g) =>
    options.push({
      label: t(`Collections.Participants.GoldMSI.Playback.${g}`),
      value: g,
    }),
  );
  return options;
};

export const GENRE_OPTIONS = [
  "60s",
  "70s",
  "80s",
  "90s",
  "acidjazz",
  "alternative",
  "alternativerock",
  "ambient",
  "atmospheric",
  "blues",
  "bluesrock",
  "bossanova",
  "breakbeat",
  "celtic",
  "chanson",
  "chillout",
  "choir",
  "classical",
  "classicrock",
  "club",
  "contemporary",
  "country",
  "dance",
  "darkambient",
  "darkwave",
  "deephouse",
  "disco",
  "downtempo",
  "drumnbass",
  "dub",
  "dubstep",
  "easylistening",
  "edm",
  "electronic",
  "electronica",
  "electropop",
  "ethno",
  "eurodance",
  "experimental",
  "folk",
  "funk",
  "fusion",
  "groove",
  "grunge",
  "hard",
  "hardrock",
  "hiphop",
  "house",
  "idm",
  "improvisation",
  "indie",
  "industrial",
  "instrumentalpop",
  "instrumentalrock",
  "jazz",
  "jazzfusion",
  "latin",
  "lounge",
  "medieval",
  "metal",
  "minimal",
  "newage",
  "newwave",
  "orchestral",
  "pop",
  "popfolk",
  "poprock",
  "postrock",
  "progressive",
  "psychedelic",
  "punkrock",
  "rap",
  "reggae",
  "rnb",
  "rock",
  "rocknroll",
  "singersongwriter",
  "soul",
  "soundtrack",
  "swing",
  "symphonic",
  "synthpop",
  "techno",
  "trance",
  "triphop",
  "world",
  "worldfusion",
];

export const getGenreOptions = (t) => {
  const options = [];
  GENRE_OPTIONS.map((g) =>
    options.push({
      label: t(`Collections.Participants.GoldMSI.Genres.${g}`),
      value: g,
    }),
  );
  return options;
};

export const participantGoldMSISchema = new SimpleSchema({
  playback: {type: String, allowedValues: PLAYBACK_OPTIONS, optional: true},
  genre1: {type: String, allowedValues: GENRE_OPTIONS, optional: true},
  genre2: {type: String, allowedValues: GENRE_OPTIONS, optional: true},
  genre3: {type: String, allowedValues: GENRE_OPTIONS, optional: true},
  gmsi1: {type: Number, min: 1, max: 7, optional: true},
  gmsi2: {type: Number, min: 1, max: 7, optional: true},
  gmsi3: {type: Number, min: 1, max: 7, optional: true},
  gmsi4: {type: Number, min: 1, max: 7, optional: true},
  gmsi5: {type: Number, min: 1, max: 7, optional: true},
  gmsi6: {type: Number, min: 1, max: 7, optional: true},
  gmsi7: {type: Number, min: 1, max: 7, optional: true},
});

// -- ParticipantSchema --

export const participantSchema = new SimpleSchema({
  questionnaireID: {type: SimpleSchema.Integer},
  surveyCompleted: {type: Boolean, optional: true, defaultValue: false},
})
  .extend(dbMetadataSchema)
  .extend(participantDemographicsSchema)
  .extend(participantGoldMSISchema);
