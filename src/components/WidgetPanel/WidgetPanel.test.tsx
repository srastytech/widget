import React from "react";
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

    expect(mockDataTransfer.setData).toHaveBeenCalledWith(
      "widgetData",
      JSON.stringify(widgetTypes[0])
    );
  });
});
