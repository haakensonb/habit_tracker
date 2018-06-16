import React from 'react'
import Link from 'react-router-dom/Link';

export default function Habit(props) {
  return (
    <div>
      <p>Habit</p>
      <p>Name: {props.name}</p>
      <p>Description: {props.description}</p>
      <Link to={`/habit/${props.id}`}>See details</Link>
    </div>
  );
}
