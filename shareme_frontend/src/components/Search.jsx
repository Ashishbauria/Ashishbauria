import React, { useState, useEffect } from "react";

import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import { feedQuery, searchQuery } from "../utils/data";


const Search = ({ searchTerm}) => {
  const [pins, setPins] = useState(null);
  

  useEffect(() => {
    if (searchTerm) {
      const query = searchQuery(searchTerm.toLowerCase());
      client.fetch(query).then((data) => setPins(data));
    } else {
      client.fetch(feedQuery).then((data) => setPins(data));
    }
  }, [searchTerm]);

  return (
    <div>
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length !== 0 && searchTerm !== "" && <p> no pins found</p>}
    </div>
  );
};

export default Search;
