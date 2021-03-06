const fs = require("fs");
const ROOT_PATH = fs.realpathSync(".");
require("dotenv").config();
const passel = require("passeljs");
const Kiln = require("./app/components/Kiln");
const Authentication = require("./app/components/Authentication");
const Schedules = require("./app/components/Schedules");
const FiringLogger = require("./app/components/FiringLogger");
const DatapointLogger = require("./app/components/DatapointLogger");
const CommandRunner = require("./app/components/CommandRunner");
const ZeroConf = require("./app/components/ZeroConf");
const RealtimeData = require("./app/components/RealtimeData");
const WifiManager = require("./app/components/WifiManager");
const Display = require("./app/components/Display");
const RemoteConfig = require("./app/components/RemoteConfig");
const io = require("socket.io")(8009);

// Start application
passel.setGlobalDefaults({
  socket: null,
  io
});

// Order of .use() matters! If components need access to each other, make sure the values you need are set in componentWillMount or Constructor, and are not accessed from other components until componentDidMount

passel.use(RemoteConfig); // must mount as soon as possible
passel.use(Authentication);
passel.use(Kiln);
passel.use(Schedules);
passel.use(FiringLogger);
passel.use(DatapointLogger);
passel.use(CommandRunner);
passel.use(RealtimeData);
passel.use(ZeroConf);
passel.use(Display);
// passel.use(WifiManager); // this is not quite complete and needs refining.

passel.mountComponents();

console.log(
  `${new Date()}: application started. NODE_ENV is ${
    passel.global.RemoteConfig.isProduction ? "production" : "development"
  }`
);

// Testing memory usage of application

// setInterval(() => {
//   const used = process.memoryUsage().heapUsed / 1024 / 1024;
//   console.log(
//     new Date() +
//       ": " +
//       `The script uses approximately ${Math.round(used * 100) / 100} MB`
//   );
// }, 1000);
