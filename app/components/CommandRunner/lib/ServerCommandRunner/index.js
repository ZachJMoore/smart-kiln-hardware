// handles all remote kiln commands.

const { Components } = require("passeljs");
const dispatcher = require("../../../../dispatcher");

module.exports = class ServerCommandRunner extends Components.Base {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.global.socket.on("kiln-command", (command, cb) => {
      if (this.global.RemoteConfig.isDebug) console.log(command);

      if (command.type === "test_message") {
        if (cb) cb(null);
      }

      if (command.type === "start_firing_schedule") {
        let schedule = command.payload.schedule;
        if (!schedule) {
          if (cb) cb("A schedule was not provided.");
          return;
        }
        dispatcher
          .startFiringAsync(schedule)
          .then(() => {
            if (cb) cb(null);
            this.props.addCompletedCommand(command);
          })
          .catch(error => {
            console.log(error);
            if (cb) cb(error);
          });
      }

      if (command.type === "cancel_firing_schedule") {
        dispatcher
          .cancelFiringAsync()
          .then(() => {
            if (cb) cb(null);
            this.props.addCompletedCommand(command);
          })
          .catch(error => {
            if (cb) cb(error);
          });
      }
    });
  }
};
