import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client} from "../client";
import MasonryLayout from "./MasonryLayout";

import { feedQuery, searchQuery } from "../utils/data";

const Feed = () => {
  const [loading, setLoading] = useState(false);

  const [pins, setPins] = useState(null);

  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);

    if (categoryId) {

      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => setPins(data));
      

    } else {

      client.fetch(feedQuery).then((data) => setPins(data));
      
    }
  }, [categoryId]);

  
  if(!pins?.length) return <p> No pins in this catergory</p>

  return <div>{pins && <MasonryLayout pins={pins}/>}</div>;
};

export default Feed;
