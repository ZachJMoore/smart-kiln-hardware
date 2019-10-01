// handles all kiln firing logs. Sending to server and keeping backups

const { Components } = require("passeljs");
const helpers = require("../../lib/helpers.js");

module.exports = class FiringLogger extends Components.Base {
  constructor(props) {
    super(props);

    this.state = {
      localId: 1,
      kilnLog: {
        firing_schedule_id: null,
        is_complete: true,
        local_id: null,
        firing_life_cycle: null,
        firing_error: null,
        starting_fahrenheit_temperature: null,
        created_at: null,
        updated_at: null
      },
      kilnLogs: [],
      datapoints: [],
      backupKilnLogs: []
    };

    this.options = {
      fsState: {
        recurrentUpdateLimit: 600 * 1000,
        options: {
          include: [
            {
              key: "localId"
            },
            {
              key: "kilnLog"
            },
            {
              key: "kilnLogs"
            },
            {
              key: "datapoints"
            },
            {
              key: "backupKilnLogs"
            }
          ]
        }
      },
      globalState: {
        options: {
          include: [
            {
              key: "localId",
              emit: false
            },
            {
              key: "kilnLog",
              emit: false
            },
            {
              key: "datapoints",
              emit: true
            }
          ]
        }
      }
    };

    this.kiln_log_datapoint_interval = null;
  }

  getDatapoint(increase = 0) {
    return {
      local_id: this.state.localId + increase,
      temperature: this.global.Kiln.thermoSensor.average,
      created_at: Date.now()
    };
  }

  uploadDatapoint() {
    let datapoint = this.getDatapoint();
    this.global.socket.emit("add-log-datapoint", datapoint, error => {
      if (error) console.log(new Date() + ": " + error);
    });
  }

  addDatapoint() {
    let datapoint = this.getDatapoint();
    this.setState(state => {
      state.datapoints.push(datapoint);
      return state;
    });
  }

  trimKilnLogs(logs, isBackup = false) {
    // TODO: Make sure we remove start and end logs together when trimming

    let limit = null;

    if (isBackup) {
      limit = this.global.RemoteConfig.KILN_LOG_BACKUP_LIMIT_COUNT;
      limit = parseInt(limit);
      if (isNaN(limit)) limit = 30;
    } else {
      limit = this.global.RemoteConfig.KILN_LOG_LIMIT_COUNT;
      limit = parseInt(limit);
      if (isNaN(limit)) limit = 60;
    }

    if (logs.length > limit) {
      let sliceCount = logs.length - limit;
      logs.splice(0, sliceCount);
    }
  }

  componentWillMount() {
    this.globalChanged.on("Kiln.isFiring", isFiring => {
      if (isFiring) {
        clearInterval(this.kiln_log_datapoint_interval);
        this.setState({
          localId: this.state.localId + 1,
          kilnLog: {
            firing_schedule_id: this.global.Kiln.scheduleId,
            is_complete: false,
            local_id: this.state.localId + 1,
            firing_life_cycle: this.global.Kiln.firingLifeCycle,
            firing_error: null,
            starting_fahrenheit_temperature: this.global.Kiln.thermoSensor
              .average,
            created_at: Date.now(),
            updated_at: Date.now()
          },
          datapoints: [this.getDatapoint(1)]
        });
        this.ensureFsState();
        // TODO: if the interval seconds change, make sure we update them
        this.kiln_log_datapoint_interval = setInterval(() => {
          this.uploadDatapoint();
          this.addDatapoint();
        }, this.global.RemoteConfig.KILN_LOG_DATAPOINT_UPDATE_INTERVAL_SECONDS * 1000);
      } else {
        clearInterval(this.kiln_log_datapoint_interval);
        this.addDatapoint();
        this.uploadDatapoint();
        this.setState({
          kilnLog: {
            local_id: this.state.kilnLog.local_id,
            is_complete: true,
            firing_life_cycle: this.global.Kiln.firingLifeCycle,
            firing_error: this.global.Kiln.firingError,
            updated_at: Date.now()
          }
        });
        this.ensureFsState();
      }
    });

    this.stateChanged.on("kilnLog", kilnLog => {
      // update to database or backup if unable to

      this.setState(state => {
        state.kilnLogs.push(kilnLog);
        this.trimKilnLogs(state.kilnLogs);

        let addedToBackup = false;
        if (!this.global.Authentication.socketIsAuthenticated) {
          state.backupKilnLogs.push(kilnLog);
          addedToBackup = true;
        } else {
          this.global.socket.emit(
            "bulk-update-or-create-kiln-logs",
            [...state.backupKilnLogs, kilnLog],
            error => {
              if (error) {
                console.log(new Date() + ": " + error);
                state.backupKilnLogs.push(kilnLog);
                addedToBackup = true;
              } else {
                state.backupKilnLogs = [];
                let datapoint = this.getDatapoint();
                this.global.socket.emit(
                  "add-log-datapoint",
                  datapoint,
                  error => {}
                );
              }
            }
          );
        }

        if (addedToBackup) {
          this.trimKilnLogs(state.backupKilnLogs, true);
        }

        return state;
      });
      this.ensureFsState();
    });

    this.globalChanged.on(
      "Authentication.socketIsAuthenticated",
      socketIsAuthenticated => {
        if (socketIsAuthenticated) {
          if (this.state.backupKilnLogs.length > 0) {
            this.global.socket.emit(
              "bulk-update-or-create-kiln-logs",
              this.state.backupKilnLogs,
              error => {
                if (error) {
                  console.log(new Date() + ": " + error);
                } else {
                  this.setState({
                    backupKilnLogs: []
                  });
                  this.ensureFsState();
                }
              }
            );
          }
        }
      }
    );
  }

  componentDidMount() {}
};
