import { Routes, Route } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import { MainPage, ComicsPage, Page404, SinglePage } from "../../pages";
import SingleCharacterLayout from "../../pages/singleCharacterLayout/SingleCharacterLayout";
import SingleComicLayout from "../../pages/singleComicLayout/SingleComicLayout";

const App = () => {
  return (
    <div className="app">
      <AppHeader />
      <main>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="comics" element={<ComicsPage />} />
          <Route
            exact
            path="comics/:id"
            element={
              <SinglePage Component={SingleComicLayout} dataType="comic" />
            }
          />
          <Route
            path="characters/:id"
            element={
              <SinglePage
                Component={SingleCharacterLayout}
                dataType="character"
              />
            }
          />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
