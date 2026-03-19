import React from "react";
import {Route, Routes} from "react-router-dom";
import {LoginPage} from "./pages/login/loginPage";
import {MainPage} from "./pages/main/mainPage";
import {NotFoundPage} from "./pages/notFound/notFoundPage";
import {SimilarityPlotPage} from "./pages/similarityPlot/similarityPlotPage";
import {SurveyPage} from "./pages/survey/surveyPage";

export function RoutedContentArea() {
  return (
    <Routes>
      <Route path={"/"} element={<MainPage />} />
      <Route path={"/survey"} element={<SurveyPage />} />
      <Route path={"/plot"} element={<SimilarityPlotPage />} />
      <Route path={"/login"} element={<LoginPage />} />
      <Route path={"*"} element={<NotFoundPage />} />
    </Routes>
  );
}
