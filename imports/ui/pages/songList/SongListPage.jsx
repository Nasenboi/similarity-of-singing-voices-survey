import {useSongsPaginated} from "@/imports/api/songs/hooks";
import {SONGS} from "@/imports/api/songs/methods";
import {useIsLoggedIn} from "@/imports/api/users/hooks";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useAudioContext} from "../../contextProvider/AudioContext";
import {DataTable} from "../../customComponents/DataTable";
import {ListPage} from "../../customComponents/ListPage";
import {PageLoading} from "../../customComponents/PageLoading";
import {SongInfoModal} from "./SongInfoModal";
import {SongSearchForm} from "./SongSearchForm";

export default function SongListPage() {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const [trackID, setTrackID] = useState(null);
  const {t} = useTranslation();
  const [query, setQuery] = useState({});
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {setTrackID: setAudioTrackID} = useAudioContext();
  const {
    songs,
    pageInfo,
    isLoading: isSongsLoading,
  } = useSongsPaginated({
    query,
    next,
    previous,
  });

  const songColumns = [
    {
      accessorKey: "trackID",
      header: t("Collections.Songs.trackID"),
    },
    {
      accessorKey: "title",
      header: t("Collections.Songs.title"),
    },
    {
      accessorKey: "artist",
      header: t("Collections.Songs.artist"),
    },
    {
      accessorKey: "genre",
      header: t("Collections.Songs.genre"),
    },
  ];

  const setRowColor = (row) => {
    if (row.skipInSurvey) {
      return "bg-red-100 dark:bg-red-900";
    } else if (row.complaints?.length > 0) {
      return "bg-yellow-100 dark:bg-yellow-900";
    }
  };

  const onFilterChange = (value) => {
    setQuery(value);
    setNext(null);
    setPrevious(null);
    setTrackID(null);
    setAudioTrackID(null);
  };

  const handleNext = () => {
    setNext(pageInfo?.nextCursor);
    setPrevious(null);
    setDialogOpen(false);
    setTrackID(null);
    setAudioTrackID(null);
  };

  const handlePrevious = () => {
    setPrevious(pageInfo?.prevCursor);
    setNext(null);
    setDialogOpen(false);
    setTrackID(null);
    setAudioTrackID(null);
  };

  const onRowClick = (row) => {
    setTrackID(row.trackID);
    setAudioTrackID(null);
    setDialogOpen(true);
  };

  const onDialogOpen = (open) => {
    setDialogOpen(open);
  };

  if (!isLoggedIn) {
    navigate("/");
    return null;
  }

  if (isSongsLoading) {
    return <PageLoading />;
  }

  return (
    <ListPage dialogOpen={dialogOpen} onDialogOpen={onDialogOpen}>
      <SongSearchForm onFilterChange={onFilterChange} query={query} count={pageInfo?.count} total={pageInfo?.total} />
      <DataTable
        columns={songColumns}
        data={songs}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={pageInfo?.hasNext}
        hasPrevious={pageInfo?.hasPrevious}
        onRowClick={onRowClick}
        setRowColor={setRowColor}
        downloadFilename="songs.csv"
        downloadMethod={SONGS.downloadCSV}
      />
      <SongInfoModal trackID={trackID} />
    </ListPage>
  );
}
