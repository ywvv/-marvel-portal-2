import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/errorMessage";

import "./charList.scss";

const CharList = ({ onCharSelected }) => {
  const [charList, setCharList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemsLoading, setNewItemsLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const marvelService = new MarvelService();

  useEffect(() => {
    onRequest();
  }, []);

  const onRequest = (offset) => {
    onCharListLoading();
    marvelService
      .getAllCharacters(offset)
      .then(onCharListLoaded)
      .catch(onError);
  };

  const onCharListLoading = () => {
    setNewItemsLoading(true);
  };

  const onCharListLoaded = (newCharList) => {
    let isEnded = newCharList.length < 9;

    setCharList((charList) => [...charList, ...newCharList]);
    setLoading(false);
    setNewItemsLoading(false);
    setOffset((offset) => offset + 9);
    setCharEnded(isEnded);
  };

  const onError = () => {
    setLoading(false);
    setError(true);
  };

  const itemRefs = useRef([]);

  const focusOnItem = (id) => {
    itemRefs.current.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    itemRefs.current[id].classList.add("char__item_selected");
    itemRefs.current[id].focus();
  };

  const renderItems = (arr) => {
    const noImage =
      "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";

    const items = arr.map((item, i) => {
      const isHasImg = item.thumbnail === noImage;

      return (
        <li
          className="char__item"
          tabIndex={0}
          ref={(el) => (itemRefs.current[i] = el)}
          key={item.id}
          onClick={() => {
            onCharSelected(item.id);
            focusOnItem(i);
          }}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              onCharSelected(item.id);
              focusOnItem(i);
            }
          }}
        >
          <img
            src={item.thumbnail}
            alt={item.name}
            style={isHasImg ? { objectFit: "fill" } : null}
          />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });
    return <ul className="char__grid">{items}</ul>;
  };

  const items = renderItems(charList);

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error) ? items : null;

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {content}
      <button
        className="button button__main button__long"
        disabled={newItemsLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
