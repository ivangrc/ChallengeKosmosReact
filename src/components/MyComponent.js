import React, { useRef, useState } from "react";
import Moveable from "react-moveable";

export const Component = ({
  updateMoveable,
  top,
  left,
  width,
  height,
  index,
  color,
  id,
  setSelected,
  isSelected = false,
  onDelete,
  image,
}) => {
  const ref = useRef();

  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    index,
    color,
    id,
    translate: [0, 0],
  });

  let parent = document.getElementById("parent");
  let parentBounds = parent?.getBoundingClientRect();

  const {
    left: parentLeft,
    right: parenRight,
    top: parentTop,
    bottom: parentBottom,
  } = parentBounds;

  const onResize = async (e) => {
    // ACTUALIZAR ALTO Y ANCHO
    let newWidth = e.width;
    let newHeight = e.height;

    const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;

    updateMoveable(id, {
      top,
      left,
      width: newWidth,
      height: newHeight,
      color,
      image,
    });

    // ACTUALIZAR NODO REFERENCIA
    const beforeTranslate = e.drag.beforeTranslate;

    ref.current.style.width = `${e.width}px`;
    ref.current.style.height = `${e.height}px`;

    let translateX = beforeTranslate[0];
    let translateY = beforeTranslate[1];

    ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      translate: beforeTranslate,
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX,
    });
  };

  // const onResizeEnd = async (e) => {
  //   let newWidth = e.lastEvent?.width;

  //   let newHeight = e.lastEvent?.height;

  //   const positionMaxTop = top + newHeight;

  //   const positionMaxLeft = left + newWidth;

  //   if (positionMaxTop > parentBounds?.height)
  //     newHeight = parentBounds?.height - top;
  //   if (positionMaxLeft > parentBounds?.width)
  //     newWidth = parentBounds?.width - left;

  //   const { lastEvent } = e;
  //   const { drag } = lastEvent;
  //   const { beforeTranslate } = drag;

  //   const absoluteTop = top + beforeTranslate[1];
  //   const absoluteLeft = left + beforeTranslate[0];

  //   ref.current.style.top = `${absoluteTop}px`;
  //   ref.current.style.left = `${absoluteLeft}px`;

  //   updateMoveable(
  //     id,
  //     {
  //       top: absoluteTop,
  //       left: absoluteLeft,
  //       width: newWidth,
  //       height: newHeight,
  //       color,
  //       image,
  //     },
  //     true
  //   );
  // };

  return (
    <>
      <div
        ref={ref}
        className="draggable"
        id={"component-" + id}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
          maxWidth: 600,
          maxHeight: 400,
          background: color,
          //   backgroundImage: `url(${image})`,
        }}
        onClick={() => setSelected(id)}
      >
        <img
          src={image}
          alt='background'
          style={{
            width,
            height,
          }}
        />
        <button
          style={{
            zIndex: 10,
            display: "block",
          }}
          onClick={() => {
            onDelete(id);
          }}
        >
          X
        </button>
      </div>

      <Moveable
        target={isSelected && ref.current}
        container={parent}
        resizable
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
        // onResizeEnd={onResizeEnd}
        onResizeStart={(e) => {
          e.setOrigin(["%", "%"]);
          e.dragStart && e.dragStart.set(nodoReferencia.translate);
        }}
        onResize={onResize}
        snappable
        draggable
        bounds={{
          left: 0,
          top: 0,
          right: parenRight - parentLeft,
          bottom: parentBottom - parentTop,
        }}
        onDrag={(e) => {
          updateMoveable(id, {
            top: e.top,
            left: e.left,
            width,
            height,
            color,
            image,
          });
        }}
      />
    </>
  );
};
