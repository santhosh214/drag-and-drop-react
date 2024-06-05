import {
  CastConnectedRounded,
  WaterDropIcon,
  AnimationIcon,
  SensorDoorIcon,
  DeviceThermostatIcon,
} from "@mui/icons-material";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import React from "react";

const Sidebar = () => {
  return (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <CastConnectedRounded />
            </ListItemIcon>
            <ListItemText primary={"OWM0131"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <CastConnectedRounded />
            </ListItemIcon>
            <ListItemText primary={"FXA"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <CastConnectedRounded />
            </ListItemIcon>
            <ListItemText primary={"OWM7111"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <WaterDropIcon />
            </ListItemIcon>
            <ListItemText primary={"Water leak"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <AnimationIcon />
            </ListItemIcon>
            <ListItemText primary={"Motion"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <SensorDoorIcon />
            </ListItemIcon>
            <ListItemText primary={"Door"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <DeviceThermostatIcon />
            </ListItemIcon>
            <ListItemText primary={"Temp/Humidity"} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
