import React from 'react'

function Habit(props) {
  return (
    <div>
      <p>Habit</p>
      <p>Name: {props.name}</p>
      <p>Description: {props.description}</p>
    </div>
  );
}

export default Habit;