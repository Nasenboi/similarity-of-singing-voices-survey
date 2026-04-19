import {useQuestionnairesPaginated} from "@/imports/api/surveyQuestions/hooks";
import {useIsLoggedIn} from "@/imports/api/users/hooks";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {DataTable, ROW_COLOR_STRINGS} from "../../customComponents/DataTable";
import {ListPage} from "../../customComponents/ListPage";
import {PageLoading} from "../../customComponents/PageLoading";
import {QuestionnaireSearchForm} from "./QuestionnaireSearchForm";

export default function QuestionnaireListPage() {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [query, setQuery] = useState({});
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const {
    questionnaires,
    pageInfo,
    isLoading: isQuestionnairesLoading,
  } = useQuestionnairesPaginated({
    query,
    next,
    previous,
  });

  const questionnaireColumns = [
    {
      accessorKey: "questionnaireID",
      header: t("Collections.SurveyQuestions.questionnaireID"),
    },
    {
      accessorKey: "participantCount",
      header: t("Collections.SurveyQuestions.Questionnaires.participantCount"),
    },
    {
      accessorKey: "questionsSkipped",
      header: t("Collections.SurveyQuestions.Questionnaires.questionsSkipped"),
    },
  ];

  const onFilterChange = (value) => {
    setQuery(value);
    setNext(null);
    setPrevious(null);
  };

  const handleNext = () => {
    setNext(pageInfo?.nextCursor);
    setPrevious(null);
  };

  const handlePrevious = () => {
    setPrevious(pageInfo?.prevCursor);
    setNext(null);
  };

  const setRowColor = (row) => {
    if (row.skip) {
      return ROW_COLOR_STRINGS.red;
    } else if (row.participantCount === 0) {
      return ROW_COLOR_STRINGS.yellow;
    }
  };

  if (!isLoggedIn) {
    navigate("/");
    return null;
  }

  if (isQuestionnairesLoading) {
    return <PageLoading />;
  }

  return (
    <ListPage>
      <QuestionnaireSearchForm
        onFilterChange={onFilterChange}
        query={query}
        count={pageInfo?.count}
        total={pageInfo?.total}
      />
      <DataTable
        columns={questionnaireColumns}
        data={questionnaires}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={pageInfo?.hasNext}
        hasPrevious={pageInfo?.hasPrevious}
        setRowColor={setRowColor}
      />
    </ListPage>
  );
}
