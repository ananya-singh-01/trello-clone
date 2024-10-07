import { FaTimes } from 'react-icons/fa';
import CustomAddButton from '../../utils/custom-add-button';
import { ActionTypes, ArrayElement, Card, List } from '../../utils/types';
import { CARD, LIST } from '../constats';
import Input from './input';
import { useState } from 'react';
import useBoardsContext from '../context/useBoardsContext';

const LayoutType = [LIST, CARD];

const AddListOrCard = ({
  toAdd,
  title,
  handleAdd,
  handleClose,
  type,
  id,
}: {
  toAdd: boolean;
  title: string;
  handleAdd: () => void;
  handleClose: () => void;
  type: ArrayElement<typeof LayoutType>;
  id?: number;
}) => {
  const {
    state: { boards, currentActiveBoard },
    dispatch,
  } = useBoardsContext();
  const initialListData = {
    listId: '',
    listName: '',
    boardId: currentActiveBoard,
    cards: [],
  };
  const initialCardData = {
    boardId: currentActiveBoard,
    listId: '',
    cardId: '',
    cardName: '',
  };
  const [listData, setListData] = useState<List>(initialListData);
  const [cardData, setCardData] = useState<Card>(initialCardData);

  const handleCancel = () => {
    handleClose();
    setListData(initialListData);
    setCardData(initialCardData);
  };

  const handleAddItem = () => {
    if (type === LIST) {
      dispatch({ type: ActionTypes.ADD_NEW_LIST, payload: listData });
    } else if (cardData.cardId.length) {
      dispatch({ type: ActionTypes.ADD_NEW_CARD, payload: cardData });
    }
    handleCancel();
  };

  const currentLists = boards
    .filter((board) => board.id === currentActiveBoard)
    .map((board) => board.lists);

  // console.log('currentLists', currentLists[0]);

  const handleNewItemCreate = () => {
    if (type === LIST) {
      setListData((prev) => ({
        ...prev,
        listId: `list-${currentLists[0].length}`,
      }));
    } else if (id !== undefined) {
      const cardId = currentLists[0][id].cards.length;
      setCardData((prev) => ({
        ...prev,
        cardId: `card-${cardId}`,
        listId: `list-${id}`,
      }));
    }
    handleAdd();
  };

  return (
    <div>
      {toAdd ? (
        <CustomAddButton title={title} handleClick={handleNewItemCreate} />
      ) : (
        <div className={type === LIST ? 'add-list-item' : 'add-card-item'}>
          <Input
            inputType={type === LIST ? 'text' : 'textarea'}
            value={type === LIST ? listData.listName : cardData.cardName}
            setValue={(val) => {
              if (type === LIST) {
                setListData((prev) => ({ ...prev, listName: val }));
              } else {
                setCardData((prev) => ({ ...prev, cardName: val }));
              }
            }}
            placeholder={
              type === LIST ? 'Enter list name...' : 'Enter card name...'
            }
          />
          <div className='action-btns'>
            <button
              onClick={handleAddItem}
              className='primary-add-btn'
              disabled={type === CARD ? !cardData.cardName : !listData.listName}
            >
              Add {type === LIST ? 'List' : 'Card'}
            </button>
            <button onClick={handleCancel} className='cancel-btn'>
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddListOrCard;
