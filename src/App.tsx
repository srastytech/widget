import React, { useState, useEffect } from "react";
import Canvas from './components/Canvas'
import WidgetPanel from "./components/WidgetPanel"
import Button from "./components/Button/Button";
import styles from "./App.module.css";
import { SAVELAYOUT, WidgetType } from "./constants";



const App: React.FC = () => {
  const [canvasWidgets, setCanvasWidgets] = useState<WidgetType[]>([]);

  useEffect(() => {
    const savedWidgets = localStorage.getItem("canvasWidgets");
    if (savedWidgets) {
      setCanvasWidgets(JSON.parse(savedWidgets));
    }
  }, []);

  const handleWidgetMove = (newWidget: WidgetType) => {
    setCanvasWidgets((prev) => {
      const existingIndex = prev.findIndex((widget) => widget.id === newWidget.id);

      if (existingIndex !== -1) {
        return prev.map((widget, index) =>
          index === existingIndex ? { ...widget, x: newWidget.x, y: newWidget.y } : widget
        );
      } else {
        return [...prev, newWidget];
      }
    });
  };

  const handleWidgetEdit = (id: number, content: string | string[][]) => {
    setCanvasWidgets((prev) =>
      prev.map((widget) =>
        widget.id === id
          ? { ...widget, content: typeof content === "string" ? content : JSON.stringify(content) }
          : widget
      )
    );
  };
  
  
  const handleWidgetRemove = (id: number) => {
    setCanvasWidgets((prev) => prev.filter((widget) => widget.id !== id));
  };
  const handleSaveLayout = () => {
    localStorage.setItem("canvasWidgets", JSON.stringify(canvasWidgets));
  };

  return (
    <div className={styles.main}>
      <WidgetPanel />
      <div className={styles.canvasContainer}>
        <Canvas
          widgets={canvasWidgets}
          onWidgetMove={handleWidgetMove}
          onWidgetEdit={handleWidgetEdit}
          onWidgetRemove={handleWidgetRemove}
        />
        <Button onClick={handleSaveLayout}>{SAVELAYOUT}</Button>
      </div>
    </div>
  );
};

export default App;
