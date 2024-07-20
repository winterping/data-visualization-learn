import React, { useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = "ITEM";

const DraggableItem = ({ item, index, moveItem }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        padding: "8px",
        border: "1px solid gray",
        marginBottom: "10px",
        backgroundColor: isDragging ? "lightgreen" : "white",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {item.content}
    </div>
  );
};

const items = [
  { id: 1, content: "Item 1" },
  { id: 2, content: "Item 2" },
  { id: 3, content: "Item 3" },
  { id: 4, content: "Item 4" },
  { id: 5, content: "Item 5" },
  { id: 6, content: "Item 6" },
];

const DraggableList = () => {
  const [listItems, setListItems] = useState(items);

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...listItems];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setListItems(updatedItems);
  };

  return (
    <div>
      {listItems.map((item, index) => (
        <DraggableItem
          key={item.id}
          item={item}
          index={index}
          moveItem={moveItem}
        />
      ))}
    </div>
  );
};

const Sort = () => {
  return (
    <div style={{ marginTop: 10, width: 400 }}>
      <DndProvider backend={HTML5Backend}>
        <DraggableList />
      </DndProvider>
    </div>
  );
};

export default Sort;
