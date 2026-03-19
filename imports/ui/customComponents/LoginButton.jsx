import {Button} from "@/components/ui/button";
import {useIsLoggedIn} from "@/imports/api/users/hooks";
import {Meteor} from "meteor/meteor";
import React from "react";
import {useNavigate} from "react-router-dom";

export function LoginButton() {
  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();

  const onLogout = () => {
    Meteor.logout();
    navigate("/");
  };

  const onLogin = () => {
    navigate("/login");
  };

  if (isLoggedIn) {
    return (
      <Button onClick={onLogout} variant="secondary">
        Logout
      </Button>
    );
  } else {
    return (
      <Button onClick={onLogin} variant="secondary">
        Login
      </Button>
    );
  }
}
