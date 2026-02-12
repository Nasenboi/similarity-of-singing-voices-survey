import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {Progress} from "@/components/ui/progress";
import React, {useState} from "react";
import {AudioPlayer} from "../../customComponents/AudioPlayer";
import {SurveyCard} from "./surveyCard";

export function SurveyPage() {
  const [submissionAnswers, setSubmissionAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < voiceTriplets.length) {
      setCurrentPage(newPage);
    }
  };
  const surveyProgress = 50;

  const voiceTriplets = [
    {ID: "001", URLS: {X: "000/000002.mp3", A: "000/000003.mp3", B: "000/000010.mp3"}},
    {ID: "002", URLS: {X: "000/000002.mp3", A: "000/000003.mp3", B: "000/000010.mp3"}},
    {ID: "003", URLS: {X: "000/000002.mp3", A: "000/000003.mp3", B: "000/000010.mp3"}},
  ];

  const setSubmissionAnswer = ({ID, response}) => {
    setSubmissionAnswers((prev) => ({
      ...prev,
      [ID]: response,
    }));
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Card className="fixed top-0 ms-50 max-w-500 w-full m-4 bg-background z-10">
        <CardHeader>
          <CardTitle className="text-center">Survey</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Select the voice option which sounds most similar to the target voice</p>
        </CardContent>
        <CardFooter>
          <div className="w-full flex flex-col">
            <div className="flex items-center justify-center w-full">
              <p className="m-2">Progress: </p>
              <Progress className="w-full" value={[surveyProgress]} min={0} max={100} step={1} disabled />
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                />
                {voiceTriplets.map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      isActive={index === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(index);
                      }}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                />
              </PaginationContent>
            </Pagination>
          </div>
        </CardFooter>
      </Card>

      <SurveyCard
        voiceTriplet={voiceTriplets[currentPage]}
        setSubmissionAnswer={setSubmissionAnswer}
        isSubmitted={submissionAnswers.hasOwnProperty(voiceTriplets[currentPage].ID)}
      />

      <div className="fixed bottom-0 max-w-500 w-full">
        <AudioPlayer />
      </div>
    </div>
  );
}
