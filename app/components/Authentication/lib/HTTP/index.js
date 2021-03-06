// handles all basic http auth. The initial connection, deciding whether to login or register

const { Components } = require("passeljs");
const fetch = require("../../../../lib/fetch");
const responseHandler = require("../../../../lib/fetch/lib/responseHandler.js");

module.exports = class HTTP extends Components.Base {
  constructor(props) {
    super(props);

    this.componentName = "HTTP";

    this.state = {
      authenticationError: null
    };

    let host = this.global.RemoteConfig.isProduction
      ? this.global.RemoteConfig.PRODUCTION_HOST
      : this.global.RemoteConfig.DEV_HOST;

    this.authPath = host + "/api/auth/kiln";
    this.options = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      redirect: "follow"
    };
    this.reconnectAttemptInterval = null;
  }

  createAccount() {
    return fetch(this.authPath + "/sign-up", {
      ...this.options,
      method: "get"
    }).then(responseHandler);
  }

  login() {
    return fetch(this.authPath + "/login", {
      ...this.options,
      method: "post",
      body: JSON.stringify(this.parentState.credentials)
    }).then(responseHandler);
  }

  updateAuth(data, error) {
    if (data) {
      this.setState({
        authenticationError: null
      });
      if (data.isNewAccount) {
        this.props.updateCredentials({
          uuid: data.kiln.uuid,
          password: data.kiln.password
        });
      }
      this.props.updateAccountData(data.kiln);
      this.props.updateAuthState(true);
    } else {
      console.log(new Date() + ": " + "Authentication Error: ", error);
      this.setState({
        authenticationError: error
      });
      this.props.updateAuthState(false);
    }
  }

  authenticate() {
    if (!this.parentState.credentials) {
      this.createAccount()
        .then(data => {
          this.updateAuth({ kiln: data, isNewAccount: true });
        })
        .catch(error => {
          this.updateAuth(null, error);
        });
    } else {
      this.login()
        .then(data => {
          this.updateAuth({ kiln: data, isNewAccount: false });
        })
        .catch(error => {
          this.updateAuth(null, error);
        });
    }
  }

  componentWillMount() {
    this.stateChanged.on("authenticationError", authenticationError => {
      clearInterval(this.reconnectAttemptInterval);

      if (authenticationError) {
        this.reconnectAttemptInterval = setInterval(() => {
          this.authenticate();
        }, this.global.RemoteConfig.HTTP_RECONNECT_ATTEMPT_INTERVAL_SECONDS * 1000);
      }
    });
  }

  componentDidMount() {
    this.authenticate();
  }
};
