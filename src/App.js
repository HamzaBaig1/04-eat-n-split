import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {

  const [isOpen, setIsOpen] = useState(false)
  const [listFriend, setListFriend] = useState(initialFriends)
  const [selectFriend, setSelectFriend] = useState(null)

  function friendChangeHandler() {
    setIsOpen(open => !open)
    console.log('clicked')
  }


  function getFriends(friends) {
    setListFriend((friend) => [...friend, friends])
    setIsOpen(false)

  }

  function handleSelection(friend) {
    setSelectFriend((curr) => curr?.id === friend.id ? null : friend)
    setIsOpen(false)
  }

  function handleSubmitBill(value) {
    console.log(value)
    setListFriend((friends) => friends.map((friend) => friend.id === selectFriend.id ? { ...friend, balance: friend.balance + value } : friend))
    setSelectFriend(null)
  }
  return <div className="app">

    <div className="sidebar">

      <FriendList listFriend={listFriend} onSelection={handleSelection} selectFriend={selectFriend} />

      {isOpen && <FormAddFriend addFriend={getFriends} />}

      <Button onClick={friendChangeHandler}>{isOpen ? 'Close' : 'Add Friend'}</Button>

    </div>

    {selectFriend && <FormSplitBill selectedFriend={selectFriend} onSplitBill={handleSubmitBill} key={selectFriend.id} />}

  </div>
}

function FriendList({ listFriend, onSelection, selectFriend }) {

  // const friends = initialFriends;
  return <ul>
    {listFriend.map(friend => <Friends friends={friend} key={friend.id} onSelection={onSelection} selectFriend={selectFriend} />)}
  </ul>

}

function Friends({ friends, onSelection, selectFriend }) {
  const isSelected = selectFriend?.id === friends.id
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friends.image} alt={friends.name} />
      <h3>{friends.name}</h3>
      {friends.balance < 0 && <p className="red">You Owe {friends.name} ${Math.abs(friends.balance)} </p>}
      {friends.balance > 0 && <p className="gree">{friends.name} Owes You ${friends.balance} </p>}
      {friends.balance === 0 && <p>You and {friends.name} are Even </p>}
      <Button onClick={() => onSelection(friends)}>{isSelected ? 'close' : 'select'}</Button>
    </li>
  )

}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>{children}</button>
  )
}

function FormAddFriend({ addFriend }) {

  const [name, setName] = useState('')
  const [image, setImage] = useState("https://i.pravatar.cc/48")

  function submitHandler(e) {
    e.preventDefault();
    const id = crypto.randomUUID();

    const newFriend = {
      name,
      image: `${image}?=${id}`,
      id,
      balance: 0
    }
    addFriend(newFriend)
    setName('')
    setImage('https://i.pravatar.cc/48')
  }

  return <form className="form-add-friend" onSubmit={submitHandler}>

    <label>🕺 Friend Name </label>
    <input type="text" value={name} onChange={e => setName(e.target.value)} />


    <label>🌆 Image Url</label>
    <input type="text" value={image} onChange={e => setImage(e.target.value)} />


    <Button>Add</Button>
  </form>
}

function FormSplitBill({ selectedFriend, onSplitBill }) {

  const [bill, setBill] = useState("")
  const [paidByUser, setPaidByUser] = useState("")
  const [whoIsPaying, setWhoIsPaying] = useState("user")

  const friendExpense = bill ? bill - paidByUser : '';

  function formSubmitHandler(e) {
    e.preventDefault()
    onSplitBill(whoIsPaying === 'user' ? friendExpense : -paidByUser)
  }
  return (
    <form className="form-split-bill">
      <h2>Split Bill with {selectedFriend.name}</h2>

      <label>💸 Bill Value </label>
      <input type="text" value={bill} onChange={e => setBill(Number(e.target.value))} />

      <label>🕺 Your Expense</label>
      <input type="text" value={paidByUser} onChange={e => setPaidByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value))} />

      <label > 🤑 Who Is Paying ?</label>
      <select value={whoIsPaying} onChange={e => setWhoIsPaying(e.target.value)} >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <label>🕴 {selectedFriend.name} Expense</label>
      <input type="text" disabled value={friendExpense} />

      <Button onClick={formSubmitHandler}>Split Bill</Button>
    </form>
  )
}
