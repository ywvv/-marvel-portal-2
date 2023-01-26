import { useState, useEffect, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/errorMessage";
import useMarvelService from "../../services/MarvelService";

import "./charList.scss";

const setContent = (process, Component, newItemsLoading) => {
  switch (process) {
    case "waiting":
      return <Spinner />;
    case "loading":
      return newItemsLoading ? <Component /> : <Spinner />;
    case "confirmed":
      return <Component />;
    case "error":
      return <ErrorMessage />;
    default:
      throw new Error("Unexpected process state");
  }
};

const CharList = ({ onCharSelected }) => {
  const [charList, setCharList] = useState([]);
  const [newItemsLoading, setNewItemsLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const { getAllCharacters, process, setProcess } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemsLoading(false) : setNewItemsLoading(true);
    getAllCharacters(offset)
      .then(onCharListLoaded)
      .then(() => setProcess("confirmed"));
  };

  const onCharListLoaded = (newCharList) => {
    let isEnded = newCharList.length < 9;

    setCharList((charList) => [...charList, ...newCharList]);
    setNewItemsLoading(false);
    setOffset((offset) => offset + 9);
    setCharEnded(isEnded);
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
        <CSSTransition key={item.id} timeout={500} classNames="char__item">
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
        </CSSTransition>
      );
    });
    return (
      <ul className="char__grid">
        <TransitionGroup component={null}>{items}</TransitionGroup>
      </ul>
    );
  };

  return (
    <div className="char__list">
      {setContent(process, () => renderItems(charList), newItemsLoading)}
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
