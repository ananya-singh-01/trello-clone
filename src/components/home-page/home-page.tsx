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

    console.log('result________', result);

    // If dropped outside the list
    if (!destination) return;
    console.log('result', result);

    // Check if the item was dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceListIndex = boardData.findIndex(
      (list) => list.listId === source.droppableId
    );
    const destinationListIndex = boardData.findIndex(
      (list) => list.listId === destination.droppableId
    );

    const sourceList = boardData[sourceListIndex];
    const destinationList = boardData[destinationListIndex];
    console.log(sourceListIndex, destinationListIndex, sourceList, destinationList)

    // Handle the logic for reordering items
    // Moving cards between lists
    if (source.droppableId !== destination.droppableId) {
      const sourceCards = sourceList?.cards
      console.log('sourceCards', sourceCards)
      const [removed] = sourceCards?.splice(source.index, 1); // Remove card from source
      const destinationCards = destinationList?.cards
      console.log('destinationCards', destinationCards)
      destinationCards.splice(destination.index, 0, removed); // Add card to destination

      // Update lists state
      const updatedLists = boardData.map((list, index) => {
        if (index === sourceListIndex) {
          return { ...list, cards: sourceCards }; // Update source list
        }
        if (index === destinationListIndex) {
          return { ...list, cards: destinationCards }; // Update destination list
        }
        return list;
      });

      setBoardData(updatedLists); // Set the updated lists
    } else {
      // Reordering cards within the same list
      const cards = Array.from(sourceList.cards);
      const [removed] = cards.splice(source.index, 1); // Remove card from source
      cards.splice(destination.index, 0, removed); // Add card to new position

      // Update lists state
      const updatedLists = boardData.map((list, index) => {
        if (index === sourceListIndex) {
          return { ...list, cards }; // Update source list with reordered cards
        }
        return list;
      });

      setBoardData(updatedLists); // Set the updated lists
    }
  };

  console.log('board Data', boardData);

  return (
    <div className='home'>
      {listHasItems && (
        <DragDropContext onDragEnd={onDragEnd}>
          {boards
            ?.filter((board) => board.id === currentActiveBoard)
            ?.map(({ lists }, index) => (
              <div key={`board-${index}`} className='list-container'>
                {lists.map((list, ind) => (
                  <Droppable
                    key={`droppable-${list.listId || ind}`} // Ensure this is unique
                    droppableId={`drop-${list.listId || ind}`} // Use listId if available
                    type='LIST'
                  >
                    {(provided) => (
                      <div
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
                              key={`draggable-${list.listId}-${card.cardId}`}
                              draggableId={`drag-${list.listId}-${card.cardId}`}
                              index={cardIndex}
                            >
                              {(provided) => (
                                <div
                                  className='card-content'
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef} // Make sure to use the ref
                                >
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
              </div>
            ))}
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
