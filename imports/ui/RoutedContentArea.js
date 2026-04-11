import React, {Suspense, useEffect} from "react";
import {Route, Routes, useLocation} from "react-router-dom";
import {useAudioContext} from "./contextProvider/AudioContext";
import {PageLoading} from "./customComponents/PageLoading";

const LoginPage = React.lazy(() => import("./pages/login/loginPage"));
const MainPage = React.lazy(() => import("./pages/main/mainPage"));
const NotFoundPage = React.lazy(() => import("./pages/notFound/notFoundPage"));
const ParticipantListPage = React.lazy(() => import("./pages/participantList/ParticipantListPage"));
const SimilarityPlotPage = React.lazy(() => import("./pages/similarityPlot/similarityPlotPage"));
const SongListPage = React.lazy(() => import("./pages/songList/SongListPage"));
const SurveyPage = React.lazy(() => import("./pages/survey/SurveyPage"));
const SurveyAnswerListPage = React.lazy(() => import("./pages/surveyAnswerList/SurveyAnswerListPage"));
const SurveyQuestionListPage = React.lazy(() => import("./pages/surveyQuestionList/SurveyQuestionListPage"));
const ImprintPage = React.lazy(() => import("./pages/imprint/imprintPage"));
const PrivacyPolicyPage = React.lazy(() => import("./pages/privacyPolicy/PrivacyPolicyPage"));

export const RouteEffect = () => {
  const {setTrackID} = useAudioContext();
  const location = useLocation();

  useEffect(() => {
    setTrackID(null);
  }, [location.pathname]);

  return null;
};

export function RoutedContentArea() {
  return (
    <Suspense fallback={<PageLoading />}>
      <RouteEffect />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="/plot" element={<SimilarityPlotPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/songs" element={<SongListPage />} />
        <Route path="/participants" element={<ParticipantListPage />} />
        <Route path="/answers" element={<SurveyAnswerListPage />} />
        <Route path="/questions" element={<SurveyQuestionListPage />} />
        <Route path="/imprint" element={<ImprintPage />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
