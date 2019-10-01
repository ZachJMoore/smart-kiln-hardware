// handles all kiln commands. This includes local and remote

const { Components } = require("passeljs");
const ServerCommandRunner = require("./lib/ServerCommandRunner");
const LocalCommandRunner = require("./lib/LocalCommandRunner");
const _ = require("lodash");

module.exports = class CommandRunner extends Components.Base {
  constructor(props) {
    super(props);

    this.state = {
      completedCommands: []
    };

    this.options = {
      fsState: {
        recurrentUpdateLimit: null,
        options: {
          include: [
            {
              key: "completedCommands"
            }
          ]
        }
      },
      globalState: {
        options: {
          include: [
            {
              key: "completedCommands",
              emit: false
            }
          ]
        }
      }
    };

    this.addCompletedCommand = this.addCompletedCommand.bind(this);
  }

  trimCompletedCommands(completedCommands) {
    let limit = this.global.RemoteConfig.COMMAND_COMPLETED_LIMIT_COUNT;
    limit = parseInt(limit);
    if (isNaN(limit)) limit = 30;

    if (completedCommands.length > limit) {
      let sliceCount = completedCommands.length - limit;
      completedCommands.splice(0, sliceCount);
    }
  }

  addCompletedCommand(command) {
    let cmd = _.clone(command);
    this.setState(state => {
      state.completedCommands.push(cmd);
      this.trimCompletedCommands(state.completedCommands);
      return state;
    });
  }

  componentWillMount() {
    this.use(ServerCommandRunner, {
      addCompletedCommand: this.addCompletedCommand
    });
    this.use(LocalCommandRunner, {
      addCompletedCommand: this.addCompletedCommand
    });
  }
};
