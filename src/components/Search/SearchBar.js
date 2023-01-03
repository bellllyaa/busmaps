import React from "react";

function SearchBar () {
  return (
    <div>
      <input
        id="search"
        autocapitalize="none"
        autocomplete="off"
        autocorrect="off"
        name="search_query"
        tabindex="0"
        type="text"
        spellcheck="false"
        placeholder="Szukaj"
        aria-label="Szukaj"
        role="combobox"
        aria-haspopup="false"
        aria-autocomplete="list"
        class="gsfi ytd-searchbox"
        dir="ltr"
        style="border: none; padding: 0px; margin: 0px; height: auto; width: 100%; outline: none;"
      ></input>;
    </div>
  )
}

export default SearchBar;