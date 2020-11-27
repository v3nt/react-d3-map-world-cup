import { useState } from "react";
import React, { useEffect, useRef } from "react";

const Dropdown = ({
  options,
  title,
  selected,
  onSelectedChange,
  objectKey,
  objectValue,
  groupByValue,
  orderByValue,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  console.log("Dropdown", options, selected);
  useEffect(() => {
    const onBodyClick = (event) => {
      if (ref.current.contains(event.target)) {
        return;
      }
      setOpen(false);
    };
    document.body.addEventListener("click", onBodyClick);

    return () => {
      document.body.removeEventListener("click", onBodyClick);
    };
  }, []);

  const removeDuplicates = (originalArray, prop) => {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  };

  if (options && groupByValue) {
    options = removeDuplicates(options, `${groupByValue}`);
  }
  if (options && orderByValue) {
    options.sort(function (a, b) {
      var aa = a[`${groupByValue}`] ? a[`${groupByValue}`].toUpperCase() : ""; // ignore upper and lowercase
      var bb = a[`${groupByValue}`] ? b[`${groupByValue}`].toUpperCase() : ""; // ignore upper and lowercase
      if (aa < bb) {
        return -1;
      }
      if (aa > bb) {
        return 1;
      }
      return 0;
    });
  }

  const renderedOptions = options
    ? options.map((option) => {
        // console.log(option[`${objectValue}`]);
        if (option[`${objectValue}`] === selected) {
          return null;
        } else {
        }
        return (
          <div
            key={option.game_id}
            className="item"
            onClick={() => {
              console.log(
                "onClick",
                option[`${objectValue}`],
                selected[`${objectValue}`],
                selected
              );
              onSelectedChange(option[`${objectValue}`]);
            }}
          >
            {option[`${objectValue}`]}
          </div>
        );
      })
    : null;

  return (
    <div ref={ref}>
      <div className="field">
        <label className="label">{title}</label>
        <div
          onClick={() => {
            setOpen(!open);
          }}
          className={`ui selection dropdown ${open ? "visible active" : ""}`}
        >
          <i className="dropdown icon"></i>
          <div className="text">{selected}</div>
          <div className={`menu ${open ? "visible transition" : ""}`}>
            {renderedOptions}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
