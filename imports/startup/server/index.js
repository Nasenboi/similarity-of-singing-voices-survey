import { Log } from "meteor/logging";

Log.debug("Loading server startup files...");

import "../../api/methods";
import "../../api/publications";
import "./startup";

Log.debug("Server startup files loaded");
