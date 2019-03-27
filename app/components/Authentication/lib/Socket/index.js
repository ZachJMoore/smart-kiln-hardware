const { Components } = require("passeljs");
const io = require("socket.io-client");

module.exports = class Socket extends Components.Base {
  constructor(props) {
    super(props);

    this.componentName = "Socket";

    this.state = {
      isConnected: false,
      authenticationError: null
    };

    this.socket = null;
    this.reconnectInterval = null;
  }

  componentWillMount() {
    this.parentStateChanged.on("httpIsAuthenticated", httpIsAuthenticated => {
      if (httpIsAuthenticated && !this.parentState.socketIsAuthenticated) {
        clearInterval(this.reconnectInterval);
        this.socket.connect();
      } else {
      }
    });

    this.socket = io(process.env.DB_HOST + "/kiln");

    this.socket.on("connect", () => {
      this.setState({ isConnected: true });
      this.socket.emit("authentication", this.parentState.credentials);
    });

    this.socket.on("authenticated", () => {
      this.props.updateAuthState(true);
      this.socket.emit("get-account-data", error => {
        if (error) console.log(error);
      });
    });

    this.socket.on("unauthorized", error => {
      this.setState({
        authenticationError: error
      });
      this.socket.disconnect();
    });

    this.socket.on("disconnect", () => {
      this.props.updateAuthState(false);
      this.setState({
        isConnected: false
      });

      clearInterval(this.reconnectInterval);
      this.reconnectInterval = setInterval(() => {
        if (this.state.isConnected) clearInterval(this.reconnectInterval);
        else this.socket.connect();
      }, (process.env.SOCKET_RECONNECT_ATTEMPT_INTERVAL_SECONDS || 10) * 1000);
    });

    this.setGlobal({
      socket: this.socket
    });
  }

  componentDidMount() {
    this.socket.on("account-data", data => {
      this.props.updateAccountData(data);
    });
  }
};
