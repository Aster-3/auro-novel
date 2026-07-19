import { Screen } from "../components/layout/Screen";
import { useState } from "react";
import { SearchHeader } from "../Features/SearchScreen/SearchHeader";
import { SearchResults } from "@/Features/SearchScreen/SearchResults";
import { useDebounce } from "@/utils/useDebounce";

const SearchScreen = () => {
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce(value, 250);

  return (
    <Screen>
      <SearchHeader value={value} setValue={setValue} />
      <SearchResults query={debouncedValue} />
    </Screen>
  );
};
export default SearchScreen;
