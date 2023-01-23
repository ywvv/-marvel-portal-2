import { Component } from "react";
import PropTypes from "prop-types";

import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/errorMessage";

import "./charList.scss";

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
    newItemsLoading: false,
    offset: 1548,
    charEnded: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }

  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  onCharListLoading = () => {
    this.setState({
      newItemsLoading: true,
    });
  };

  onCharListLoaded = (newCharList) => {
    let isEnded = newCharList.length < 9;

    this.setState(({ offset, charList }) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemsLoading: false,
      offset: offset + 9,
      charEnded: isEnded,
    }));
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  render() {
    const { charList, loading, error, newItemsLoading, offset, charEnded } =
      this.state;

    return (
      <div className="char__list">
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorMessage />
        ) : (
          <View
            charList={charList}
            onCharSelected={this.props.onCharSelected}
          />
        )}

        <button
          className="button button__main button__long"
          disabled={newItemsLoading}
          onClick={() => this.onRequest(offset)}
          style={{ display: charEnded ? "none" : "block" }}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

const View = ({ charList, onCharSelected }) => {
  const noImage =
    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";

  return (
    <ul className="char__grid">
      {charList.map((char) => {
        const isHasImg = char.thumbnail === noImage;

        return (
          <li
            className="char__item"
            key={char.id}
            onClick={() => onCharSelected(char.id)}
          >
            <img
              src={char.thumbnail}
              alt={char.name}
              style={isHasImg ? { objectFit: "fill" } : null}
            />
            <div className="char__name">{char.name}</div>
          </li>
        );
      })}
    </ul>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
