import {useSurveyAnswersPaginated} from "@/imports/api/surveyAnswers/hooks";
import {SURVEY_ANSWERS} from "@/imports/api/surveyAnswers/methods";
import {useIsLoggedIn} from "@/imports/api/users/hooks";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {DataTable} from "../../customComponents/DataTable";
import {ListPage} from "../../customComponents/ListPage";
import {PageLoading} from "../../customComponents/PageLoading";
import {SurveyAnswerInfoModal} from "./SurveyAnswerInfoModal";
import {SurveyAnswerSearchForm} from "./SurveyAnswerSearchForm";

export default function SurveyAnswerListPage() {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const [surveyAnswerID, setSurveyAnswerID] = useState(null);
  const {t} = useTranslation();
  const [query, setQuery] = useState({});
  const [reloadKey, setReloadKey] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    surveyAnswers,
    pageInfo,
    isLoading: isSurveyAnswersLoading,
  } = useSurveyAnswersPaginated({
    query,
    next,
    previous,
    reloadKey,
  });

  const surveyAnswerColumns = [
    {
      accessorKey: "_id",
      header: t("Collections.DBMetaData._id"),
    },
    {
      accessorKey: "participantID",
      header: t("Collections.SurveyAnswers.participantID"),
    },
    {
      accessorKey: "questionID",
      header: t("Collections.SurveyAnswers.questionID"),
    },
    {
      accessorKey: "answer",
      header: t("Collections.SurveyAnswers.answer"),
    },
    {
      accessorKey: "backgroundMusic",
      header: t("Collections.SurveyAnswers.backgroundMusic"),
    },
    {
      accessorKey: "editDate",
      header: t("Collections.DBMetaData.editDate"),
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
    setSurveyAnswerID(null);
  };

  const handlePrevious = () => {
    setPrevious(pageInfo?.prevCursor);
    setNext(null);
    setDialogOpen(false);
    setSurveyAnswerID(null);
  };

  const onRowClick = (row) => {
    setSurveyAnswerID(row._id);
    setDialogOpen(true);
  };

  const onDialogOpen = (open) => {
    setDialogOpen(open);
  };

  if (!isLoggedIn) {
    navigate("/");
    return null;
  }

  if (isSurveyAnswersLoading) {
    return <PageLoading />;
  }

  return (
    <ListPage dialogOpen={dialogOpen} onDialogOpen={onDialogOpen}>
      <SurveyAnswerSearchForm
        onFilterChange={onFilterChange}
        query={query}
        count={pageInfo?.count}
        total={pageInfo?.total}
      />
      <DataTable
        columns={surveyAnswerColumns}
        data={surveyAnswers}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={pageInfo?.hasNext}
        hasPrevious={pageInfo?.hasPrevious}
        onRowClick={onRowClick}
        downloadFilename="surveyAnswers.csv"
        downloadMethod={SURVEY_ANSWERS.downloadCSV}
      />
      <SurveyAnswerInfoModal surveyAnswerID={surveyAnswerID} />
    </ListPage>
  );
}
