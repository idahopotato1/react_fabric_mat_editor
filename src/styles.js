import styled from "styled-components";
import {
  Container,
  TextField,
  Box,
  IconButton,
  Toolbar,
  Popper,
  Paper,
  MenuList,
  MenuItem,
  Divider
} from "@material-ui/core";

export const AppContainer = styled.div`
  margin: 0px;
  padding: 0px;
  height: ${(props) => (props.active === "false" ? "99.8%" : "94.8%")};
`;

export const ScreenContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 97%;
  background-color: #171719;
`;

export const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 96%;
`;

export const EditorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 15px;
  height: 95%;
`;

export const LayerContainer = styled.div`
  background-color: ${(props) =>
    props.active === "false" ? "#292c31" : "#099"};
  &:hover {
    cursor: pointer;
  }
  display: flex;
  align-items: center;
  margin: 2px auto;
  width: 228px;
  height: 50px;
  border-radius: 2px;
`;

export const LayerIcon = styled.div`
  height: 23px;
  width: 30px;
  background-color: ${(props) => props.color};
  margin-right: 10px;
  border: 1px solid #fff;
  margin-left: 5px;
`;

export const CanvasContainer = styled.div`
  margin-right: 15px;
`;

export const LayerText = styled.p`
  font-size: 12px;
  color: hsla(0, 0%, 100%, 0.8);
  letter-spacing: 1px;
`;

export const DataBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #25282c;
  height: fit-content;
  padding-left: 5px;
  align-items: center;
`;

export const DataText = styled.p`
  font-size: 12px;
  margin-right: 5px;
  margin-left: 5px;
  font-weight: bolder;
  color: hsla(0, 0%, 100%, 0.8);
`;

export const StyledTextField = styled(TextField)`
  & > * {
    height: 24px;
    color: hsla(0, 0%, 100%, 0.8);
    border-radius: 0px;
    border-color: red;
    & input::-webkit-outer-spin-button,
    & input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
      appearance: none;
    }
  }
  & .MuiOutlinedInput-root {
    border-radius: 2px;
    & fieldset {
      border-color: hsla(0, 0%, 100%, 0.1);
    }

    &:hover fieldset {
      border-color: #fff;
    }

    &:focus fieldset {
      border-color: #099;
    }
  }
  input {
    color: #999;
    font-size: 12px;
    text-align: right;
    line-height: 20px;
    &:hover,
    &:focus {
      color: #fff;
    }
  }
`;

export const TextFieldBox = styled(Box)`
  width: 50px;
  margin-right: 2px;
`;

export const DatabarIcon = styled(IconButton)`
  &.tool-icon {
    color: hsla(0, 0%, 100%, 0.8);
    &:hover,
    &.Mui-focusVisible {
      background-color: transparent;
      color: white;
    }
  }
`;

export const StyledToolbar = styled(Toolbar)`
  background-color: #1d1f22;
  padding: 0px;
  margin: 0px;
  padding-left: 16px;
  &.MuiToolbar-dense {
    min-height: 32px;
  }
`;

export const StyledMenuButton = styled.a`
  font-size: 14px;
  text-decoration: none;
  padding: 0 10px;
  height: 32px;
  line-height: 32px;
  cursor: pointer;
  display: block;
  color: hsla(0, 0%, 100%, 0.8);
  background-color: ${(props) =>
    props.active === "true" ? "rgba(0, 0, 0, 0.9)" : "inherit"};
  &:hover {
    background-color: black;
  }
`;

export const StyledPopper = styled(Popper)`
  z-index: 10;
  left: 25px;
`;

export const MenuPaper = styled(Paper)`
  /* background-color: rgba(0, 0, 0, 0.9); */
  box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.2);
  min-width: 240px;
  &.MuiPaper-root {
    background-color: rgba(0, 0, 0, 0.9);
    border-radius: 0px;
  }
`;

export const StyledMenuList = styled(MenuList)`
  /* background-color: rgba(0, 0, 0, 0.9); */
`;

export const StyledMenuItem = styled(MenuItem)`
  &.MuiMenuItem-root {
    color: hsla(0, 0%, 100%, 0.8);
    padding: 0 10px;
    display: block;
    height: 32px;
    line-height: 32px;
    &:hover {
      background-color: #099;
    }
  }
`;

export const ShortCutText = styled.span`
  font-size: 11px;
  float: right;
`;

export const MenuDivider = styled(Divider)`
  &.MuiDivider-root {
    background-color: hsla(0, 0%, 100%, 0.2);
    height: 1px;
    margin: 2px 10px;
  }
`;

export const BoxSection = styled.section`
  width: 240px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

export const BoxContainer = styled.div`
  flex: 2;
  margin-top: ${(props) => props.margin};
  background-color: #292c31;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const BoxTitle = styled.div`
  height: 32px;
  line-height: 32px;
  font-size: 13px;
  letter-spacing: 2px !important;
  position: relative;
  font-weight: 700;
  background-color: #292c31;
  color: hsla(0, 0%, 100%, 0.8);
  display: block;
  text-align: center;
  font-family: Open Sans, sans-serif;
`;

export const BoxDivider = styled(Divider)`
  &.MuiDivider-root {
    background-color: hsla(0, 0%, 100%, 0.2);
    height: 2px;
    margin: 2px;
  }
`;

export const LayerSettings = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: rgb(148 149 152);
  &:hover {
    background-color: black;
  }
`;

export const LayerHolder = styled.div`
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: none;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
