import React from "react";
import { useState, useEffect } from "react";
import AddTask from "./components/AddTask";
import Header from "./components/Header";
import Tasks from "./components/Tasks";

function App() {

  const [showAdd, setShowAdd] = useState(false)
  
  const [tasks, setTasks ] = useState([
    // {
    //     id: 1,
    //     text: 'Doctors Appointment',
    //     day: 'Feb 5th at 2:30pm',
    //     reminder: true,
    // },
    // {
    //     id: 2,
    //     text: 'Meeting at School',
    //     day: 'Feb 6th at 1:30pm',
    //     reminder: true,
    // },
    // {
    //     id: 3,
    //     text: 'Food Shopping',
    //     day: 'Feb 5th at 2:30pm',
    //     reminder: false,
    // }
  ])

  useEffect(()=>{
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  const fetchTasks = async()=>{
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data;
  }

  const fetchTask = async(id)=>{
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data;
  }

  const addTask =async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()
    
    setTasks([...tasks, data])


    // const id = Math.floor(Math.random()*10000) + 1
    // const newTask = {id, ...task}
    // setTasks([...tasks, newTask]);
  }

  const deleteTask =async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    })
    setTasks(tasks.filter((task) => task.id!==id))
  }

  const toggleReminder = async (id) =>{
    const taskToToggle = await fetchTask(id)
    const upTask = { ...taskToToggle, reminder:!taskToToggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`,{
      method:'PUT',
      headers:{
        'Content-type':'application/json'
      },
      body: JSON.stringify(upTask)
    })

    await res.json()

    setTasks(
      tasks.map((task)=> task.id===id ? 
        { ...task, 
          reminder: !task.reminder } 
        : task
        ))
  }


  return (
    <div className="container">
      <Header 
        onAdd={()=> setShowAdd(!showAdd)}
        showAdd={showAdd}
      />
      {showAdd && <AddTask onAdd={addTask} />}
      {tasks.length>0 ? (<Tasks tasks={tasks} 
      onDelete={deleteTask} onToggle={toggleReminder}  /> )
      : 
      ('No tasks to show')}
    </div>
  );
}

// class App extends React.Component{
//   render (){
//     return (
//       <div>
//         <h1>Hello from class</h1>
//       </div>
//     );
//   }
// }

export default App;
