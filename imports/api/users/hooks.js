import {Meteor} from "meteor/meteor";
import {useTracker} from "meteor/react-meteor-data";
import React from "react";

export const useIsLoggedIn = () =>
  useTracker(() => {
    return !!Meteor.userId() && !Meteor.loggingOut();
  }, []);
