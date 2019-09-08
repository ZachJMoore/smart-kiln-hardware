const { Components } = require("passeljs");
const dispatcher = require("../../../../dispatcher");

module.exports = class LocalCommandRunner extends Components.Base {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.global.io.on("connection", socket => {
      console.log(new Date() + ": " + "mobile device connected over the LAN");

      socket.on("command", (command, cb) => {
        if (command.type === "test_message") {
          if (cb) cb(null);
        }

        if (command.type === "start_firing_schedule") {
          let schedule = dispatcher.getScheduleById(
            command.properties.firing_schedule_id
          );
          if (!schedule) {
            if (cb)
              cb(
                new Error(
                  `Schedule with id '${command.properties.firing_schedule_id}' was not found on the device`
                )
              );
            return;
          }
          dispatcher
            .startFiringAsync(schedule)
            .then(() => {
              if (cb) cb(null);
              this.props.addCompletedCommand(command);
            })
            .catch(error => {
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
    });
  }
};
