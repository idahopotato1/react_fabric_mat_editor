import React, { useState } from "react";
import {
  StyledToolbar,
  StyledMenuButton,
  StyledMenuItem,
  ShortCutText,
  MenuDivider
} from "./styles";
import ContextMenu from "./ContextMenu";

const CustomMenuItem = (props) => {
  return (
    <StyledMenuItem {...props}>
      {props.text}
      <ShortCutText>{props.shortcut}</ShortCutText>
    </StyledMenuItem>
  );
};

export default function FileBar(props) {
  const [anchor, setAnchor] = useState({ id: null, target: null });
  const [isHoverable, setIsHoverable] = useState(false);

  const closeMenu = () => {
    setAnchor({ id: null, target: null });
    setIsHoverable(false);
  };

  const handleClick = (e) => {
    if (isHoverable && anchor) {
      setIsHoverable(false);
      setAnchor({ id: null, target: null });
    } else {
      setIsHoverable(true);
      setAnchor({ id: e.currentTarget.id, target: e.currentTarget });
    }
  };

  const onMouseEnter = (e) => {
    if (isHoverable && anchor.target !== e.currentTarget) {
      setAnchor({ id: e.currentTarget.id, target: e.currentTarget });
    }
  };

  const fileMenu = () => {
    return (
      <ContextMenu anchor={anchor} close={closeMenu} menu-id={"file"}>
        <CustomMenuItem text={"New.."} shortcut={"Ctrl+N"} />
        <CustomMenuItem text={"Open.."} shortcut={"Ctrl+O"} />
        <CustomMenuItem text={"Save As.."} />
        <CustomMenuItem text={"Save.."} shortcut={"Ctrl+S"} />
        <CustomMenuItem text={"Print.."} shortcut={"Ctrl+P"} />
        <CustomMenuItem text={"Close"} shortcut={"Ctrl+Q"} />
      </ContextMenu>
    );
  };

  const editMenu = () => {
    return (
      <ContextMenu anchor={anchor} close={closeMenu} menu-id={"edit"}>
        <CustomMenuItem
          text={"Undo"}
          shortcut={"Ctrl+Z"}
          onClick={props.functions.undo}
        />
        <CustomMenuItem
          text={"Redo"}
          shortcut={"Ctrl+Y"}
          onClick={props.functions.redo}
        />
        <MenuDivider />
        <CustomMenuItem text={"Cut"} shortcut={"Ctrl+X"} />
        <CustomMenuItem
          text={"Copy"}
          shortcut={"Ctrl+C"}
          onClick={props.functions.copy}
        />
        <CustomMenuItem
          text={"Paste"}
          shortcut={"Ctrl+V"}
          onClick={props.functions.paste}
        />
        <MenuDivider />
        <CustomMenuItem
          text={"Clear"}
          shortcut={"Del"}
          onClick={props.functions.clear}
        />
        <CustomMenuItem
          text={"Reset"}
          shortcut={"Ctrl+Alt+R"}
          onClick={props.functions.reset}
        />
      </ContextMenu>
    );
  };

  const viewMenu = () => {
    return (
      <ContextMenu anchor={anchor} close={closeMenu} menu-id={"view"}>
        <CustomMenuItem text={"Zoom In"} shortcut={"Ctrl++"} />
        <CustomMenuItem text={"Zoom Out"} shortcut={"Ctrl+-"} />
        <MenuDivider />
        <CustomMenuItem text={"100%"} shortcut={"Ctrl+1"} />
        <CustomMenuItem text={"200%"} shortcut={"Ctrl+2"} />
        <CustomMenuItem text={"300%"} shortcut={"Ctrl+3"} />
      </ContextMenu>
    );
  };

  const helpMenu = () => {
    return (
      <ContextMenu anchor={anchor} close={closeMenu} menu-id={"help"}>
        <CustomMenuItem text={"Keyboard Shortcuts"} shortcut={"Ctrl+Alt+K"} />
        <MenuDivider />
        <CustomMenuItem text={"Scanalytics Homepage"} />
      </ContextMenu>
    );
  };

  return (
    <StyledToolbar variant={"dense"}>
      <StyledMenuButton
        onMouseEnter={onMouseEnter}
        onClick={handleClick}
        id={"file"}
        active={anchor.id === "file" ? "true" : "false"}
      >
        File
      </StyledMenuButton>
      <StyledMenuButton
        onMouseEnter={onMouseEnter}
        onClick={handleClick}
        id={"edit"}
        active={anchor.id === "edit" ? "true" : "false"}
      >
        Edit
      </StyledMenuButton>
      <StyledMenuButton
        onMouseEnter={onMouseEnter}
        onClick={handleClick}
        id={"view"}
        active={anchor.id === "view" ? "true" : "false"}
      >
        View
      </StyledMenuButton>
      <StyledMenuButton
        onMouseEnter={onMouseEnter}
        onClick={handleClick}
        id={"help"}
        active={anchor.id === "help" ? "true" : "false"}
      >
        Help
      </StyledMenuButton>
      {anchor.id === "file"
        ? fileMenu()
        : anchor.id === "edit"
        ? editMenu()
        : anchor.id === "view"
        ? viewMenu()
        : anchor.id === "help"
        ? helpMenu()
        : null}
    </StyledToolbar>
  );
}
