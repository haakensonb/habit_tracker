import React from 'react'
import Link from 'react-router-dom/Link';

export default function Habit(props) {

  const daysComplete = props.entries.filter((entry) => {
    return entry.status === 'complete'
  }).length;

  // in this case I will round up rather than down because I'm not sure it matters
  // percent must be turned into whole number (multiplied by 100)
  // because Math.round rounds to integers
  const percentComplete = Math.round((daysComplete / 49) * 100);

  return (
    <div>
      <p>Habit</p>
      <p>Name: {props.name}</p>
      <p>Days Complete: {daysComplete}</p>
      <p>Percent Complete: {percentComplete}%</p>
      <p>Started: {props.startDate}</p>
      {/* not sure that I actually want to show description here */}
      {/* <p>Description: {props.description}</p> */}
      <Link to={`/habit/${props.id}`}>See details</Link>
    </div>
  );
}
