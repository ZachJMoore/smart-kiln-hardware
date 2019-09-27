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
    this.reconnectAttemptTimeout = null;
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

  updateAuthState(kiln, error) {
    if (kiln) {
      this.setState({
        authenticationError: null
      });
      this.props.updateCredentials({
        uuid: data.uuid,
        password: data.password
      });
      this.props.updateAccountData(data);
      this.props.updateAuthState(true);
    } else {
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
          this.updateAuthState(data);
        })
        .catch(error => {
          this.updateAuthState(null, error);
        });
    } else {
      this.login()
        .then(data => {
          this.updateAuthState(data);
        })
        .catch(error => {
          this.updateAuthState(null, error);
        });
    }
  }

  componentWillMount() {
    this.stateChanged.on("authenticationError", authenticationError => {
      if (authenticationError) {
        this.reconnectAttemptTimeout = setTimeout(() => {
          this.authenticate();
        }, (process.env.SOCKET_RECONNECT_ATTEMPT_INTERVAL_SECONDS || 10) * 1000);
      } else {
        clearTimeout(this.reconnectAttemptTimeout);
      }
    });
  }

  componentDidMount() {
    this.authenticate();
  }
};
