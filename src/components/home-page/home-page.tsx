import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useBoardsContext from '../context/useBoardsContext';
import AddListOrCard from './add-list-card';
import { CARD, LIST } from '../constats';
import { FaEllipsisV } from 'react-icons/fa';
import Popover from '../../utils/popover';
import { ActionTypes, List } from '../../utils/types';

// Under Development
const HomePage: React.FC = () => {
  const {
    state: { currentActiveBoard, boards },
    dispatch,
  } = useBoardsContext();
  const [toAddList, setIsToAddList] = useState(true);
  const [toAddCard, setIsToAddCard] = useState(false);
  const [currentActiveList, setCurrentActiveList] = useState<
    number | undefined
  >(undefined);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [boardData, setBoardData] = useState<List[] | []>(
    currentActiveBoard
      ? boards[Number(currentActiveBoard?.split('-').pop())].lists
      : []
  );

  if (isNaN(Number(currentActiveBoard?.split('-').pop())) || !boards.length) {
    return (
      <div className='home'>
        <span className='initial-home'>Please create a board!</span>
      </div>
    );
  }

  const listHasItems = !!boards.find((board) => board.id === currentActiveBoard)
    ?.lists.length;

  const handleOpenAction = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const popoverItems = [
    {
      title: 'Discard this list',
      handleClick: (list: List) =>
        dispatch({ type: ActionTypes.REMOVE_LIST, payload: list }),
    },
    {
      title: 'Discard all cards in this list',
      handleClick: (list: List) => {},
    },
  ];

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // If dropped outside the list
    if (!destination) return;
    console.log('result', result);

    // Handle the logic for reordering items
    const updatedData = [...boardData]; // Clone the data to avoid mutating state directly

    // ... logic to reorder items and/or sublists

    setBoardData(updatedData);
  };

  return (
    <div className='home'>
      {listHasItems && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='lists' type='LIST' direction='horizontal'>
            {(provided) => (
              <div>
                {boards
                  ?.filter((board) => board.id === currentActiveBoard)
                  ?.map(({ lists }, index) => (
                    <div key={`board-${index}`} className='list-container'>
                      {lists?.map((list, ind) => (
                        <Droppable
                          key={`droppable-${list.listName}-${ind}`}
                          droppableId={`list-droppable-${ind}`}
                          type='LIST'
                        >
                          {(provided) => (
                            <div
                              key={`${list.listName}-${ind}`}
                              className='list-content'
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              <div className='list-title'>
                                <h4>{list.listName}</h4>
                                <span
                                  className='actions-icon'
                                  onClick={handleOpenAction}
                                >
                                  <FaEllipsisV />
                                </span>
                                <Popover
                                  title='List actions'
                                  children={popoverItems}
                                  anchorEl={anchorEl}
                                  onClose={() => setAnchorEl(null)}
                                  data={list}
                                />
                              </div>

                              <div>
                                {list.cards.map((card, cardIndex) => (
                                  <Draggable
                                    key={card.cardId}
                                    draggableId={card.cardId}
                                    index={cardIndex}
                                  >
                                    {(provided) => (
                                      <div className='card-content'>
                                        {card.cardName}
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>

                              <AddListOrCard
                                toAdd={
                                  currentActiveList !== undefined
                                    ? ind !== currentActiveList && !toAddCard
                                    : true
                                }
                                title='Add a Card'
                                handleAdd={() => {
                                  setIsToAddList(true);
                                  setIsToAddCard(false);
                                  setCurrentActiveList(ind);
                                }}
                                handleClose={() => {
                                  setIsToAddCard(true);
                                  setCurrentActiveList(undefined);
                                }}
                                type={CARD}
                                id={ind}
                              />
                            </div>
                          )}
                        </Droppable>
                      ))}
                      {provided.placeholder}
                    </div>
                  ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <AddListOrCard
        toAdd={toAddList}
        title={listHasItems ? 'Add another list' : 'Add a list'}
        handleAdd={() => {
          setCurrentActiveList(undefined);
          setIsToAddCard(true);
          setIsToAddList(false);
        }}
        handleClose={() => setIsToAddList(true)}
        type={LIST}
      />
    </div>
  );
};

export default HomePage;
