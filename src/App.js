import {useEffect, useState} from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = "http://10.65.132.116:3000";

/*
* Plan:
*   1. Define backend url
*   2. Get items and show them +
*   3. Toggle item done +
*   4. Handle item add +
*   5. Delete +
*   6. Filter
*
* */

function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

    const handleAddItem = () => {
        axios.post(`https://api.todoist.com/rest/v1/tasks`,
            {
                content: itemToAdd,
                done: false
            },{
                headers: {
                    Authorization: 'Bearer 648d7356f754af0e9021788e1898b1a5f91f5ff4'
                }
            }).then((response) => {
            setItems([ ...items, response.data])
        })
        setItemToAdd("");
        console.log(items);
    };
  const toggleItemDone = (item) => {
      const {id, completed, completed_date} = item;
      if(completed_date){
          axios.post(`https://api.todoist.com/rest/v1/tasks/${item.task_id}/reopen`, {},{
              headers: {
                  Authorization: 'Bearer 648d7356f754af0e9021788e1898b1a5f91f5ff4',
              }
          }).then((response)=>{
              setItems(items.map((item) => {
                  if (item.id === id) {
                      return {
                          ...item,
                          completed: !completed
                      }
                  }
                  return item
              }))
          })

      }else{
          axios.post(`https://api.todoist.com/rest/v1/tasks/${id}/close`, {
              completed: !completed
          },{
              headers: {
                  Authorization: 'Bearer 648d7356f754af0e9021788e1898b1a5f91f5ff4',
              }
          }).then((response) => {
              console.log(response)
              setItems(items.map((item) => {
                  if (item.id === id) {
                      return {
                          ...item,
                          completed: !completed
                      }
                  }
                  return item
              }))

          })
      }

  };
  const handleCompletedItems=()=>{
      axios.get(`https://api.todoist.com/sync/v8/completed/get_all`, {
          headers:{
              Authorization: 'Bearer 648d7356f754af0e9021788e1898b1a5f91f5ff4'
          },
      }).then((response)=>{
          setItems(response.data.items)
      })
  }
  // N => map => N
    // N => filter => 0...N
  const handleItemDelete = (id) => {
      axios.delete(`https://api.todoist.com/rest/v1/tasks/${id}`, {
          headers:{
              Authorization: 'Bearer 648d7356f754af0e9021788e1898b1a5f91f5ff4'
          },
      }).then((response) => {
          console.log('Было:',items)
          const newItems = items.filter((item) => {
              return id !== item.id
          })
          console.log('Осталось:',newItems)
          setItems(newItems)
      })
  };
  useEffect(() => {
      axios.get(`https://api.todoist.com/rest/v1/tasks`, {
          headers:{
              Authorization: 'Bearer 648d7356f754af0e9021788e1898b1a5f91f5ff4'
          },
      }).then((response) => {
          setItems(response.data);
          console.log(response.data);
      })
  }, [])
const activeItems =()=>{
    axios.get(`https://api.todoist.com/rest/v1/tasks`, {
        headers:{
            Authorization: 'Bearer 648d7356f754af0e9021788e1898b1a5f91f5ff4'
        },
    }).then((response) => {
        setItems(response.data);
        console.log(response.data);
    })
};
  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
          <button id="chmola" onClick={activeItems}>Active</button>
          <button id="bola" onClick={handleCompletedItems}>Completed</button>

      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemDone(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
