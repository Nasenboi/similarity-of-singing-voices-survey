import {AnimatePresence, motion} from "framer-motion";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";
import {useParticipantContext} from "../../contextProvider/ParticipantContext";
import {DemographicForm} from "./demographicForm";
import {GoldMSIForm} from "./goldMSIForm";
import {StartSurveyForm} from "./startSurveyForm";

export default function MainPage() {
  const {participant, isLoading, newParticipant} = useParticipantContext();
  const [subPage, setSubPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();

  const changePage = (newPage) => {
    setDirection(newPage > subPage ? 1 : -1);
    setSubPage(newPage);
  };

  const onStartClick = () => {
    if (!participant && !isLoading) {
      newParticipant()
        .then(() => {
          changePage(1);
        })
        .catch((error) => {
          console.error("Error creating new participant:", error);
          toast.error(error);
        });
    } else {
      changePage(1);
    }
  };

  const getSubPage = () => {
    if (subPage == 1) {
      return <DemographicForm onPrevClick={() => changePage(0)} onNextClick={() => changePage(2)} />;
    } else if (subPage == 2) {
      return <GoldMSIForm onPrevClick={() => changePage(1)} onNextClick={() => navigate("/survey")} />;
    } else {
      return <StartSurveyForm onStartClick={onStartClick} />;
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={subPage}
          initial={{x: direction * 300, opacity: 0}}
          animate={{x: 0, opacity: 1}}
          transition={{duration: 0.3}}
        >
          {getSubPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
