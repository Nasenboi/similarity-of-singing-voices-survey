import {Dialog} from "@/components/ui/dialog";
import {Spinner} from "@/components/ui/spinner";
import {useSongsPaginated} from "@/imports/api/songs/hooks";
import {useIsLoggedIn} from "@/imports/api/users/hooks";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useAudioContext} from "../../contextProvider/AudioContext";
import {AudioPlayer} from "../../customComponents/AudioPlayer";
import {DataTable} from "../../customComponents/DataTable";
import {SongInfoModal} from "./SongInfoModal";
import {SongSearchForm} from "./SongSearchForm";

export function SongListPage() {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const {trackID, setTrackID} = useAudioContext();
  const {t} = useTranslation();
  const [query, setQuery] = useState({});
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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
      accessorKey: "artist",
      header: t("Collections.Songs.artist"),
    },
    {
      accessorKey: "album",
      header: t("Collections.Songs.album"),
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
    setTrackID(null);
  };

  const handlePrevious = () => {
    setPrevious(pageInfo?.prevCursor);
    setNext(null);
    setDialogOpen(false);
    setTrackID(null);
  };

  const onRowClick = (row) => {
    setTrackID(row.trackID);
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
            <SongSearchForm onFilterChange={onFilterChange} query={query} />
            <DataTable
              columns={songColumns}
              data={songs}
              onNext={handleNext}
              onPrevious={handlePrevious}
              hasNext={pageInfo?.hasNext}
              hasPrevious={pageInfo?.hasPrevious}
              onRowCLick={onRowClick}
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
