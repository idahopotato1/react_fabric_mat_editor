import { scale, size_x, size_y } from "./constants";

export const handleMatDragging = (obj) => {
  const mat = obj.target;

  if (
    mat.getScaledHeight() > mat.canvas.height ||
    mat.getScaledWidth() > mat.canvas.width
  ) {
    return;
  }

  mat.setCoords();

  if (mat.getBoundingRect().top < 0 || mat.getBoundingRect().left < 0) {
    mat.top = Math.max(mat.top, mat.top - mat.getBoundingRect().top);
    mat.left = Math.max(mat.left, mat.left - mat.getBoundingRect().left);
  }

  if (
    mat.getBoundingRect().top + mat.getBoundingRect().height >
      mat.canvas.height ||
    mat.getBoundingRect().left + mat.getBoundingRect().width > mat.canvas.width
  ) {
    mat.top = Math.min(
      mat.top,
      mat.canvas.height -
        mat.getBoundingRect().height +
        mat.top -
        mat.getBoundingRect().top
    );
    mat.left = Math.min(
      mat.left,
      mat.canvas.width -
        mat.getBoundingRect().width +
        mat.left -
        mat.getBoundingRect().left
    );
  }
  mat.set({
    left: Math.round(mat.left / scale) * scale,
    top: Math.round(mat.top / scale) * scale
  });
};

const Snap = (value) => {
  return Math.round(value / scale) * scale;
};

export const handleMatScaling = (event) => {
  const { transform } = event;
  const { target } = transform;

  const before = target.getBoundingRect();
  target.setCoords();
  const after = target.getBoundingRect();

  const targetWidth = target.width * target.scaleX;
  const targetHeight = target.height * target.scaleY;

  const snap = {
    // closest width to snap to
    width: Snap(targetWidth),
    height: Snap(targetHeight)
  };

  const centerPoint = target.getCenterPoint();

  const anchorY = transform.originY;
  const anchorX = transform.originX;

  const anchorPoint = target.translateToOriginPoint(
    centerPoint,
    anchorX,
    anchorY
  );

  const attrs = {
    scaleX: target.scaleX,
    scaleY: target.scaleY
  };

  // console.log("b4", before);
  // console.log("after", after);

  // eslint-disable-next-line default-case
  switch (transform.corner) {
    case "tl":
    case "br":
    case "tr":
    case "bl":
      if (Math.abs(targetWidth - snap.width) < scale) {
        attrs.scaleX = snap.width / target.width;
      }

      if (Math.abs(targetHeight - snap.height) < scale) {
        attrs.scaleY = snap.height / target.height;
      }

      break;
    // case "mt":
    //   if (
    //     snap.height / target.height <= anchorPoint.y / target.height &&
    //     Math.abs(targetHeight - snap.height) < scale
    //   ) {
    //     attrs.scaleY = snap.height / target.height;
    //   } else if (snap.height / target.height > anchorPoint.y / target.height) {
    //     attrs.scaleY =
    //       (target.getBoundingRect().height + target.getBoundingRect().top) /
    //       target.height;
    //   }

    //   break;
    case "mt":
    case "mb":
      const mB = checkBounds(target);
      if (mB.pass) {
        attrs.scaleY = snap.height / target.height;
      } else {
        attrs.scaleY = mB.scale;
      }

      break;
    case "ml":
    case "mr":
      const bounds = checkBounds(target);
      console.log(bounds);
      if (bounds.pass) {
        attrs.scaleX = snap.width / target.width;
      } else {
        attrs.scaleX = bounds.scale;
      }
      break;
    // case "mr":
    //   if (
    //     snap.width / target.width <=
    //       (target.canvas.width - anchorPoint.x) / target.width &&
    //     Math.abs(targetWidth - snap.width) < scale
    //   ) {
    //     attrs.scaleX = snap.width / target.width;
    //   } else if (
    //     snap.width / target.width >=
    //     (target.canvas.width - anchorPoint.x) / target.width
    //   ) {
    //     attrs.scaleX =
    //       (target.canvas.width - target.getBoundingRect().left) / target.width;
    //   }
    //   break;
  }

  target.set(attrs);
  target.setPositionByOrigin(anchorPoint, anchorX, anchorY);
  target.setCoords();
  target.saveState();
};

const checkBounds = (target) => {
  console.log(target.left);
  console.log(target.top);
  if (
    target.getBoundingRect().top + target.scaleY >= 0 &&
    target.getBoundingRect().top + target.getBoundingRect().height <=
      target.canvas.height &&
    target.getBoundingRect().left + target.scaleX >= 0 &&
    target.getBoundingRect().left + target.getBoundingRect().width <=
      target.canvas.width
  ) {
    return { pass: true };
  } else {
    if (
      (target.getBoundingRect().top + target.scaleY < 0 ||
        target.getBoundingRect().top + target.getBoundingRect().height >
          target.canvas.height) &&
      target.getBoundingRect().left + target.scaleX >= 0 &&
      target.getBoundingRect().left + target.getBoundingRect().width <=
        target.canvas.width
    ) {
      const newScale =
        target.getBoundingRect().top + target.scaleY < 0
          ? (target.getBoundingRect().height + target.getBoundingRect().top) /
            target.height
          : (target.canvas.height - target.getBoundingRect().top) /
            target.height;
      return {
        pass: false,
        scale: newScale
      };
    } else if (
      (target.getBoundingRect().left + target.scaleX < 0 ||
        target.left + target.getBoundingRect().width > target.canvas.width) &&
      target.getBoundingRect().top >= 0 &&
      target.getBoundingRect().top + target.getBoundingRect().height <=
        target.canvas.height
    ) {
      const newScale =
        target.getBoundingRect().left + target.scaleX < 0
          ? (target.getBoundingRect().width + target.getBoundingRect().left) /
            target.width
          : (target.canvas.width - target.getBoundingRect().left) /
            target.width;
      return {
        pass: false,
        scale: newScale
      };
    } else {
      console.log("ERROR: ");
      console.log(target);
    }
  }
};

export const checkLocation = (mat, action) => {
  mat.setCoords();
  if (action === "ArrowUp" || action === "ArrowDown") {
    if (action === "ArrowUp") {
      return mat.getBoundingRect().top - scale >= 0
        ? mat.top - scale
        : mat.top -
            (mat.canvas.height -
              1 -
              Math.abs(mat.getBoundingRect().top - size_y));
    } else if (action === "ArrowDown") {
      return mat.getBoundingRect().top + mat.getBoundingRect().height + scale <
        size_y
        ? mat.top + scale
        : mat.top +
            Math.abs(
              mat.getBoundingRect().top + mat.getBoundingRect().height - size_y
            );
    }
  } else if (action === "ArrowLeft" || action === "ArrowRight") {
    if (action === "ArrowLeft") {
      return mat.getBoundingRect().left - scale >= 0
        ? mat.left - scale
        : mat.left -
            (mat.canvas.width -
              1 -
              Math.abs(mat.getBoundingRect().left - size_x));
    } else if (action === "ArrowRight") {
      return mat.getBoundingRect().left + mat.getBoundingRect().width + scale <
        size_x
        ? mat.left + scale
        : mat.left +
            Math.abs(
              mat.getBoundingRect().left + mat.getBoundingRect().width - size_x
            );
    }
  }
};

export const matRotation = (obj, canvas) => {
  const active = canvas.getActiveObject();

  if (obj.e.shiftKey) {
    active.snapAngle = 90;
  } else if (active.snapAngle === 90 && !obj.e.shiftKey) {
    active.snapAngle = 0;
  }
  active.setCoords();
};

export const handleKeyMovement = (e, canvas, history) => {
  if (canvas && history) {
    const active = canvas.getActiveObject();
    if (active) {
      switch (e.key) {
        case "ArrowUp":
          active.top = checkLocation(active, e.key);
          canvas.renderAll();
          return { obj: active, type: "up" };
        case "ArrowDown":
          active.top = checkLocation(active, e.key);
          canvas.renderAll();
          return { obj: active, type: "down" };
        case "ArrowLeft":
          active.left = checkLocation(active, e.key);
          canvas.renderAll();
          return { obj: active, type: "left" };
        case "ArrowRight":
          active.left = checkLocation(active, e.key);
          canvas.renderAll();
          return { obj: active, type: "right" };
        case "r":
          if (e.altKey && e.ctrlKey) {
            return { obj: active, type: "reset" };
          } else {
            if (e.altKey && !e.ctrlKey) {
              active.saveState();
              active.angle === 350
                ? (active.angle = 0)
                : (active.angle = active.angle + 10);
              active.setCoords();
            } else {
              active.saveState();
              active.angle === 270
                ? (active.angle = 0)
                : (active.angle = active.angle + 90);
              active.setCoords();
            }
          }
          canvas.renderAll();
          return { obj: active, type: "rot" };
        case "c":
          if (e.ctrlKey) {
            let clipboard = null;
            canvas.getActiveObject().clone(
              (cloned) => {
                clipboard = cloned;
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
            return { obj: clipboard, type: "copy" };
          }
          return;
        case "v":
          if (e.ctrlKey) {
            return { obj: active, type: "paste" };
          } else {
            return;
          }
        case "Delete":
          return { obj: active, type: "delete" };
        case "z":
          if (e.ctrlKey) {
            return { obj: history.undo(), type: "undo" };
          }
          break;
        case "y":
          if (e.ctrlKey) {
            return { obj: history.redo(), type: "redo" };
          }
          break;
        default:
          return { obj: null, type: null };
      }
    } else {
      switch (e.key) {
        case "v":
          if (e.ctrlKey) {
            return { obj: null, type: "paste" };
          } else {
            return;
          }
        case "r":
          if (e.altKey && e.ctrlKey) {
            return { obj: active, type: "reset" };
          } else {
            return;
          }
        case "z":
          if (e.ctrlKey) {
            return { obj: history.undo(), type: "undo" };
          }
          break;
        case "y":
          if (e.ctrlKey) {
            return { obj: history.redo(), type: "redo" };
          }
          break;
        default:
          return { obj: null, type: null };
      }
    }
  }
};

export const handleKeyRelease = (e, active, history) => {
  if (active) {
    switch (e.key) {
      case "ArrowUp":
        history.addUndo({ action: "move up", serial: active.serial }, active);
        break;
      case "ArrowDown":
        history.addUndo({ action: "move down", serial: active.serial }, active);
        break;
      case "ArrowLeft":
        history.addUndo({ action: "move left", serial: active.serial }, active);
        break;
      case "ArrowRight":
        history.addUndo(
          { action: "move right", serial: active.serial },
          active
        );
        break;
      case "r":
        history.addUndo({ action: "rotate", serial: active.serial }, active);
        break;
      case "Delete":
        history.addUndo({ action: "delete", serial: active.serial }, active);
        break;
      default:
        break;
    }
  }
};
