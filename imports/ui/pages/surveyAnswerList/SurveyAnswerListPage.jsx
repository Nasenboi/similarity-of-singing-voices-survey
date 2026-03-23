import {Dialog} from "@/components/ui/dialog";
import {Spinner} from "@/components/ui/spinner";
import {useSurveyAnswersPaginated} from "@/imports/api/surveyAnswers/hooks";
import {SURVEY_ANSWERS} from "@/imports/api/surveyAnswers/methods";
import {useIsLoggedIn} from "@/imports/api/users/hooks";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AudioPlayer} from "../../customComponents/AudioPlayer";
import {DataTable} from "../../customComponents/DataTable";
import {DownloadButton} from "../../customComponents/DownLoadButton";
import {SurveyAnswerInfoModal} from "./SurveyAnswerInfoModal";
import {SurveyAnswerSearchForm} from "./SurveyAnswerSearchForm";

export function SurveyAnswerListPage() {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const [surveyAnswerID, setSurveyAnswerID] = useState(null);
  const {t} = useTranslation();
  const [query, setQuery] = useState({});
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
  });

  const surveyAnswerColumns = [
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
          <div className="py-24 md:max-w-300 size-full">
            <SurveyAnswerSearchForm onFilterChange={onFilterChange} query={query} />
            <DataTable
              columns={surveyAnswerColumns}
              data={surveyAnswers}
              onNext={handleNext}
              onPrevious={handlePrevious}
              hasNext={pageInfo?.hasNext}
              hasPrevious={pageInfo?.hasPrevious}
              onRowCLick={onRowClick}
              downloadFilename="surveyAnswers.csv"
              downloadMethod={SURVEY_ANSWERS.downloadCSV}
            />
          </div>
          <div className="w-full h-24" />
          <SurveyAnswerInfoModal surveyAnswerID={surveyAnswerID} />
        </Dialog>
      </div>
      <div className="fixed bottom-0 max-w-500 w-full flex items-center">
        <AudioPlayer />
      </div>
    </div>
  );
}
