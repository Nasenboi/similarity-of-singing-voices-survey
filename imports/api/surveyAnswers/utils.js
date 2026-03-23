export function transformSurveyAnswerToCSVRow(surveyAnswer) {
  const {answer, ...rest} = surveyAnswer;

  return {
    ...rest,
    answer_1: answer[0],
    answer_2: answer[1],
  };
}
