import React, { useEffect, useState, createRef, useRef } from "react";
import {
  AppContainer,
  StyledContainer,
  EditorContainer,
  CanvasContainer,
  DataBarContainer,
  DataText,
  StyledTextField,
  TextFieldBox,
  DatabarIcon,
  ScreenContainer,
  BoxSection
} from "./styles";
import { fabric } from "fabric";
import {
  handleMatDragging,
  handleMatScaling,
  matRotation,
  handleKeyMovement,
  handleKeyRelease
} from "./movement";
import { scale, size_x, size_y } from "./constants";
import "./styles.css";
import {
  RotateLeft,
  RotateRight,
  SwapHoriz,
  SwapVert,
  Delete
} from "@material-ui/icons";
import { Tooltip, Button } from "@material-ui/core";
import FileBar from "./FileBar";
import LayersPane from "./LayersPane";
import HistoryPane from "./HistoryPane";
import History from "./history";

export default function App() {
  const mat_data = [
    {
      serial_number: "000000008c31189e",
      array_key: "xwLOW",
      rotate_deg: 0,
      offset_x: 18,
      offset_y: 18,
      flip_x: false,
      flip_y: false,
      size_x: 10,
      size_y: 10,
      start_date: null,
      end_date: null
    },
    {
      serial_number: "00000000af47cf90",
      array_key: "xwLOW",
      rotate_deg: 0,
      offset_x: 18,
      offset_y: 8,
      flip_x: false,
      flip_y: false,
      size_x: 10,
      size_y: 10,
      start_date: null,
      end_date: null
    },
    {
      serial_number: "0000000041100d8e",
      array_key: "xwLOW",
      rotate_deg: 90,
      offset_x: 7,
      offset_y: 14,
      flip_x: false,
      flip_y: false,
      size_x: 4,
      size_y: 4,
      start_date: null,
      end_date: null
    },
    {
      serial_number: "000000007e7d1f85",
      array_key: "xwLOW",
      rotate_deg: 0,
      offset_x: 18,
      offset_y: 0,
      flip_x: false,
      flip_y: false,
      size_x: 10,
      size_y: 8,
      start_date: null,
      end_date: null
    },
    {
      serial_number: "00000000e33fb874",
      array_key: "xwLOW",
      rotate_deg: 0,
      offset_x: 8,
      offset_y: 0,
      flip_x: false,
      flip_y: false,
      size_x: 10,
      size_y: 8,
      start_date: null,
      end_date: null
    },
    {
      serial_number: "000000001522e10c",
      array_key: "xwLOW",
      rotate_deg: 0,
      offset_x: 28,
      offset_y: 8,
      flip_x: false,
      flip_y: false,
      size_x: 10,
      size_y: 10,
      start_date: null,
      end_date: null
    }
  ];
  const canvasRef = createRef();
  const [canvas, setCanvas] = useState(null);
  const [wrapper, setWrapper] = useState(null);
  const [initalState, setInitalState] = useState(null);
  const [initalColors, setInitalColors] = useState(null);
  const [colors, setColors] = useState([]);
  const [active, setActive] = useState({ isActive: false, data: null });
  const [xText, setXText] = useState(active.data ? active.data.left : "");
  const [matCopies, setMatCopies] = useState({});
  const [localMatData, setLocalMatData] = useState(mat_data);
  const copyId = useRef(mat_data.length);
  const matCopy = useRef(null);
  const matColors = useRef(colors);
  const lMats = useRef(localMatData);
  const [undo, setUndo] = useState([]);
  const [redo, setRedo] = useState([]);
  const lHistory = useRef(null);
  const history = new History(
    { undo: undo, setUndo: setUndo, redo: redo, setRedo: setRedo },
    canvas
  );

  const initalize = () => {
    const c = new fabric.Canvas("a", {
      preserveObjectStacking: true,
      width: size_x + 1,
      height: size_y + 1
    });

    const colorArr = [];
    generateGrid(c);

    mat_data.map((mat, i) => {
      const color = generateColor();
      const rect = new fabric.Rect({
        id: i,
        left: mat.offset_x * scale,
        top: mat.offset_y * scale,
        width: mat.size_x * scale,
        height: mat.size_y * scale,
        angle: mat.rotate_deg,
        snapAngle: 0,
        centeredRotation: false,
        fill: color,
        flipX: mat.flip_x,
        flipY: mat.flip_y,
        serial: mat.serial_number,
        array_key: mat.array_key,
        start_date: mat.start_date,
        end_date: mat.end_date,
        borderColor: "rgb(0, 153, 153)",
        borderScaleFactor: 2,
        cornerColor: "rgb(0, 153, 153)",
        stateful: true
      });
      rect.saveState();
      c.add(rect);
      colorArr.push(color);
    });
    setInitalState(
      c.toJSON([
        "id",
        "centeredRotation",
        "serial",
        "selectable",
        "array_key",
        "start_date",
        "end_date",
        "borderColor",
        "borderScaleFactor",
        "cornerColor"
      ])
    );
    setColors(colorArr);
    setInitalColors(colorArr);
    return c;
  };

  const handleSelection = () => {
    const active = canvas.getActiveObject();
    setActive({ isActive: true, data: active });
  };

  const updateActiveData = (data) => {
    setActive({ isActive: true, data: data });
  };

  /**
   * Canvas Mat Object
   */
  const updateLocalMatData = (data) => {
    setLocalMatData((old) => [
      ...old,
      {
        serial_number: data.serial,
        array_key: data.array_key,
        rotate_deg: data.angle,
        offset_x: data.left / scale,
        offset_y: data.top / scale,
        flip_x: data.flipX,
        flip_y: data.flipY,
        size_x: data.width / scale,
        size_y: data.height / scale,
        start_date: data.start_date,
        end_data: data.end_date
      }
    ]);
    setActive({ isActive: true, data: data });
  };

  const generateCopySerial = () => {
    const copiedMats = matCopies;
    return `${matCopy.current.serial.substring(
      0,
      matCopy.current.serial.includes("(")
        ? matCopy.current.serial.indexOf("(")
        : matCopy.current.length
    )}(${
      copiedMats[
        matCopy.current.serial.substring(
          0,
          matCopy.current.serial.includes("(")
            ? matCopy.current.serial.indexOf("(")
            : matCopy.current.length
        )
      ]
    })`;
  };

  const copy = () => {
    const copiedMats = matCopies;
    const copySerial = matCopy.current.serial.substring(
      0,
      matCopy.current.serial.includes("(")
        ? matCopy.current.serial.indexOf("(")
        : matCopy.current.length
    );
    if (copiedMats[copySerial]) {
      copiedMats[copySerial] = copiedMats[copySerial] + 1;
    } else {
      copiedMats[copySerial] = 1;
    }
    setMatCopies(copiedMats);
  };

  const paste = () => {
    if (matCopy.current) {
      copy();
      matCopy.current.clone(
        (cloned) => {
          canvas.discardActiveObject();
          const color = generateColor();
          cloned.set({
            left: cloned.left + 10,
            top: cloned.top + 10,
            serial: generateCopySerial(),
            evented: true,
            fill: color,
            id: copyId.current
          });
          cloned.setCoords();
          canvas.add(cloned);
          canvas.setActiveObject(cloned);
          canvas.requestRenderAll();
          matColors.current.push(color);
          setColors(matColors.current);
          updateLocalMatData(cloned);
        },
        [
          "id",
          "centeredRotation",
          "serial",
          "selectable",
          "array_key",
          "start_date",
          "end_date",
          "borderColor",
          "borderScaleFactor",
          "cornerColor"
        ]
      );
    }
  };

  const handleKeyEvents = (e) => {
    const active = handleKeyMovement(e, canvas, history);
    if (active) {
      if (active.obj && active.type === "copy") {
        matCopy.current = active.obj;
      } else if (active.type === "paste") {
        paste();
      } else if (active.type === "delete") {
        removeMat(active.obj);
      } else if (active.type === "reset") {
        resetCanvas();
      } else if (
        (active.obj && active.type === "undo") ||
        (active.obj && active.type === "redo")
      ) {
        active.obj.saveState();
        canvas.requestRenderAll();
      } else if (active.obj) {
        active.obj.setCoords();
        updateActiveData(active.obj);
      }
    }
  };

  const handleKeyUp = (e) => {
    if (canvas && history.current)
      handleKeyRelease(e, canvas.getActiveObject(), history);
  };

  const generateGrid = (c) => {
    for (var i = 0; i <= size_x / scale; i++) {
      c.add(
        new fabric.Line([i * scale, 0, i * scale, size_y], {
          stroke: "#595959",
          selectable: false
        })
      );
      c.add(
        new fabric.Line([0, i * scale, size_x, i * scale], {
          stroke: "#595959",
          selectable: false
        })
      );
    }
  };

  const generateColor = (format) => {
    const color = [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    ];
    return format === "array" ? color : `rgba(${color.toString()}, 0.55)`;
  };

  const handleMatModification = (e) => {
    if (canvas) {
      history.addUndo(
        { action: e.transform.action, serial: e.target.serial },
        e.target
      );
      e.target.saveState();
      updateActiveData(canvas.getActiveObject());
    }
  };

  const handleTextUpdate = (val) => {
    const active = canvas.getActiveObject();
    active.setCoords();
    if (val.value.key === "Enter") {
      switch (val.type) {
        //val.value.target.value
        case "x":
          canvas.renderAll();
          break;
        case "y":
          break;
        case "w":
          break;
        case "h":
          break;
        case "r":
          break;
        default:
          break;
      }
    }
  };

  const removeMat = (mat) => {
    const active = mat.id ? mat : canvas.getActiveObject();
    setLocalMatData(
      lMats.current.filter((t) => t.serial_number !== active.serial)
    );
    setColors(colors.filter((c) => c !== active.fill));
    canvas.remove(active);
  };

  const undoFun = () => {
    if (history) {
      const undo = history.undo();
      if (undo) {
        undo.saveState();
        canvas.requestRenderAll();
      }
    }
  };

  const redoFun = () => {
    if (history) {
      const redo = history.redo();
      if (redo) {
        redo.saveState();
        canvas.requestRenderAll();
      }
    }
  };

  const handleDatabarButtons = (e) => {
    const active = canvas.getActiveObject();
    if (e.currentTarget.id === "right") {
      active.angle + 90 >= 360
        ? (active.angle = active.angle + 90 - 360)
        : (active.angle = active.angle + 90);
    } else if (e.currentTarget.id === "left") {
      if (active.angle - 90 <= 0) {
        const angle = 360 - Math.abs(active.angle - 90);
        active.angle = angle === 360 ? 0 : angle;
      } else {
        active.angle = active.angle - 90;
      }
    } else if (e.currentTarget.id === "flip-x") {
      active.flipX = true;
    } else if (e.currentTarget.id === "flip-y") {
      active.flipY = true;
    } else if (e.currentTarget.id === "delete") {
      removeMat(active);
    }
    canvas.renderAll();
    if (e.currentTarget.id !== "delete") {
      active.setCoords();
      updateActiveData(active);
    } else {
      setActive({ isActive: false, data: null });
    }
  };

  const dataBar = () => {
    if (active.isActive && active.data) {
      return (
        <DataBarContainer>
          <DataText>Serial: {active.data.serial}</DataText>
          <DataText>X:</DataText>
          <TextFieldBox>
            <StyledTextField
              type={"number"}
              size={"small"}
              variant={"outlined"}
              max={size_x / scale}
              min={0}
              value={xText}
              onChange={(e) => setXText(e.target.value)}
              onKeyDown={(e) => handleTextUpdate({ type: "x", value: e })}
            />
          </TextFieldBox>
          <DataText>Y:</DataText>
          <TextFieldBox>
            <StyledTextField
              type={"number"}
              size={"small"}
              variant={"outlined"}
              max={size_y / scale}
              min={0}
              value={active.data.top / scale}
            />
          </TextFieldBox>
          <DataText>Width:</DataText>
          <TextFieldBox>
            <StyledTextField
              type={"number"}
              size={"small"}
              variant={"outlined"}
              max={size_y / scale}
              min={0}
              value={active.data.width / scale}
            />
          </TextFieldBox>
          <DataText>Height:</DataText>
          <TextFieldBox>
            <StyledTextField
              type={"number"}
              size={"small"}
              variant={"outlined"}
              max={size_y / scale}
              min={0}
              value={active.data.height / scale}
            />
          </TextFieldBox>
          <DataText>Rotation (deg):</DataText>
          <TextFieldBox>
            <StyledTextField
              type={"number"}
              size={"small"}
              variant={"outlined"}
              max={size_y / scale}
              min={0}
              value={active.data.angle}
            />
          </TextFieldBox>
          <Tooltip title="Rotate Left">
            <DatabarIcon
              id="left"
              classes={{ root: "tool-icon" }}
              onClick={handleDatabarButtons}
            >
              <RotateLeft />
            </DatabarIcon>
          </Tooltip>
          <Tooltip title="Rotate Right">
            <DatabarIcon
              id="right"
              classes={{ root: "tool-icon" }}
              onClick={handleDatabarButtons}
            >
              <RotateRight />
            </DatabarIcon>
          </Tooltip>
          <Tooltip title="Flip X">
            <DatabarIcon
              id="flip-x"
              classes={{ root: "tool-icon" }}
              onClick={handleDatabarButtons}
            >
              <SwapHoriz />
            </DatabarIcon>
          </Tooltip>
          <Tooltip title="Flip Y">
            <DatabarIcon
              id="flip-y"
              classes={{ root: "tool-icon" }}
              onClick={handleDatabarButtons}
            >
              <SwapVert />
            </DatabarIcon>
          </Tooltip>
          <Tooltip title="Delete Mat">
            <DatabarIcon
              id="delete"
              classes={{ root: "tool-icon" }}
              onClick={handleDatabarButtons}
            >
              <Delete />
            </DatabarIcon>
          </Tooltip>
        </DataBarContainer>
      );
    } else {
      return <div />;
    }
  };

  //File Bar Functions

  const resetCanvas = () => {
    if (canvas && initalState) {
      canvas.clear();
      canvas.loadFromJSON(initalState);
    }
    setActive({ isActive: false, data: null });
    setLocalMatData(mat_data);
    setColors(initalColors);
    setUndo([]);
    setRedo([]);
  };

  //Filebar Struct

  const fileFunctions = {
    reset: resetCanvas,
    copy: () => (active.isActive ? (matCopy.current = active.data) : null),
    paste: paste,
    clear: removeMat,
    undo: undoFun,
    redo: redoFun
  };

  useEffect(() => {
    setCanvas(initalize());
  }, []);

  useEffect(() => {
    if (canvas) {
      canvas.on({
        "selection:created": handleSelection,
        "selection:updated": handleSelection,
        "selection:cleared": () => setActive({ isActive: false, data: null }),
        "object:rotating": (obj) => matRotation(obj, canvas),
        "object:modified": handleMatModification,
        "object:moving": handleMatDragging,
        "object:scaling": handleMatScaling
      });
    }
    const canvasWrapper = document.getElementById("canvasWrap");
    canvasWrapper.tabIndex = 1000;
    canvasWrapper.addEventListener("keydown", handleKeyEvents, false);
    canvasWrapper.addEventListener("keyup", handleKeyUp, false);
    setWrapper(canvasWrapper);
  }, [canvas]);

  useEffect(() => {
    setXText(active.isActive ? active.data.left / scale : "");
  }, [active]);

  useEffect(() => {
    copyId.current = localMatData.length;
    lMats.current = localMatData;
  }, [localMatData]);

  useEffect(() => {
    lHistory.current = history;
  }, [history]);

  useEffect(() => {
    matColors.current = colors;
  }, [colors]);

  return (
    <AppContainer className="App" active={active.isActive ? "true" : "false"}>
      <FileBar canvas={canvas} functions={fileFunctions} />
      {dataBar()}
      <ScreenContainer>
        <StyledContainer maxWidth={"lg"}>
          <EditorContainer>
            <CanvasContainer style={{ outline: "none" }} id="canvasWrap">
              <canvas tabIndex="0" ref={canvasRef} id="a" />
            </CanvasContainer>
          </EditorContainer>
        </StyledContainer>
        <BoxSection>
          <LayersPane
            data={localMatData}
            canvas={canvas}
            wrapper={wrapper}
            active={active}
            colors={colors}
          />
          <HistoryPane data={undo} />
        </BoxSection>
      </ScreenContainer>
      <Button onClick={() => console.log(undo)}>Show history</Button>
      <Button onClick={() => console.log(redo)}>Show redo</Button>
    </AppContainer>
  );
}
