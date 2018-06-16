import React from 'react'

export default function Habit(props) {
  return (
    <div>
      <p>Habit</p>
      <p>Name: {props.name}</p>
      <p>Description: {props.description}</p>
    </div>
  );
}
