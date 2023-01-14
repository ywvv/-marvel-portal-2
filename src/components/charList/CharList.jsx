import { Component } from "react";

import "./charList.scss";

import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/errorMessage";

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.marvelService
      .getAllCharacters()
      .then(this.onCharListLoaded)
      .catch(this.onError);
  }

  onCharListLoaded = (charList) => {
    this.setState({
      charList,
      loading: false,
    });
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  render() {
    const { charList, loading, error } = this.state;

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

        <button className="button button__main button__long">
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

export default CharList;
