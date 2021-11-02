import React from "react";
import {
  LayerContainer,
  LayerIcon,
  LayerText,
  BoxTitle,
  BoxContainer,
  BoxDivider,
  LayerHolder
} from "./styles";

export default function HistoryPane(props) {
  const data = props.data;

  const generateLayers = () => {
    return data.map((hist, i) => {
      return (
        <LayerContainer>
          <LayerText key={i} id={i}>
            {hist.action}
          </LayerText>
        </LayerContainer>
      );
    });
  };

  return (
    <BoxContainer>
      <BoxTitle>History</BoxTitle>
      <BoxDivider />
      <LayerHolder>{generateLayers()}</LayerHolder>
    </BoxContainer>
  );
}
