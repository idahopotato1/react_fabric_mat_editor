export default class History {
  constructor(state, canvas) {
    this.undoArr = state.undo;
    this.setUndo = state.setUndo;
    this.redoArr = state.redo;
    this.setRedo = state.setRedo;
    this.canvas = canvas;
  }

  addUndo(state, target) {
    let prevState = {};
    if (target._stateProperties) {
      target.stateProperties.forEach((prop) => {
        prevState[prop] = target._stateProperties[prop];
      });
    }
    this.undoArr.unshift({
      action: state.action,
      serial: state.serial,
      prevState: prevState
    });
    this.setUndo(this.undoArr);
  }

  redo() {
    if (this.redoArr.length) {
      const redo = this.redoArr.shift();
      this.setRedo(this.redoArr);
      return this._findAndUpdate(redo, "redo");
    } else {
      return null;
    }
  }

  undo() {
    if (this.undoArr.length) {
      const prev = this.undoArr.shift();
      this.setUndo(this.undoArr);
      return this._findAndUpdate(prev, "undo");
    } else {
      return null;
    }
  }

  getRedoStruct() {
    return this.redo;
  }

  getUndoStruct() {
    return this.undo;
  }

  _addRedo(state, target) {
    let prevState = {};
    if (target._stateProperties) {
      target.stateProperties.forEach((prop) => {
        prevState[prop] = target._stateProperties[prop];
      });
    }
    this.redoArr.unshift({
      action: state.action,
      serial: state.serial,
      prevState: prevState
    });
    this.setRedo(this.redoArr);
  }

  _findAndUpdate(state, type) {
    let object = null;
    for (let obj of this.canvas.getObjects()) {
      if (obj.serial && obj.serial === state.serial) {
        object = obj;
        if (type === "undo") {
          this._addRedo(
            {
              action: state.action,
              serial: state.serial
            },
            object
          );
        } else if (type === "redo") {
          this.addUndo(
            {
              action: state.action,
              serial: state.serial
            },
            object
          );
        }
        break;
      }
    }
    return object ? this._updateMatch(object, state.prevState) : null;
  }

  _updateMatch(obj, state) {
    obj.set(state);
    obj.setCoords();
    return obj;
  }
}
