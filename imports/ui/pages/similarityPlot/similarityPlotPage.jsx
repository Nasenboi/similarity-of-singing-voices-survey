import {Button} from "@/components/ui/button";
import {ButtonGroup, ButtonGroupSeparator} from "@/components/ui/button-group";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Spinner} from "@/components/ui/spinner";
import {useSongsAll} from "@/imports/api/songs/hooks";
import {useSurveyQuestionsLines} from "@/imports/api/surveyQuestions/hooks";
import {useIsAdminOrCompleted} from "@/imports/api/users/hooks";
import {Eye, EyeClosed} from "lucide-react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useParticipantContext} from "../../contextProvider/ParticipantContext";
import {AudioPlayer} from "../../customComponents/AudioPlayer";
import {SimilarityPlot2D} from "./similarityPlot2D";
import {SimilarityPlot3D} from "./similarityPlot3D";

function TripletToggle({showTriplets, setShowTriplets}) {
  const {t} = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          {showTriplets ? <Eye /> : <EyeClosed />}
          {t("SimilarityPlot.Settings.triplets")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setShowTriplets(true)}>
          {t("SimilarityPlot.Settings.showTriplets")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setShowTriplets(false)}>
          {t("SimilarityPlot.Settings.hideTriplets")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DimToggle({dims, setDims}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>{dims}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setDims("2D")}>2D</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDims("3D")}>3D</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function SimilarityPlotPage() {
  const {participant, isLoading: isParticipantLoading} = useParticipantContext();
  const {hasRights, isLoading: isRightsLoading} = useIsAdminOrCompleted(participant?._id);
  const [dims, setDims] = useState("2D");
  const [showTriplets, setShowTriplets] = useState(false);
  const {songs, isLoading: isSongsLoading} = useSongsAll({participantID: participant?._id});
  const {lines, isLoading: isLinesLoading} = useSurveyQuestionsLines({
    participantID: participant?._id,
    dimensions: showTriplets ? dims : null,
  });
  const navigate = useNavigate();
  const {t} = useTranslation();

  if (isParticipantLoading || isRightsLoading || isSongsLoading || isLinesLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner className="w-40 h-40" />
      </div>
    );
  }
  if (!hasRights) {
    navigate("/");
  }

  return (
    <div className="w-screen h-screen max-w-screen max-h-screen flex flex-col justify-center items-center">
      <div className="size-full flex flex-col justify-between items-center overflow-scroll md:overflow-hidden">
        <Card className="size-full">
          <CardHeader className="w-full md:px-24 px-4 flex flex-row justify-between items-center">
            <div />
            <CardTitle>{dims === "2D" ? t("SimilarityPlot.2D.title") : t("SimilarityPlot.3D.title")}</CardTitle>
            <ButtonGroup>
              <TripletToggle showTriplets={showTriplets} setShowTriplets={setShowTriplets} />
              <ButtonGroupSeparator />
              <DimToggle dims={dims} setDims={setDims} />
            </ButtonGroup>
          </CardHeader>
          <CardContent className="size-full">
            {dims === "2D" ? (
              <SimilarityPlot2D songs={songs} lines={lines} />
            ) : (
              <SimilarityPlot3D songs={songs} lines={lines} />
            )}
          </CardContent>
        </Card>
      </div>
      <div className="fixed bottom-0 max-w-500 w-full flex items-center">
        <AudioPlayer />
      </div>
    </div>
  );
}
