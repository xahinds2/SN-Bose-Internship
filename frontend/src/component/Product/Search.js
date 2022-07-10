import React, { useState, Fragment } from "react";
import MetaData from "../layout/MetaData";
import "./Search.css";
import {useHistory} from 'react-router-dom';
import {BsSearch} from 'react-icons/bs'

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const history = useHistory()
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/products/${keyword}`);
    } else {
      history.push("/products");
    }
  };

  return (
    <Fragment>
      <MetaData title="Search A Product -- ECOMMERCE" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product ..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit"><BsSearch/></button>
      </form>
    </Fragment>
  );
};

export default Search;
