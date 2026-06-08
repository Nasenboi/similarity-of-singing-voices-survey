import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useParticipantContext} from "../../contextProvider/ParticipantContext";
import {DemographicForm} from "./demographicForm";
import {StartSurveyForm} from "./startSurveyForm";

export default function MainPage() {
  const navigate = useNavigate();
  const {participant, isLoading, newParticipant} = useParticipantContext();
  const [subPage, setSubPage] = useState(0);
  const onStartClick = () => {
    if (!participant && !isLoading) {
      newParticipant()
        .then(() => {
          setSubPage(1);
        })
        .catch((error) => {
          console.error("Error creating new participant:", error);
        });
    } else {
      setSubPage(1);
    }
  };

  // navigate("/survey");
  const getSubPage = () => {
    if (subPage == 1) {
      return <DemographicForm onPrevClick={() => setSubPage(0)} onNextClick={() => setSubPage(2)} />;
    } else {
      return <StartSurveyForm onStartClick={onStartClick} />;
    }
  };
  return <div className="w-full flex justify-center items-center"> {getSubPage()}</div>;
}
