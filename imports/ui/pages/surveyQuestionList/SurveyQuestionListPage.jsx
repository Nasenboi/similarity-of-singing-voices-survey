import {Dialog} from "@/components/ui/dialog";
import {Spinner} from "@/components/ui/spinner";
import {useSurveyQuestionsPaginated} from "@/imports/api/surveyQuestions/hooks";
import {useIsLoggedIn} from "@/imports/api/users/hooks";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AudioPlayer} from "../../customComponents/AudioPlayer";
import {DataTable} from "../../customComponents/DataTable";
import {SurveyQuestionInfoModal} from "./SurveyQuestionInfoModal";
import {SurveyQuestionSearchForm} from "./SurveyQuestionSearchForm";

export function SurveyQuestionListPage() {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const [surveyQuestionID, setSurveyQuestionID] = useState(null);
  const {t} = useTranslation();
  const [query, setQuery] = useState({});
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
  });

  const surveyQuestionColumns = [
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

  const onDialogOpen = (open) => {
    setDialogOpen(open);
  };

  if (!isLoggedIn) {
    navigate("/");
    return null;
  }

  if (isSurveyQuestionsLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner className="w-40 h-40" />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen max-w-screen max-h-screen flex flex-col justify-center items-center">
      <div className="w-full flex flex-col justify-between items-center overflow-scroll md:overflow-hidden">
        <Dialog open={dialogOpen} onOpenChange={(open) => onDialogOpen(open)}>
          <div className="py-24 md:max-w-300 w-full h-full">
            <SurveyQuestionSearchForm onFilterChange={onFilterChange} query={query} />
            <DataTable
              columns={surveyQuestionColumns}
              data={surveyQuestions}
              onNext={handleNext}
              onPrevious={handlePrevious}
              hasNext={pageInfo?.hasNext}
              hasPrevious={pageInfo?.hasPrevious}
              onRowCLick={onRowClick}
            />
          </div>
          <div className="w-full h-24" />
          <SurveyQuestionInfoModal surveyQuestionID={surveyQuestionID} />
        </Dialog>
      </div>
      <div className="fixed bottom-0 max-w-500 w-full flex items-center">
        <AudioPlayer />
      </div>
    </div>
  );
}
