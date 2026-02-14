import {Log} from "meteor/logging";

Log.info("Loading server startup files...");

import "../../api/ddp";
import "../../api/methods";
import "../../api/publications";
import "./startup";

Log.info("Server startup files loaded");
