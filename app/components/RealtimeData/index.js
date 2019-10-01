// handles keeping the server updated with all of the current state and temperatures

const { Components } = require("passeljs");
const helpers = require("../../lib/helpers");

module.exports = class RealtimeData extends Components.Base {
  constructor(props) {
    super(props);
  }

  getRealtimeData() {
    return {
      kiln_id: this.global.Authentication.account
        ? this.global.Authentication.account.id
        : null,
      is_firing: this.global.Kiln.isFiring,
      firing_life_cycle: this.global.Kiln.firingLifeCycle,
      firing_schedule_id: this.global.Kiln.scheduleId,
      average_temperature: this.global.Kiln.thermoSensor.average,
      has_valid_thermocouple_reading: this.global.Kiln.thermoSensor
        .hasValidReading,
      has_valid_thermocouple_reading_count: this.global.Kiln.thermoSensor
        .hasValidReadingCount,
      thermocouple_sensor_error: this.global.Kiln.thermoSensorError
        ? this.global.Kiln.thermoSensorError.message
        : null,
      estimated_minutes_remaining: null,
      ramp_index: this.global.Kiln.rampIndex,
      is_holding: this.global.Kiln.isHolding,
      schedule_type: this.global.Kiln.schedule
        ? this.global.Kiln.schedule.type
        : null,
      schedule_name: this.global.Kiln.schedule
        ? this.global.Kiln.schedule.name
        : null,
      current_target: this.global.Kiln.isFiring
        ? this.global.Kiln.PID.target
        : null
    };
  }

  emitRealtimeData() {
    if (this.global.Authentication.socketIsAuthenticated) {
      this.global.socket.emit("update-realtime-data", this.getRealtimeData());
    }
    this.global.io.emit("update-realtime-data", this.getRealtimeData());
  }

  componentWillMount() {
    this.globalChanged.on(
      "Authentication.socketIsAuthenticated",
      socketIsAuthenticated => {
        if (socketIsAuthenticated) {
          this.emitRealtimeData();
        }
      }
    );

    this.globalChanged.on("Kiln.isFiring", isFiring => {
      this.emitRealtimeData();
    });
  }

  componentDidMount() {
    // TODO: when the interval seconds change, make sure we reset things
    this.interval = setInterval(() => {
      this.emitRealtimeData();
    }, this.global.RemoteConfig.REALTIME_DATA_UPDATE_INTERVAL_SECONDS * 1000);
  }
};
