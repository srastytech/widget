import { useRef, useCallback } from "react";
import styles from "./Canvas.module.css";
import { WidgetType } from "../../constants";

type TableContent = {
  headers: string[];
  rows: string[][];
};

type WidgetContent = string | TableContent;

interface CanvasProps {
  widgets: WidgetType[];
  onWidgetMove: (widget: WidgetType) => void;
  onWidgetEdit: (id: number, content: string) => void;
  onWidgetRemove: (id: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({ widgets, onWidgetMove, onWidgetEdit, onWidgetRemove }) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const widgetData = e.dataTransfer.getData("widgetData");
      if (!widgetData || !canvasRef.current) return;

      try {
        const widget: WidgetType = JSON.parse(widgetData);
        const { left, top } = canvasRef.current.getBoundingClientRect();

        onWidgetMove({ ...widget, x: e.clientX - left, y: e.clientY - top });
      } catch (error) {
        console.error("Invalid widget data:", error);
      }
    },
    [onWidgetMove]
  );

  const handleTableChange = (id: number, rowIndex: number, colIndex: number, value: string) => {
    const widget = widgets.find((w) => w.id === id);
    if (!widget) return;
  
    try {
      let table: TableContent;
  
      if (typeof widget.content === "string") {
        table = JSON.parse(widget.content);
  
        if (!table || !Array.isArray(table.headers) || !Array.isArray(table.rows)) {
          throw new Error("Invalid table structure");
        }
      } else {
        table = widget.content;
      }
  
      table.rows[rowIndex][colIndex] = value;
  
      onWidgetEdit(id, JSON.stringify(table));
    } catch (error) {
      console.error("Error updating table content:", error);
      onWidgetEdit(id, JSON.stringify({ headers: ["", ""], rows: [["", ""]] }));
    }
  };
  
  

  const handleHeaderChange = (id: number, colIndex: number, value: string) => {
    const widget = widgets.find((w) => w.id === id);
    if (!widget) return;
  
    let table: TableContent = { headers: ["", ""], rows: [["", ""]] };
  
    if (isTableContent(widget.content)) {
      table = widget.content;
    } else if (typeof widget.content === "string") {
      try {
        table = JSON.parse(widget.content);
      } catch (error) {
        console.error("Failed to parse table content:", error);
      }
    }
  
    table.headers[colIndex] = value;
    onWidgetEdit(id, JSON.stringify(table));
  };
  
  

  const isTableContent = (content: WidgetContent): content is TableContent => {
    return typeof content !== "string" && content !== null && "headers" in content && "rows" in content;
  };

  const renderWidgetContent = (widget: WidgetType) => {
    switch (widget.type) {
      case "Text":
        return (
          <textarea
            className={styles.textArea}
            value={typeof widget.content === "string" ? widget.content : ""}
            onChange={(e) => onWidgetEdit(widget.id, e.target.value)}
          />
        );

      case "Image":
        return (
          <div className={styles.imageContainer}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (event.target?.result) {
                      onWidgetEdit(widget.id, event.target.result.toString());
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {typeof widget.content === "string" && widget.content && (
              <img src={widget.content} alt="Uploaded" className={styles.imagePreview} />
            )}
          </div>
        );

      case "Button":
        return (
          <input
            type="text"
            className={styles.buttonInput}
            value={typeof widget.content === "string" ? widget.content : ""}
            onChange={(e) => onWidgetEdit(widget.id, e.target.value)}
            onClick = {()=>alert('button clicked')}
          />
        );

      case "Table":
        let tableData: TableContent = { headers: ["", ""], rows: [["", ""]] };

        if (typeof widget.content === "string") {
          try {
            tableData = JSON.parse(widget.content);
          } catch (error) {
            console.error("Invalid table data:", error);
          }
        } else if (isTableContent(widget.content)) {
          tableData = widget.content;
        }

        return (
          <table className={styles.table}>
            <thead>
              <tr>
                {tableData?.headers?.map((header, colIndex) => (
                  <th key={colIndex}>
                    <input
                      type="text"
                      value={header}
                      className={styles.tableInput}
                      onChange={(e) => handleHeaderChange(widget.id, colIndex, e.target.value)}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData?.rows?.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex}>
                      <input
                        type="text"
                        value={cell}
                        className={styles.tableInput}
                        onChange={(e) => handleTableChange(widget.id, rowIndex, colIndex, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return null;
    }
  };

  return (
    <div data-testid="canvas-container"
    className={styles.canvasContainer} ref={canvasRef} onDrop={handleDrop} onDragOver={handleDragOver}>
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className={styles.widgetContainer}
          style={{ top: `${widget.y}px`, left: `${widget.x}px` }}
          draggable
          onDragStart={(e) => e.dataTransfer.setData("widgetData", JSON.stringify(widget))}
        >
          <div className={styles.widgetContent}>{renderWidgetContent(widget)}</div>

          <button className={styles.closeButton} onClick={() => onWidgetRemove(widget.id)}>
            ✖
          </button>
        </div>
      ))}
    </div>
  );
};

export default Canvas;
