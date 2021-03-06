// handles most all relay interactions. Just keeps holds a given temperature

const { Components } = require("passeljs");
const helpers = require("../../../../lib/helpers.js");

module.exports = class PID extends Components.Base {
  constructor(props) {
    super(props);

    this.componentName = "PID";

    this.state = {
      target: 0
    };

    this.interval = null;

    this.options = {
      globalState: {
        options: {
          include: [
            {
              key: "target",
              emit: false
            }
          ]
        }
      }
    };

    this.holdTarget = this.holdTarget.bind(this);
  }

  holdTarget() {
    if (this.parentState.thermoSensor.average >= this.state.target) {
      this.props.setRelays(0);
    }

    if (this.parentState.thermoSensor.average < this.state.target) {
      this.props.setRelays(1);
    }

    if (this.global.RemoteConfig.isDebug)
      console.log(
        new Date() +
          ": " +
          "Temperature: " +
          this.parentState.thermoSensor.average,
        "Target: " + this.state.target
      );
  }

  setTarget(target) {
    this.setState({ target: target + 0 });
  }

  increaseTarget(increase) {
    this.setState({ target: this.state.target + increase });
  }

  startPID() {
    clearInterval(this.interval);
    this.holdTarget();

    // TODO: if this interval seconds change, reset interval with new setting
    this.interval = setInterval(
      this.holdTarget,
      this.global.RemoteConfig.PID_INTERVAL_SECONDS * 1000
    );
  }

  stopPID() {
    clearInterval(this.interval);
    this.setState({
      target: 0
    });
  }

  componentWillMount() {
    this.parentStateChanged.on("isFiring", isFiring => {
      if (isFiring) {
        this.startPID();
      } else {
        this.stopPID();
      }
    });
  }

  componentDidMount() {
    // make sure all the relays are off.
    this.props.setRelays(0);
  }
};
