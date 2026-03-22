import {Spinner} from "@/components/ui/spinner";
import {useSongsAll} from "@/imports/api/songs/hooks";
import {useIsAdminOrCompleted} from "@/imports/api/users/hooks";
import React from "react";
import {useNavigate} from "react-router-dom";
import {useParticipantContext} from "../../contextProvider/ParticipantContext";

export function SimilarityPlotPage() {
  const {participantID, isLoading: isParticipantLoading} = useParticipantContext();
  const {hasRights, isLoading: isRightsLoading} = useIsAdminOrCompleted(participantID);
  const {songs, isLoading: isSongsLoading} = useSongsAll({participantID});
  const navigate = useNavigate();

  if (isParticipantLoading || isRightsLoading || isSongsLoading) {
    <div className="w-screen h-screen flex justify-center items-center">
      <Spinner className="w-40 h-40" />
    </div>;
  }
  if (!hasRights) {
    navigate("/");
  }

  return <div className="w-screen h-screen max-w-screen max-h-screen flex flex-col justify-center items-center"></div>;
}
