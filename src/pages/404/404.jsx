import { Link } from "react-router-dom";

import ErrorMessage from "../../components/errorMessage/errorMessage";

import "./404.scss";

const Page404 = () => {
  return (
    <div className="not-found">
      <ErrorMessage />
      <p>Page doesn't exist</p>
      <Link to="/">Back to main page</Link>
    </div>
  );
};

export default Page404;
