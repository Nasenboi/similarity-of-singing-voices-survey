import {Meteor} from "meteor/meteor";
import {useTracker} from "meteor/react-meteor-data";
import React from "react";

export const useIsLoggedIn = () =>
  useTracker(() => {
    if (Meteor.isDevelopment) {
      return true;
    }
    return !!Meteor.userId() && !Meteor.loggingOut();
  }, []);
