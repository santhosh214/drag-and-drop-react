import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AnimationIcon from "@mui/icons-material/Animation";
import SensorDoorIcon from "@mui/icons-material/SensorDoor";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import { CastConnectedRounded } from "@mui/icons-material";

import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  useNodesState,
  useReactFlow,
} from "react-flow-renderer";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ListItemText } from "@mui/material";

const drawerWidth = 240;

// Custom node component to render images
const ImageNode = ({ data }) => {
  const { src, width, height } = data;
  return (
    <div style={{ width: width, height: height }}>
      <img src={src} alt="uploaded" style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

// Custom node component to render icons
const IconNode = ({ data }) => {
  const { icon: IconComponent, width, height } = data;
  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <IconComponent style={{ fontSize: "2rem" }} />
    </div>
  );
};

// Register the custom node types
const nodeTypes = {
  img: ImageNode,
  icon: IconNode,
};

const ItemTypes = {
  DEVICE: "device",
};

const DraggableListItem = ({ icon, type, isImageUploaded }) => {
  const [, drag] = useDrag(
    () => ({
      type: ItemTypes.DEVICE,
      item: { type, icon },
      canDrag: isImageUploaded,
    }),
    [isImageUploaded]
  );

  return (
    <ListItem disablePadding ref={drag}>
      <ListItemButton>
        <ListItemIcon>
          {React.createElement(icon, { fontSize: "inherit" })}
        </ListItemIcon>
        <ListItemText primary={type} />
      </ListItemButton>
    </ListItem>
  );
};

const insertNode = (newNode, nodes) => {
  const imageNode = nodes.find((node) => node.type === "img");
  if (imageNode) {
    return [imageNode, ...nodes.filter((node) => node.type !== "img"), newNode];
  }
  return [...nodes, newNode];
};

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [canvasHeight, setCanvasHeight] = React.useState(
    window ? window.innerHeight : "100vh"
  );
  const [isImageUploaded, setIsImageUploaded] = React.useState(false);
  const reactFlowInstance = useReactFlow();

  React.useEffect(() => {
    const handleResize = () => {
      setCanvasHeight(window ? window.innerHeight : "100vh");
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [window, nodes]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const imageNode = {
            id: `image-${new Date().getTime()}`,
            type: "img",
            data: {
              src: reader.result,
              width: img.width,
              height: img.height,
            },
            position: {
              x: 100,
              y: 100,
            },
            draggable: false,
            selectable: false,
          };
          setNodes((nds) => insertNode(imageNode, nds));
          setIsImageUploaded(true); // Set image uploaded status to true
        };
        img.onerror = (error) => {
          console.error("Error loading image:", error);
        };
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (item, monitor) => {
    const offset = monitor.getClientOffset();

    if (offset) {
      const reactFlowBounds = reactFlowInstance.project({
        x: offset.x - drawerWidth - 350,
        y: offset.y - 80,
      });

      const newNode = {
        id: `device-${new Date().getTime()}`,
        type: "icon",
        data: {
          icon: item.icon,
          width: 30,
          height: 30,
        },
        position: reactFlowBounds,
        draggable: true,
      };
      setNodes((nds) => insertNode(newNode, nds));
    }
  };

  const handleNodeDragStop = (event, node) => {
    const imageNode = nodes.find((n) => n.type === "img");
    if (imageNode) {
      const { position, data } = imageNode;
      const { width, height } = data;
      const xWithinBounds =
        node.position.x >= position.x &&
        node.position.x + node.data.width <= position.x + width;
      const yWithinBounds =
        node.position.y >= position.y &&
        node.position.y + node.data.height <= position.y + height;

      if (!xWithinBounds || !yWithinBounds) {
        const newNodes = nodes.map((n) =>
          n.id === node.id
            ? {
                ...n,
                position: {
                  x: Math.min(
                    Math.max(node.position.x, position.x),
                    position.x + width - node.data.width
                  ),
                  y: Math.min(
                    Math.max(node.position.y, position.y),
                    position.y + height - node.data.height
                  ),
                },
              }
            : n
        );
        setNodes(newNodes);
      }
    }
  };

  const container =
    typeof window !== "undefined" ? () => document.body : undefined;

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <DraggableListItem
          icon={CastConnectedRounded}
          type={"OWM0131"}
          isImageUploaded={isImageUploaded}
        />
        <DraggableListItem
          icon={CastConnectedRounded}
          type={"FXA"}
          isImageUploaded={isImageUploaded}
        />
        <DraggableListItem
          icon={CastConnectedRounded}
          type={"OWM7111"}
          isImageUploaded={isImageUploaded}
        />
      </List>
      <Divider />
      <List>
        <DraggableListItem
          icon={WaterDropIcon}
          type={"Water leak"}
          isImageUploaded={isImageUploaded}
        />
        <DraggableListItem
          icon={AnimationIcon}
          type={"Motion"}
          isImageUploaded={isImageUploaded}
        />
        <DraggableListItem
          icon={SensorDoorIcon}
          type={"Door"}
          isImageUploaded={isImageUploaded}
        />
        <DraggableListItem
          icon={DeviceThermostatIcon}
          type={"Temp/Humidity"}
          isImageUploaded={isImageUploaded}
        />
      </List>
    </div>
  );

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.DEVICE,
    drop: (item, monitor) => handleDrop(item, monitor),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div>
              <Typography variant="h6" noWrap component="div">
                FloorPlan
              </Typography>
            </div>
            <div>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="upload-button"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="upload-button">
                <Button
                  variant="contained"
                  component="span"
                  style={{ marginLeft: "40px" }}
                >
                  Upload Image
                </Button>
              </label>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="devices-sensors"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <ReactFlowProvider>
          <div
            ref={isImageUploaded ? drop : null} // Apply drop ref only if image is uploaded
            style={{
              height: canvasHeight,
              width: "100%",
              border: isOver ? "2px dashed green" : "none", // Highlight drop area when dragging over
            }}
          >
            <ReactFlow
              nodes={nodes}
              onNodesChange={onNodesChange}
              onNodeDragStop={handleNodeDragStop}
              nodeTypes={nodeTypes}
              fitView
            >
              <MiniMap />
              <Controls />
              <Background variant="lines" gap={12} size={1} />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default function App(props) {
  return (
    <ReactFlowProvider>
      <DndProvider backend={HTML5Backend}>
        <ResponsiveDrawer {...props} />
      </DndProvider>
    </ReactFlowProvider>
  );
}
