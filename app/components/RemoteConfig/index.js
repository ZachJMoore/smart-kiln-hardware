// handles all configurations. Remote setting and adjustment of these will be implemented to help sync server restrictions of how often we can send data

const { Components } = require("passeljs");

module.exports = class RemoteConfig extends Components.Base {
  constructor(props) {
    super(props);

    this.state = {
      // ENVIRONMENT
      isProduction: process.env.NODE_ENV === "production", //ONLY NON FS STATE VARIABLE
      isDebug: process.env.DEBUG === "true" ? true : false,
      DEV_HOST:
        process.env.DEV_HOST || "https://development-backend.smartkiln.net",
      PRODUCTION_HOST:
        process.env.PRODUCTION_HOST ||
        "https://production-backend.smartkiln.net",

      // kiln firing settings
      TEMPERATURE_UPDATE_INTERVAL_SECONDS: 5,
      PID_INTERVAL_SECONDS: 5,
      FIRING_SCHEDULE_INTERVAL_SECONDS: 5,

      // AUTHENTICATION
      SOCKET_RECONNECT_ATTEMPT_INTERVAL_SECONDS: 10,
      HTTP_RECONNECT_ATTEMPT_INTERVAL_SECONDS: 10,

      // COMMAND RUNNERS
      COMMAND_COMPLETED_LIMIT_COUNT: 30,

      // KILN FIRING LOGGING
      KILN_LOG_DATAPOINT_UPDATE_INTERVAL_SECONDS: 60,
      // A max of 30 logs will be kept in storage
      KILN_LOG_LIMIT_COUNT: 30,
      // A max of 60 logs will be kept backed up to upload to server once connected
      KILN_LOG_BACKUP_LIMIT_COUNT: 60,

      //REALTIME DATA
      REALTIME_DATA_UPDATE_INTERVAL_SECONDS: 45,

      // DATAPOINT LOGGING
      DATAPOINT_UPDATE_INTERVAL_SECONDS: 60,
      // 720 @60 second update interval = 12 hours worth of datapoints
      DATAPOINT_BACKUP_LIMIT_COUNT: 720,
      // 360 @60 second update interval = 6 hours worth of datapoints
      DATAPOINT_LIMIT_COUNT: 360,

      // WIFI MANAGER CONFIGURATION
      WIFI_MANAGER_INTERVAL_SECONDS: 15
    };

    this.options = {
      fsState: {
        options: {
          include: [
            { key: "isDebug" },
            { key: "DEV_HOST" },
            { key: "PRODUCTION_HOST" },
            { key: "TEMPERATURE_UPDATE_INTERVAL_SECONDS" },
            { key: "PID_INTERVAL_SECONDS" },
            { key: "FIRING_SCHEDULE_INTERVAL_SECONDS" },
            { key: "SOCKET_RECONNECT_ATTEMPT_INTERVAL_SECONDS" },
            { key: "HTTP_RECONNECT_ATTEMPT_INTERVAL_SECONDS" },
            { key: "COMMAND_COMPLETED_LIMIT_COUNT" },
            { key: "KILN_LOG_DATAPOINT_UPDATE_INTERVAL_SECONDS" },
            { key: "KILN_LOG_LIMIT_COUNT" },
            { key: "KILN_LOG_BACKUP_LIMIT_COUNT" },
            { key: "REALTIME_DATA_UPDATE_INTERVAL_SECONDS" },
            { key: "DATAPOINT_UPDATE_INTERVAL_SECONDS" },
            { key: "DATAPOINT_BACKUP_LIMIT_COUNT" },
            { key: "DATAPOINT_LIMIT_COUNT" },
            { key: "WIFI_MANAGER_INTERVAL_SECONDS" }
          ]
        }
      },
      globalState: {
        options: {
          include: [
            { key: "isProduction" },
            { key: "isDebug", emit: true },
            { key: "DEV_HOST", emit: true },
            { key: "PRODUCTION_HOST", emit: true },
            { key: "TEMPERATURE_UPDATE_INTERVAL_SECONDS", emit: true },
            { key: "PID_INTERVAL_SECONDS", emit: true },
            { key: "FIRING_SCHEDULE_INTERVAL_SECONDS", emit: true },
            { key: "SOCKET_RECONNECT_ATTEMPT_INTERVAL_SECONDS", emit: true },
            { key: "HTTP_RECONNECT_ATTEMPT_INTERVAL_SECONDS", emit: true },
            { key: "COMMAND_COMPLETED_LIMIT_COUNT", emit: true },
            { key: "KILN_LOG_DATAPOINT_UPDATE_INTERVAL_SECONDS", emit: true },
            { key: "KILN_LOG_LIMIT_COUNT", emit: true },
            { key: "KILN_LOG_BACKUP_LIMIT_COUNT", emit: true },
            { key: "REALTIME_DATA_UPDATE_INTERVAL_SECONDS", emit: true },
            { key: "DATAPOINT_UPDATE_INTERVAL_SECONDS", emit: true },
            { key: "DATAPOINT_BACKUP_LIMIT_COUNT", emit: true },
            { key: "DATAPOINT_LIMIT_COUNT", emit: true },
            { key: "WIFI_MANAGER_INTERVAL_SECONDS", emit: true }
          ]
        }
      }
    };
  }

  componentWillMount() {}

  componentDidMount() {
    //   TODO: work with this.global.socket to remotely update and keep the database restrictions and smart-kiln intervals in sync
  }
};
