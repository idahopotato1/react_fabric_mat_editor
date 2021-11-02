import React, { useState, useEffect } from "react";
import { Grow, ClickAwayListener } from "@material-ui/core";
import { StyledPopper, MenuPaper, StyledMenuList } from "./styles";

//props: open, anchor, close
export default function ContextMenu(props) {
  const [anchor, setAnchor] = useState(props.anchor);

  const clickAway = () => {
    if (anchor.id || anchor.target) {
      props.close();
    }
  };

  useEffect(() => {
    setAnchor(props.anchor);
  }, [props.anchor]);

  return (
    <StyledPopper
      open={Boolean(anchor.target)}
      anchorEl={anchor.target}
      role={undefined}
      transition
      disablePortal
      placement={"bottom-start"}
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === "bottom-start" ? "center top" : "center bottom"
          }}
        >
          <MenuPaper>
            <ClickAwayListener onClickAway={clickAway}>
              <StyledMenuList autoFocusItem={Boolean(anchor.target)}>
                {props.children}
              </StyledMenuList>
            </ClickAwayListener>
          </MenuPaper>
        </Grow>
      )}
    </StyledPopper>
  );
}
