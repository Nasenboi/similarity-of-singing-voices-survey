import {Button} from "@/components/ui/button";
import {ButtonGroup, ButtonGroupSeparator} from "@/components/ui/button-group";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Field, FieldLabel} from "@/components/ui/field";
import {Spinner} from "@/components/ui/spinner";
import {useSongsAll} from "@/imports/api/songs/hooks";
import {useSurveyQuestionsLines} from "@/imports/api/surveyQuestions/hooks";
import {useIsAdminOrCompleted} from "@/imports/api/users/hooks";
import {Eye, EyeClosed, RefreshCw} from "lucide-react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useParticipantContext} from "../../contextProvider/ParticipantContext";
import {AudioPlayer} from "../../customComponents/AudioPlayer";
import {NumberInput} from "../../customComponents/NumberInput";
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
  const [questionnaireID, setQuestionnaireID] = useState("");
  const [query, setQuery] = useState({});
  const {songs, isLoading: isSongsLoading} = useSongsAll({participantID: participant?._id});
  const {lines, isLoading: isLinesLoading} = useSurveyQuestionsLines({
    participantID: participant?._id,
    dimensions: showTriplets ? dims : null,
    query: query,
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
          <CardHeader className="py-2  w-full h-min grid gap-4 space-y-0 grid-cols-1 md:grid-cols-3">
            <div className="hidden md:block md:col-span-1" />
            <CardTitle className="col-span-1 h-min row-span-1 flex justify-center items-center">
              {dims === "2D" ? t("SimilarityPlot.2D.title") : t("SimilarityPlot.3D.title")}
            </CardTitle>
            <div className="col-span-1 row-span-1 h-min flex flex-col md:flex-row justify-end items-end md:items-center space-y-2 md:space-y-0 md:space-x-2">
              <Field orientation="horizontal">
                <FieldLabel className="flex justify-end whitespace-nowrap">
                  {t("Collections.SurveyQuestions.questionnaireID")}
                </FieldLabel>
                <NumberInput value={questionnaireID} onChange={(e) => setQuestionnaireID(e)} />
              </Field>
              <ButtonGroup>
                <Button
                  onClick={() => {
                    setQuery(String(questionnaireID).trim() ? {questionnaireID} : {});
                  }}
                >
                  <RefreshCw />
                </Button>
                <ButtonGroupSeparator />
                <TripletToggle showTriplets={showTriplets} setShowTriplets={setShowTriplets} />
                <ButtonGroupSeparator />
                <DimToggle dims={dims} setDims={setDims} />
              </ButtonGroup>
            </div>
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
