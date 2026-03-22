import React from "react";
import {Route, Routes} from "react-router-dom";
import {LoginPage} from "./pages/login/loginPage";
import {MainPage} from "./pages/main/mainPage";
import {NotFoundPage} from "./pages/notFound/notFoundPage";
import {ParticipantListPage} from "./pages/participantList/ParticipantListPage";
import {SimilarityPlotPage} from "./pages/similarityPlot/similarityPlotPage";
import {SongListPage} from "./pages/songList/SongListPage";
import {SurveyPage} from "./pages/survey/SurveyPage";
import {SurveyAnswerListPage} from "./pages/surveyAnswerList/SurveyAnswerListPage";
import {SurveyQuestionListPage} from "./pages/surveyQuestionList/SurveyQuestionListPage";

export function RoutedContentArea() {
  return (
    <Routes>
      <Route path={"/"} element={<MainPage />} />
      <Route path={"/survey"} element={<SurveyPage />} />
      <Route path={"/plot"} element={<SimilarityPlotPage />} />
      <Route path={"/login"} element={<LoginPage />} />
      <Route path={"/songs"} element={<SongListPage />} />
      <Route path={"/participants"} element={<ParticipantListPage />} />
      <Route path={"/answers"} element={<SurveyAnswerListPage />} />
      <Route path={"/questions"} element={<SurveyQuestionListPage />} />
      <Route path={"*"} element={<NotFoundPage />} />
    </Routes>
  );
}
