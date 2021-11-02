import React from "react";
import {
  LayerContainer,
  LayerIcon,
  LayerText,
  BoxTitle,
  BoxContainer,
  BoxDivider,
  LayerSettings,
  LayerHolder
} from "./styles";

import { MoreVert } from "@material-ui/icons";

export default function LayersPane(props) {
  const data = props.data;
  const canvas = props.canvas;
  const wrapper = props.wrapper;
  const active = props.active;
  const colors = props.colors;

  const handleLayerSelection = (serial_number) => {
    if (canvas && wrapper) {
      canvas.getObjects().forEach((o) => {
        if (o.serial === serial_number) {
          canvas.setActiveObject(o);
          canvas.renderAll();
          wrapper.focus();
        }
      });
    }
  };

  const generateLayers = () => {
    return data.map((mat, i) => {
      return (
        <LayerContainer
          active={
            active.isActive &&
            active.data &&
            active.data.serial === mat.serial_number
              ? "true"
              : "false"
          }
          onClick={() => handleLayerSelection(mat.serial_number)}
          key={i}
        >
          <LayerSettings>
            <MoreVert />
          </LayerSettings>
          <LayerIcon color={colors[i]} />
          <LayerText key={i} id={i}>
            {mat.serial_number}
          </LayerText>
        </LayerContainer>
      );
    });
  };

  return (
    <BoxContainer>
      <BoxTitle>Mats</BoxTitle>
      <BoxDivider />
      <LayerHolder>{generateLayers()}</LayerHolder>
    </BoxContainer>
  );
}
