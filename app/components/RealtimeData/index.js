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
        : null
    };
  }

  emitRealtimeData() {
    this.global.socket.emit("update-realtime-data", this.getRealtimeData());
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
  }

  componentDidMount() {
    this.emitRealtimeData();
    this.interval = setInterval(() => {
      this.emitRealtimeData();
    }, (process.env.REALTIME_DATA_UPDATE_INTERVAL_SECONDS || 5) * 1000);
  }
};
