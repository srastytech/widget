import { render, screen, fireEvent } from "@testing-library/react";
import Canvas from "../components/Canvas";
import { WidgetType } from "../constants";
import { describe,  expect, vi } from "vitest";

const mockWidgets: WidgetType[] = [
  { id: 1, type: "Text", content: "Sample Text", x: 100, y: 200 },
  { id: 2, type: "Table", content: JSON.stringify({ headers: ["A", "B"], rows: [["1", "2"]] }), x: 150, y: 250 }
];

const mockOnWidgetMove = vi.fn();
const mockOnWidgetEdit = vi.fn();
const mockOnWidgetRemove = vi.fn();

describe("Canvas Component", () => {
  test("renders widgets correctly", () => {
    render(<Canvas widgets={mockWidgets} onWidgetMove={mockOnWidgetMove} onWidgetEdit={mockOnWidgetEdit} onWidgetRemove={mockOnWidgetRemove} />);
    expect(screen.getByDisplayValue("Sample Text")).toBeInTheDocument();
  });

  test("calls onWidgetEdit when text widget changes", () => {
    render(<Canvas widgets={mockWidgets} onWidgetMove={mockOnWidgetMove} onWidgetEdit={mockOnWidgetEdit} onWidgetRemove={mockOnWidgetRemove} />);
    const textarea = screen.getByDisplayValue("Sample Text");
    fireEvent.change(textarea, { target: { value: "Updated Text" } });
    expect(mockOnWidgetEdit).toHaveBeenCalledWith(1, "Updated Text");
  });

  test("calls onWidgetEdit when table header changes", () => {
    render(<Canvas widgets={mockWidgets} onWidgetMove={mockOnWidgetMove} onWidgetEdit={mockOnWidgetEdit} onWidgetRemove={mockOnWidgetRemove} />);
    const headerInput = screen.getAllByRole("textbox")[1];
    fireEvent.change(headerInput, { target: { value: "Updated Header" } });
    expect(mockOnWidgetEdit).toHaveBeenCalled();
  });

  test("calls onWidgetRemove when delete button is clicked", () => {
    render(<Canvas widgets={mockWidgets} onWidgetMove={mockOnWidgetMove} onWidgetEdit={mockOnWidgetEdit} onWidgetRemove={mockOnWidgetRemove} />);
    const deleteButton = screen.getAllByText("✖")[0];
    fireEvent.click(deleteButton);
    expect(mockOnWidgetRemove).toHaveBeenCalledWith(1);
  });

  test("calls onWidgetMove on drop event", () => {
    render(<Canvas widgets={mockWidgets} onWidgetMove={mockOnWidgetMove} onWidgetEdit={mockOnWidgetEdit} onWidgetRemove={mockOnWidgetRemove} />);
    const canvas = screen.getByTestId("canvas-container");
    fireEvent.drop(canvas, { dataTransfer: { getData: () => JSON.stringify(mockWidgets[0]) } });
    expect(mockOnWidgetMove).toHaveBeenCalled();
  });
});
