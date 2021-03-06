// handles all websocket auth and exposing this.socket on global

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
    let host = this.global.RemoteConfig.isProduction
      ? this.global.RemoteConfig.PRODUCTION_HOST
      : this.global.RemoteConfig.DEV_HOST;

    this.socket = io(host + "/kiln", {
      autoConnect: false
    });

    this.parentStateChanged.on("httpIsAuthenticated", httpIsAuthenticated => {
      if (httpIsAuthenticated && !this.parentState.socketIsAuthenticated) {
        clearInterval(this.reconnectInterval);
        this.socket.connect();
      }
    });

    this.socket.on("connect", () => {
      this.setState({ isConnected: true });
      this.socket.emit("authentication", this.parentState.credentials);
    });

    this.socket.on("authenticated", () => {
      this.props.updateAuthState(true);
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
      }, this.global.RemoteConfig.SOCKET_RECONNECT_ATTEMPT_INTERVAL_SECONDS * 1000);
    });

    this.setGlobal({
      socket: this.socket
    });
  }

  componentDidMount() {
    const requestKilnData = () => {
      this.socket.emit("kiln-data-refresh-request");
    };

    this.socket.on("kiln-data-refresh-update-available", requestKilnData);

    this.socket.on("kiln-data-refresh-update", data => {
      this.props.updateAccountData(data);
    });
  }
};
