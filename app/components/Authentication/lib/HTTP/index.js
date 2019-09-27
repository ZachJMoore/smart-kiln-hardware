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

    this.authPath = process.env.DB_HOST + "/api/auth/kiln";
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

  updateAuth({ kiln, isNewAccount }, error) {
    if (kiln) {
      this.setState({
        authenticationError: null
      });
      if (isNewAccount) {
        this.props.updateCredentials({
          uuid: kiln.uuid,
          password: kiln.password
        });
      }
      this.props.updateAccountData(kiln);
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
        }, (process.env.SOCKET_RECONNECT_ATTEMPT_INTERVAL_SECONDS || 10) * 1000);
      }
    });
  }

  componentDidMount() {
    this.authenticate();
  }
};
