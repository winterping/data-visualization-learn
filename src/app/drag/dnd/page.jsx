"use client";
import Sort from './Sort';

export default function Dnd() {
  return (
    <div style={{ padding: 20 }}>
      <nav>
        <h3>列表拖拽</h3>
        <Sort/>
      </nav>
    </div>
  );
}
