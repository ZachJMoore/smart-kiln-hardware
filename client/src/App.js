import React, { Component } from 'reactn';
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
import FiringSchedules from "./components/FiringSchedules"
import Settings from "./components/Settings"
import ScheduleItem from './components/FiringSchedules/ScheduleItem';
import getTemperatureText from "./lib/getTemperatureText"

const ListItemLink = (props) => {
  return <ListItem button component={Link} {...props} />;
}

class App extends Component {

  toggleTemperatureDisplayType = ()=>{
    const isFahrenheit = !this.global.isFahrenheit
    this.setGlobal({
      isFahrenheit: isFahrenheit,
      temperatureText: getTemperatureText(this.global.current_temperature, isFahrenheit)
    })
  }

  toggleSidebar = ()=>{
    this.setGlobal({sidebarIsShown: !this.global.sidebarIsShown})
  }

  componentDidMount(){
    this.setGlobal({
      temperatureText: getTemperatureText(this.global.current_temperature, this.global.isFahrenheit)
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar">
          <IconButton onClick={this.toggleSidebar} className="sidebar-button"><MenuIcon/></IconButton>
          <div className="info">
            <div className="left">
              <span className="time">{this.global.currentTime}</span>
            </div>
            <div className="right">
              <Button onClick={this.toggleTemperatureDisplayType} className="temperature">{this.global.temperatureText}</Button>
            </div>
          </div>
        </nav>
        <nav className={"sidebar" + (this.global.sidebarIsShown ? "" : " hidden")}>
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
            <Route exact path="/" render={()=>(<Home datapoints={this.global.datapoints} isFahrenheit={this.global.isFahrenheit}/>)} />
            <Route exact path="/firing-schedules" render={()=>(<FiringSchedules firingSchedules={this.global.firingSchedules} isFahrenheit={this.global.isFahrenheit}/>)} />
            <Route exact path="/settings" render={()=>(<Settings isFahrenheit={this.global.isFahrenheit}/>)} />
            {this.global.firingSchedules.map(
              (schedule, index)=>(
                <Route 
                  exact
                  path={`/firing-schedules/${schedule.id}`} 
                  render={()=>(<ScheduleItem schedule={schedule} />)}
                  key={index}
                />))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;