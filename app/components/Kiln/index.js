const { Components } = require("passeljs");
const ThermoSensor = require("./lib/ThermoSensor");
const Relays = require("./lib/Relays");
const PID = require("./lib/PID");
const fireSchedule = require("./lib/fireSchedule");

module.exports = class Kiln extends Components.Base {
  constructor(props) {
    super(props);

    this.componentName = "Kiln";

    this.thermoSensor = new ThermoSensor(
      process.env.THERMO_SENSOR_VERSION || "v1"
    );
    this.relays = new Relays(process.env.RELAY_BOARD_VERSION || "v1");
    this.PID = null;

    this.state = {
      thermoSensor: {
        hasValidReading: false,
        hasValidReadingCount: 0,
        average: 0,
        sensors: []
      },
      thermoSensorError: null,
      isFiring: false,
      firingLifeCycle: null, //started, finished, canceled, errored
      firingError: null,
      rampIndex: null,
      isHolding: false,
      scheduleId: null,
      schedule: null
      // TODO: add hold duration, total elapsed time
    };

    this.options = {
      fsState: {
        options: {
          include: [
            {
              key: "thermoSensor"
            },
            {
              key: "thermoSensorError"
            },
            {
              key: "isFiring"
            },
            {
              key: "firingLifeCycle"
            },
            {
              key: "firingError"
            },
            {
              key: "rampIndex"
            },
            {
              key: "isHolding"
            },
            {
              key: "schedule"
            },
            {
              key: "scheduleId"
            }
          ]
        }
      },
      globalState: {
        options: {
          include: [
            {
              key: "thermoSensor",
              emit: true
            },
            {
              key: "thermoSensorError",
              emit: true
            },
            {
              key: "isFiring",
              emit: true
            },
            {
              key: "firingLifeCycle",
              emit: true
            },
            {
              key: "firingError",
              emit: true
            },
            {
              key: "rampIndex",
              emit: false
            },
            {
              key: "isHolding",
              emit: false
            },
            {
              key: "scheduleId",
              emit: false
            },
            {
              key: "schedule",
              emit: false
            }
          ]
        }
      },
      exposeFunctions: {
        options: {
          include: [
            {
              key: "startFiring"
            },
            {
              key: "cancelFiring"
            }
          ]
        }
      }
    };

    this.setRelays = this.setRelays.bind(this);

    this.checkRelays = this.checkRelays.bind(this);

    // set aside for use in firing schedules
    this._fire_schedule_instance = null;

    this._fire_schedule = fireSchedule.bind(this);
  }

  setRelays(value) {
    this.relays.setRelays(value);
  }

  checkRelays() {
    return this.relays.checkRelays();
  }

  clearFireScheduleIntervals() {
    clearInterval(this._firing_schedule_increase_interval);
    clearTimeout(this._firing_schedule_hold_timeout);
  }

  // TODO: ensure that we ensure state on all firing related functions
  startFiring(schedule) {
    if (this.state.isFiring) return new Error("kiln is already firing");
    if (!schedule) return new Error("no schedule was provided");

    this.setState({
      firingLifeCycle: "started",
      firingError: null,
      scheduleId: schedule.id,
      schedule: schedule,
      isFiring: true
    });
    this._fire_schedule_instance = this._fire_schedule();
    this._fire_schedule_instance.next();

    return true;
  }

  errorFiring(error) {
    if (this.global.RemoteConfig.isDebug)
      console.log(new Date() + ": " + error);
    this.setState({
      firingLifeCycle: "error",
      firingError: error,
      rampIndex: null,
      scheduleId: null,
      schedule: null,
      isHolding: false,
      isFiring: false
    });
  }

  cancelFiring() {
    if (this.global.RemoteConfig.isDebug)
      console.log(new Date() + ": " + "Fire schedule canceled");
    this.setState({
      firingLifeCycle: "canceled",
      rampIndex: null,
      scheduleId: null,
      schedule: null,
      isHolding: false,
      isFiring: false
    });

    return true;
  }

  finishFiring() {
    if (this.global.RemoteConfig.isDebug)
      console.log(new Date() + ": " + "Fire schedule finished");
    this.setState({
      firingLifeCycle: "finished",
      rampIndex: null,
      scheduleId: null,
      schedule: null,
      isHolding: false,
      isFiring: false
    });
  }

  componentWillMount() {
    this.thermoSensor
      .readFahrenheitAsync()
      .then(status => {
        this.setState({
          thermoSensor: status
        });
      })
      .catch(error => {
        this.setState({
          thermoSensorError: error
        });
      });

    this.stateChanged.on("isFiring", isFiring => {
      if (!isFiring) {
        if (this.global.RemoteConfig.isDebug)
          console.log(
            new Date() +
              ": " +
              "clearing fire schedule intervals and removing instance"
          );
        this.setRelays(0);
        this.fireScheduleInstance = null;
        this.clearFireScheduleIntervals();
      }

      this.ensureFsState();
    });

    this.PID = this.use(PID, {
      setRelays: this.setRelays,
      checkRelays: this.checkRelays
    });

    //Check state to see if we were firing before last shutdown
    if (this.state.isFiring) {
      this.setState({
        rampIndex: null,
        scheduleId: null,
        schedule: null,
        isFiring: false
      });

      // TODO: Add error handling for erroneous shutdowns
    }
  }

  componentDidMount() {
    // TODO: if the update interval seconds change, reset this interval
    this.temperatureUpdateInterval = setInterval(() => {
      this.thermoSensor
        .readFahrenheitAsync()
        .then(status => {
          this.setState({
            thermoSensor: status,
            thermoSensorError: null
          });
        })
        .catch(error => {
          this.setState({
            thermoSensor: {
              hasValidReading: false,
              hasValidReadingCount: 0,
              average: 0,
              sensors: []
            },
            thermoSensorError: error
          });
        });
    }, this.global.RemoteConfig.TEMPERATURE_UPDATE_INTERVAL_SECONDS * 1000);
  }
};
