import React from "react";

export interface SimpleStoreState {
  selectedPage: string;
  setSelectedPage: (page: string) => void;
}
export const SimpleStore = React.createContext<SimpleStoreState>(
  { selectedPage: '', setSelectedPage: () => undefined }
);
