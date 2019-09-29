const { Components } = require("passeljs");
const Socket = require("./lib/Socket");
const HTTP = require("./lib/HTTP");
const _ = require("lodash");

module.exports = class Authentication extends Components.Base {
  constructor(props) {
    super(props);

    this.componentName = "Authentication";

    this.state = {
      httpIsAuthenticated: false,
      socketIsAuthenticated: false,
      credentials: null,
      account: null
    };

    this.options = {
      fsState: {
        recurrentUpdateLimit: null,
        options: {
          include: [
            {
              key: "credentials"
            },
            {
              key: "account"
            }
          ]
        }
      },
      globalState: {
        options: {
          include: [
            {
              key: "account",
              emit: true
            },
            {
              key: "httpIsAuthenticated",
              emit: true
            },
            {
              key: "socketIsAuthenticated",
              emit: true
            }
          ]
        }
      }
    };
    this.updateSocketAuthState = this.updateSocketAuthState.bind(this);

    this.updateHTTPAuthState = this.updateHTTPAuthState.bind(this);
    this.updateAccountData = this.updateAccountData.bind(this);
    this.removeAccountOwner = this.removeAccountOwner.bind(this);
    this.updateCredentials = this.updateCredentials.bind(this);
  }

  updateSocketAuthState(value) {
    this.setState({
      socketIsAuthenticated: value
    });
  }

  updateHTTPAuthState(value) {
    this.setState({
      httpIsAuthenticated: value
    });
  }

  updateAccountData(data) {
    this.setState({
      account: data
    });
  }

  removeAccountOwner() {
    this.setState(prevState => {
      let state = _.cloneDeep(prevState);
      state.account.user_id = null;
      return state;
    });
  }

  updateCredentials(credentials) {
    this.setState({
      credentials: {
        uuid: credentials.uuid,
        password: credentials.password
      }
    });
  }

  componentWillMount() {
    this.use(Socket, {
      updateAuthState: this.updateSocketAuthState,
      updateAccountData: this.updateAccountData,
      removeAccountOwner: this.removeAccountOwner
    });

    this.use(HTTP, {
      updateAuthState: this.updateHTTPAuthState,
      updateAccountData: this.updateAccountData,
      removeAccountOwner: this.removeAccountOwner,
      updateCredentials: this.updateCredentials
    });
  }

  componentDidMount() {}
};
