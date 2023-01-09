import axios from "axios";
import React, { useState } from "react";
import { Component } from "./components/MyComponent";
import "./styles.css";

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);

  const getImage = async () => {
    const randomId = Math.floor(Math.random() * 5000);

    return await axios
      .get(`https://jsonplaceholder.typicode.com/photos/${randomId}`)
      .then((res) => {
        return res.data;
      });
  };

  const addMoveable = async () => {
    // Create a new moveable component and add it to the array
    const COLORS = ["blue", "yellow", "green", "purple"];
    const imageUrl = await getImage();

    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        updateEnd: true,
        image: imageUrl.url,
      },
    ]);
  };

  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  const handleResizeStart = (index, e) => {
    console.log("e", e.direction);
    // Check if the resize is coming from the left handle
    const [handlePosX, handlePosY] = e.direction;
    // 0 => center
    // -1 => top or left
    // 1 => bottom or right

    // -1, -1
    // -1, 0
    // -1, 1
    if (handlePosX === -1) {
      console.log("width", moveableComponents, e);
      // Save the initial left and width values of the moveable component
      const initialLeft = e.left;
      const initialWidth = e.width;

      // Set up the onResize event handler to update the left value based on the change in width
    }
  };

  const handleDelete = (id) => {
    setMoveableComponents((prev) => {
      return prev.filter((item) => item.id !== id);
    });
  };

  return (
    <main style={{ height: "100vh", width: "100vw" }}>
      <button className="button" onClick={addMoveable}>
        Add Moveable1
      </button>
      <div
        id="parent"
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
          padding: 0,
          marginTop: 10,
        }}
      >
        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            key={index}
            updateMoveable={updateMoveable}
            handleResizeStart={handleResizeStart}
            setSelected={setSelected}
            isSelected={selected === item.id}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </main>
  );
};

export default App;
