import React, { useState } from "react";
import { Home } from "../styles/common-styles";
import useBoardsContext from "../context/useBoardsContext";
import AddListOrCard from "./add-list-card";
import { LIST } from "../constats";

// Under Development
const HomePage: React.FC = () => {
  const {
    state: { currentActiveBoard, boards },
  } = useBoardsContext();
  const [toAddList, setIsToAddList] = useState(false);

  return (
    <Home>
      <div>
        {currentActiveBoard &&
          boards
            ?.filter((board) => board.id === currentActiveBoard)
            ?.map(({ cards }) => (
              <div>
                {cards?.map((card) => (
                  <span>{card.cardName}</span>
                ))}
              </div>
            ))}
      </div>
      <AddListOrCard
        toAdd={toAddList}
        title={boards.length ? "Add another list" : "Add a list"}
        handleAdd={() => setIsToAddList(false)}
        handleClose={() => setIsToAddList(true)}
        type={LIST}
      />
    </Home>
  );
};

export default HomePage;
