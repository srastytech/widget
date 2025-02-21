import styles from "./WidgetPanel.module.css";
import { widgetTypes, WidgetType} from "../../constants";


const WidgetPanel: React.FC = () => {
  return (
    <div className={styles.widgetContainer}>
      <h3 className={styles.heading}>Available Widgets</h3>
      {widgetTypes.map((widget) => (
        <div
          key={widget.id}
          data-testid={`widget-${widget.id}`}
          draggable
          onDragStart={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            console.log("Dragging:", {
              widgetId: widget.id,
              clientX: e.clientX,
              clientY: e.clientY,
              rectLeft: rect.left,
              rectTop: rect.top,
              offsetX,
              offsetY,
            });
          
            e.dataTransfer.setData(
              "widgetData",
              JSON.stringify({
                ...widget,
                offsetX,
                offsetY,
                isNew: true, // Mark this as a new widget
              })
            );
          }}
          
          className={styles.widget}
        >
          {widget.name}
        </div>
      ))}
    </div>
  );
};


export default WidgetPanel;
