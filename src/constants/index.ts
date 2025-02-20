export type TableContent = {
  headers: string[];
  rows: string[][];
};

export type WidgetContent = string | TableContent;

export type WidgetType = {
  id: number;
  type: string;
  content: WidgetContent;
  name?: string;
  x?: number;
  y?: number;
};

export const widgetTypes: WidgetType[] = [
  { id: 1, type: "Text", content: "", name: "Text" },
  { id: 2, type: "Image", content: "", name: "Image" },
  { id: 3, type: "Button", content: "button", name: "Button" },
  { id: 4, type: "Table", name: "Table",  content: JSON.stringify({
    headers: ["Column 1", "Column 2"],
    rows: [["", ""]], // Ensure a valid table structure
  }),
 },
];

export const SAVELAYOUT: string = "Save Layout";
