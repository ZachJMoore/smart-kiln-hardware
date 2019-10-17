require("dotenv").config();
const passel = require("passeljs");
const { isValidPlatform } = require("./app/lib/helpers");
const RemoteConfig = require("./app/components/RemoteConfig");
const Authentication = require("./app/components/Authentication");
const Kiln = require("./app/components/Kiln");
const Schedules = require("./app/components/Schedules");
const FiringLogger = require("./app/components/FiringLogger");
const DatapointLogger = require("./app/components/DatapointLogger");
const CommandRunner = require("./app/components/CommandRunner");
const ZeroConf = require("./app/components/ZeroConf");
const RealtimeData = require("./app/components/RealtimeData");

let WifiManager = null;
if (isValidPlatform()) WifiManager = require("./app/components/WifiManager");

let Display = null;
if (isValidPlatform()) Display = require("./app/components/Display");

// Start application

const io = require("socket.io")(process.env.LOCAL_PORT);
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
if (isValidPlatform()) passel.use(Display);
// if (isValidPlatform()) passel.use(WifiManager); // this is not quite complete and needs refining.

passel.mountComponents();

console.log(
  `${new Date()}: application started in ${
    passel.global.RemoteConfig.isProduction ? "production" : "development"
  } mode`
);

if (!isValidPlatform())
  console.log(
    `${new Date()}:\x1b[33m running smart-kiln-hardware on system '${process.platform +
      "-" +
      process.arch}' is unsupported. All Relays, Thermocouples, and WifiManager components are disabled`
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
