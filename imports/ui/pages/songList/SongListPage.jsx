import {useIsLoggedIn} from "@/imports/api/users/hooks";
import React from "react";
import {useNavigate} from "react-router-dom";

export function SongListPage() {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate("/");
  }

  return <div className="w-screen h-screen max-w-screen max-h-screen flex flex-col justify-center items-center"></div>;
}
