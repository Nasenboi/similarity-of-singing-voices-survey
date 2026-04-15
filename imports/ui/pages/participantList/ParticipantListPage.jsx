import {Dialog} from "@/components/ui/dialog";
import {Spinner} from "@/components/ui/spinner";
import {useParticipantsPaginated} from "@/imports/api/participants/hooks";
import {PARTICIPANTS} from "@/imports/api/participants/methods";
import {useIsLoggedIn} from "@/imports/api/users/hooks";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AudioPlayer} from "../../customComponents/AudioPlayer";
import {DataTable} from "../../customComponents/DataTable";
import {ParticipantInfoModal} from "./ParticipantInfoModal";
import {ParticipantSearchForm} from "./ParticipantSearchForm";

export default function ParticipantListPage() {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [query, setQuery] = useState({});
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [participantID, setParticipantID] = useState(null);

  const {
    participants,
    pageInfo,
    isLoading: isParticipantsLoading,
  } = useParticipantsPaginated({
    query,
    next,
    previous,
  });

  const participantColumns = [
    {
      accessorKey: "_id",
      header: t("Collections.DBMetaData._id"),
    },
    {
      accessorKey: "itemNumber",
      header: t("Collections.DBMetaData.itemNumber"),
    },
    {
      accessorKey: "questionnaireID",
      header: t("Collections.SurveyQuestions.questionnaireID"),
    },
    {
      accessorKey: "surveyCompleted",
      header: t("Collections.Participants.surveyCompleted"),
    },
    {
      accessorKey: "createDate",
      header: t("Collections.DBMetaData.createDate"),
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
  };

  const handleNext = () => {
    setNext(pageInfo?.nextCursor);
    setPrevious(null);
    setDialogOpen(false);
  };

  const handlePrevious = () => {
    setPrevious(pageInfo?.prevCursor);
    setNext(null);
    setDialogOpen(false);
  };

  const onRowClick = (row) => {
    setParticipantID(row._id);
    setDialogOpen(true);
  };

  const setRowColor = (row) => {
    if (row.surveyCompleted) {
      return "border-green-500";
    } else if (row._id === participantID) {
      return "border-gray-500";
    }
  };

  const onDialogOpen = (open) => {
    setDialogOpen(open);
  };

  if (!isLoggedIn) {
    navigate("/");
    return null;
  }

  if (isParticipantsLoading) {
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
            <ParticipantSearchForm onFilterChange={onFilterChange} query={query} />
            <DataTable
              columns={participantColumns}
              data={participants}
              onNext={handleNext}
              onPrevious={handlePrevious}
              hasNext={pageInfo?.hasNext}
              hasPrevious={pageInfo?.hasPrevious}
              onRowCLick={onRowClick}
              setRowColor={setRowColor}
              downloadFilename="participants.csv"
              downloadMethod={PARTICIPANTS.downloadCSV}
            />
          </div>
          <div className="w-full h-24" />
          <ParticipantInfoModal participantID={participantID} setDialogOpen={setDialogOpen} />
        </Dialog>
      </div>
      <div className="fixed bottom-0 max-w-500 w-full flex items-center">
        <AudioPlayer />
      </div>
    </div>
  );
}
