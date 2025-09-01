import { createContext, useState } from "react";

export const querySearch = createContext({ setQuerySearch: () => {} });

const QuerySearchProvider = ({ children }) => {
  const [keyword, setKeyword] = useState("");

  const setQuerySearch = (e) => {
    setKeyword(e.target.value);
  };

  return (
    <querySearch.Provider value={{ keyword, setQuerySearch }}>
      {children}
    </querySearch.Provider>
  );
};

export default QuerySearchProvider;
