import { render, screen, fireEvent } from "@testing-library/react";
import Canvas from "./Canvas";
import { WidgetType } from "../../constants";

import { describe, it, expect, vi, beforeEach } from "vitest";

const mockOnWidgetMove = vi.fn();
const mockOnWidgetEdit = vi.fn();
const mockOnWidgetRemove = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});
describe("Canvas Component", () => {

  const sampleWidgets: WidgetType[] = [
    { id: 1, type: "Text", content: "Sample Text", x: 50, y: 50 },
    { id: 2, type: "Table", content: JSON.stringify({ headers: ["A"], rows: [["1"]] }), x: 100, y: 100 },
  ];

  test("renders widgets correctly", () => {
    render(
      <Canvas 
        widgets={sampleWidgets} 
        onWidgetMove={mockOnWidgetMove} 
        onWidgetEdit={mockOnWidgetEdit} 
        onWidgetRemove={mockOnWidgetRemove} 
      />
    );

    expect(screen.getByDisplayValue("Sample Text")).toBeInTheDocument();
    expect(screen.getByDisplayValue("A")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
  });

  test("calls onWidgetEdit when text widget changes", () => {
    render(
      <Canvas 
        widgets={sampleWidgets} 
        onWidgetMove={mockOnWidgetMove} 
        onWidgetEdit={mockOnWidgetEdit} 
        onWidgetRemove={mockOnWidgetRemove} 
      />
    );

    const textArea = screen.getByDisplayValue("Sample Text");
    fireEvent.change(textArea, { target: { value: "Updated Text" } });

    expect(mockOnWidgetEdit).toHaveBeenCalledWith(1, "Updated Text");
  });

  test("calls onWidgetEdit when table header changes", () => {
    render(
      <Canvas 
        widgets={sampleWidgets} 
        onWidgetMove={mockOnWidgetMove} 
        onWidgetEdit={mockOnWidgetEdit} 
        onWidgetRemove={mockOnWidgetRemove} 
      />
    );

    const headerInput = screen.getByDisplayValue("A");
    fireEvent.change(headerInput, { target: { value: "Header Updated" } });

    expect(mockOnWidgetEdit).toHaveBeenCalled();
  });

  test("calls onWidgetEdit when table cell changes", () => {
    render(
      <Canvas 
        widgets={sampleWidgets} 
        onWidgetMove={mockOnWidgetMove} 
        onWidgetEdit={mockOnWidgetEdit} 
        onWidgetRemove={mockOnWidgetRemove} 
      />
    );

    const cellInput = screen.getByDisplayValue("1");
    fireEvent.change(cellInput, { target: { value: "Updated Cell" } });

    expect(mockOnWidgetEdit).toHaveBeenCalled();
  });

  test("calls onWidgetRemove when delete button is clicked", () => {
    render(
      <Canvas 
        widgets={sampleWidgets} 
        onWidgetMove={mockOnWidgetMove} 
        onWidgetEdit={mockOnWidgetEdit} 
        onWidgetRemove={mockOnWidgetRemove} 
      />
    );

    const deleteButton = screen.getAllByText("✖")[0]; 
    fireEvent.click(deleteButton);

    expect(mockOnWidgetRemove).toHaveBeenCalledWith(1);
  });

  test("calls onWidgetMove on drop event", () => {
    render(
      <Canvas 
        widgets={sampleWidgets} 
        onWidgetMove={mockOnWidgetMove} 
        onWidgetEdit={mockOnWidgetEdit} 
        onWidgetRemove={mockOnWidgetRemove} 
      />
    );

    const canvas = screen.getByTestId("canvas-container");
    const widgetData = JSON.stringify(sampleWidgets[0]);

    fireEvent.drop(canvas, {
      dataTransfer: {
        getData: () => widgetData,
      },
      clientX: 200,
      clientY: 200,
    });

    expect(mockOnWidgetMove).toHaveBeenCalled();
  });
});
