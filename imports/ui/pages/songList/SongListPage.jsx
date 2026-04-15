import {Dialog} from "@/components/ui/dialog";
import {useSongsPaginated} from "@/imports/api/songs/hooks";
import {SONGS} from "@/imports/api/songs/methods";
import {useIsLoggedIn} from "@/imports/api/users/hooks";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useAudioContext} from "../../contextProvider/AudioContext";
import {AudioPlayer} from "../../customComponents/AudioPlayer";
import {DataTable} from "../../customComponents/DataTable";
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
      return "border-red-500";
    } else if (row.complaints?.length > 0) {
      return "border-yellow-500";
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
    <div className="w-screen h-screen max-w-screen max-h-screen flex flex-col justify-center items-center">
      <div className="w-full flex flex-col justify-between items-center overflow-scroll md:overflow-hidden">
        <Dialog open={dialogOpen} onOpenChange={(open) => onDialogOpen(open)}>
          <div className="py-24 md:max-w-300 size-full">
            <SongSearchForm onFilterChange={onFilterChange} query={query} />
            <DataTable
              columns={songColumns}
              data={songs}
              onNext={handleNext}
              onPrevious={handlePrevious}
              hasNext={pageInfo?.hasNext}
              hasPrevious={pageInfo?.hasPrevious}
              onRowCLick={onRowClick}
              setRowColor={setRowColor}
              downloadFilename="songs.csv"
              downloadMethod={SONGS.downloadCSV}
            />
          </div>
          <div className="w-full h-24" />
          <SongInfoModal trackID={trackID} />
        </Dialog>
      </div>
      <div className="fixed bottom-0 max-w-500 w-full flex items-center">
        <AudioPlayer />
      </div>
    </div>
  );
}
