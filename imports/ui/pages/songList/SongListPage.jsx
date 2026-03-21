import {Spinner} from "@/components/ui/spinner";
import {useSongsPaginated} from "@/imports/api/songs/hooks";
import {useIsLoggedIn} from "@/imports/api/users/hooks";
import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useAudioContext} from "../../contextProvider/AudioContext";
import {AudioPlayer} from "../../customComponents/AudioPlayer";
import {DataTable} from "../../customComponents/DataTable";
import {SongSearchForm} from "./SongSearchForm";

const songColumns = [
  {
    accessorKey: "trackID",
    header: "Track ID",
  },
  {
    accessorKey: "artist",
    header: "Artist",
  },
  {
    accessorKey: "album",
    header: "Album",
  },
];

export function SongListPage() {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();
  const {trackID, setTrackID, isPlaying, setIsPlaying} = useAudioContext();
  const {t} = useTranslation();
  const [query, setQuery] = React.useState({});
  const [next, setNext] = React.useState(null);
  const [previous, setPrevious] = React.useState(null);
  const {
    songs,
    pageInfo,
    isLoading: isSongsLoading,
  } = useSongsPaginated({
    query,
    next,
    previous,
  });

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

  const onRowClick = (row) => {
    console.log(row.trackID);
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
      </div>
      <div className="fixed bottom-0 max-w-500 w-full flex items-center">
        <AudioPlayer />
      </div>
    </div>
  );
}
