import {AnimatePresence, motion} from "framer-motion";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useParticipantContext} from "../../contextProvider/ParticipantContext";
import {DemographicForm} from "./demographicForm";
import {StartSurveyForm} from "./startSurveyForm";

export default function MainPage() {
  const navigate = useNavigate();
  const {participant, isLoading, newParticipant} = useParticipantContext();
  const [subPage, setSubPage] = useState(0);
  const [direction, setDirection] = useState(1);

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
        });
    } else {
      changePage(1);
    }
  };

  // navigate("/survey");
  const getSubPage = () => {
    if (subPage == 1) {
      return <DemographicForm onPrevClick={() => changePage(0)} onNextClick={() => changePage(2)} />;
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
