import {useParticipantsPaginated} from "@/imports/api/participants/hooks";
import {PARTICIPANTS} from "@/imports/api/participants/methods";
import {useIsLoggedIn} from "@/imports/api/users/hooks";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useParticipantContext} from "../../contextProvider/ParticipantContext";
import {DataTable} from "../../customComponents/DataTable";
import {ListPage} from "../../customComponents/ListPage";
import {PageLoading} from "../../customComponents/PageLoading";
import {ParticipantInfoModal} from "./ParticipantInfoModal";
import {ParticipantSearchForm} from "./ParticipantSearchForm";

export default function ParticipantListPage() {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [query, setQuery] = useState({});
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {participant, isLoading: isParticipantContextLoading} = useParticipantContext();
  const [participantID, setParticipantID] = useState(null);

  const {
    participants,
    pageInfo,
    isLoading: isParticipantsLoading,
  } = useParticipantsPaginated({
    query,
    next,
    previous,
    reloadKey,
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

  const refreshData = () => {
    setReloadKey((key) => key + 1);
    setNext(null);
    setPrevious(null);
    console.log(reloadKey);
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
    } else if (row._id === participant._id) {
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

  if (isParticipantsLoading || isParticipantContextLoading) {
    return <PageLoading />;
  }

  return (
    <ListPage dialogOpen={dialogOpen} onDialogOpen={onDialogOpen}>
      <ParticipantSearchForm refreshData={refreshData} onFilterChange={onFilterChange} query={query} />
      <DataTable
        columns={participantColumns}
        data={participants}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={pageInfo?.hasNext}
        hasPrevious={pageInfo?.hasPrevious}
        onRowClick={onRowClick}
        setRowColor={setRowColor}
        downloadFilename="participants.csv"
        downloadMethod={PARTICIPANTS.downloadCSV}
      />
      <ParticipantInfoModal refreshData={refreshData} participantID={participantID} setDialogOpen={setDialogOpen} />
    </ListPage>
  );
}
