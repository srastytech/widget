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
          onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
            e.dataTransfer.setData("widgetData", JSON.stringify(widget));
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
