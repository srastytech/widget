import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import WidgetPanel from "./WidgetPanel";
import { widgetTypes } from "../../constants";

describe("WidgetPanel Component", () => {
  it("renders the heading", () => {
    render(<WidgetPanel />);
    expect(screen.getByText("Available Widgets")).toBeInTheDocument();
  });

  it("renders all available widgets", () => {
    render(<WidgetPanel />);
    widgetTypes.forEach((widget) => {
      if (widget.name) { 
        expect(screen.getByText(widget.name)).toBeInTheDocument();
      }
    });
  });

  it("triggers drag event with correct data", () => {
    render(<WidgetPanel />);

    const widgetElement = screen.getByTestId(`widget-${widgetTypes[0].id}`);
    const mockDataTransfer = { setData: vi.fn(), getData: vi.fn() };

    // Mock DragEvent
    class MockDragEvent extends Event {
      dataTransfer: any;
      constructor(type: string, init: any) {
        super(type, init);
        this.dataTransfer = init.dataTransfer || null;
      }
    }

    const dragStartEvent = new MockDragEvent("dragstart", {
      bubbles: true,
      dataTransfer: mockDataTransfer,
    });

    widgetElement.dispatchEvent(dragStartEvent);

    // Parse actual argument passed to setData
    const [[, actualData]] = mockDataTransfer.setData.mock.calls;
    const parsedData = JSON.parse(actualData);

    // Validate required properties while allowing dynamic structure
    expect(parsedData).toMatchObject({
      id: widgetTypes[0].id,
      type: widgetTypes[0].type,
      content: widgetTypes[0].content,
      name: widgetTypes[0].name,
    });

    // Ensure `offsetX`, `offsetY`, and `isNew` are correctly handled
    expect(parsedData.offsetX).toBeDefined();
    expect(parsedData.offsetY).toBeDefined();
    expect(typeof parsedData.isNew).toBe("boolean");
  });
});
