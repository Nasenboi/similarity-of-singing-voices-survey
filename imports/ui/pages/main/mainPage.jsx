import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";
import {useNavigate} from "react-router-dom";

export function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-center items-center">
      <Card className="max-w-150">
        <CardHeader>
          <CardTitle className="text-center">Welcome to the survey!</CardTitle>
          <CardDescription>
            Thank you for checking it out. This survey will take about 15 minutes of your time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This Survey is about the similarity of singing voices. You will hear three short audio clips (A, B and X). X is
            the target voice and A and B are to be compared to it. Choose the audio clip in which the voice is most similar
            with the one from the target audio clip X.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => navigate("/survey")}>To the survey</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
