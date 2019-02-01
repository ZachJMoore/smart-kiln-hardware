import React, { Component } from 'react';
import './scss/App.scss';
import { Route, Link } from "react-router-dom"
import MenuIcon from "@material-ui/icons/Menu"
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Home from "./components/Home"
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import BarChartIcon from '@material-ui/icons/BarChart';
import SettingsIcon from '@material-ui/icons/Settings';
import { Divider } from '@material-ui/core';

const ListItemLink = (props) => {
  return <ListItem button component={Link} {...props} />;
}

class App extends Component {

  state = {
    currentTime: "6:34 pm",
    isFahrenheit: true,
    current_temperature: 1832,
    temperatureText: "",
    datapoints: [{temperature: 5, created_at: 1548532407617}, {temperature: 10, created_at: 1548532417617}],
    sidebarIsShown: false
  }

  getTemperatureText = (isFahrenheit)=>{
    if (isFahrenheit === undefined) isFahrenheit = this.state.isFahrenheit
    const temp = isFahrenheit ? this.state.current_temperature : (this.state.current_temperature - 32)*(5/9)
    return temp + "º" + (isFahrenheit ? "F" : "C")
  }

  toggleTemperatureDisplayType = ()=>{
    const isFahrenheit = !this.state.isFahrenheit
    this.setState({
      isFahrenheit: isFahrenheit,
      temperatureText: this.getTemperatureText(isFahrenheit)
    })
  }

  toggleSidebar = ()=>{
    this.setState({sidebarIsShown: !this.state.sidebarIsShown})
  }

  componentDidMount(){
    this.setState({
      temperatureText: this.getTemperatureText()
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar">
          <IconButton onClick={this.toggleSidebar} className="sidebar-button"><MenuIcon/></IconButton>
          <div className="info">
            <div className="left">
              <span className="time">{this.state.currentTime}</span>
            </div>
            <div className="right">
              <Button onClick={this.toggleTemperatureDisplayType} className="temperature">{this.state.temperatureText}</Button>
            </div>
          </div>
        </nav>
        <nav className={"sidebar" + (this.state.sidebarIsShown ? "" : " hidden")}>
          <div className="sidebar-container">
            <div className="sidebar-scroll-container">
              <h1 className="sidebar-header">Smart Kiln</h1>
              <h4 className="sidebar-sub-header">v2.0.0</h4>
              <Divider />
              <List component="div" header={<ListSubheader>Smart Kiln</ListSubheader>}>

                <ListItemLink onClick={this.toggleSidebar} to="/">
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemLink>

                <ListItemLink onClick={this.toggleSidebar} to="/firing-schedules">
                  <ListItemIcon>
                    <BarChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Schedules" />
                </ListItemLink>

                <ListItemLink onClick={this.toggleSidebar} to="/settings">
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemLink>

              </List>
            </div>
          </div>
          <div onClick={this.toggleSidebar} className="sidebar-dim"></div>
        </nav>
        <div className="content">
          <div className="content-scroll-container">
            <Route exact path="/" render={()=>(<Home datapoints={this.state.datapoints} isFahrenheit={this.state.isFahrenheit}/>)} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;