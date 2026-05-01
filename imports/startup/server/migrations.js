import {resetQuestionnaires} from "@/imports/api/surveyQuestions/helpers";
import {renameCollectionIfNeeded} from "@/imports/api/utils";

Migrations.add({
  version: 1,
  name: "Initial migration, no-op",
  up() {},
  down() {},
});

Migrations.add({
  version: 2,
  name: "Rename QuestionnaireStats collection to questionnaires",
  async up() {
    await renameCollectionIfNeeded("questionnaireStats", "questionnaires");
    await resetQuestionnaires();
  },
  async down() {
    await renameCollectionIfNeeded("questionnaires", "QuestionnaireStats");
  },
});
