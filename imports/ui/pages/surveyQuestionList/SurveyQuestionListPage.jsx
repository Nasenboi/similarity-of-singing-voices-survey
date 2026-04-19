import {useSurveyQuestionsPaginated} from "@/imports/api/surveyQuestions/hooks";
import {SURVEY_QUESTIONS} from "@/imports/api/surveyQuestions/methods";
import {useIsLoggedIn} from "@/imports/api/users/hooks";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {DataTable, ROW_COLOR_STRINGS} from "../../customComponents/DataTable";
import {ListPage} from "../../customComponents/ListPage";
import {PageLoading} from "../../customComponents/PageLoading";
import {SurveyQuestionInfoModal} from "./SurveyQuestionInfoModal";
import {SurveyQuestionSearchForm} from "./SurveyQuestionSearchForm";

export default function SurveyQuestionListPage() {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const [surveyQuestionID, setSurveyQuestionID] = useState(null);
  const {t} = useTranslation();
  const [query, setQuery] = useState({});
  const [reloadKey, setReloadKey] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    surveyQuestions,
    pageInfo,
    isLoading: isSurveyQuestionsLoading,
  } = useSurveyQuestionsPaginated({
    query,
    next,
    previous,
    reloadKey,
  });

  const surveyQuestionColumns = [
    {
      accessorKey: "_id",
      header: t("Collections.DBMetaData._id"),
    },
    {
      accessorKey: "questionnaireID",
      header: t("Collections.SurveyQuestions.questionnaireID"),
    },
    {
      accessorKey: "questionNumber",
      header: t("Collections.SurveyQuestions.questionNumber"),
    },
  ];

  const onFilterChange = (value) => {
    setQuery(value);
    setNext(null);
    setPrevious(null);
    setReloadKey((prev) => prev + 1);
  };

  const handleNext = () => {
    setNext(pageInfo?.nextCursor);
    setPrevious(null);
    setDialogOpen(false);
    setSurveyQuestionID(null);
  };

  const handlePrevious = () => {
    setPrevious(pageInfo?.prevCursor);
    setNext(null);
    setDialogOpen(false);
    setSurveyQuestionID(null);
  };

  const onRowClick = (row) => {
    setSurveyQuestionID(row._id);
    setDialogOpen(true);
  };

  const setRowColor = (row) => {
    if (row.skip) {
      return ROW_COLOR_STRINGS.red;
    }
  };

  const onDialogOpen = (open) => {
    setDialogOpen(open);
  };

  if (!isLoggedIn) {
    navigate("/");
    return null;
  }

  if (isSurveyQuestionsLoading) {
    return <PageLoading />;
  }

  return (
    <ListPage dialogOpen={dialogOpen} onDialogOpen={onDialogOpen}>
      <SurveyQuestionSearchForm
        onFilterChange={onFilterChange}
        query={query}
        count={pageInfo?.count}
        total={pageInfo?.total}
      />
      <DataTable
        columns={surveyQuestionColumns}
        data={surveyQuestions}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={pageInfo?.hasNext}
        hasPrevious={pageInfo?.hasPrevious}
        onRowClick={onRowClick}
        setRowColor={setRowColor}
        downloadFilename="surveyQuestions.csv"
        downloadMethod={SURVEY_QUESTIONS.downloadCSV}
      />
      <SurveyQuestionInfoModal surveyQuestionID={surveyQuestionID} />
    </ListPage>
  );
}
