import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function HabitForm(props) {
  return (
    <div>
      <form onSubmit={props.handleSubmit}>
        <h3>{props.title}</h3>

        <label>
        Name:
          <input type="text" name="name" value={props.name} onChange={props.handleChange}/>
        </label>

        <br />

        <label>
        Description:
          <input type="text" name="description" value={props.description} onChange={props.handleChange}/>
        </label>

        <br />

        <label>
          Start Date:
          <DatePicker
          dateFormat="MM/DD/YYYY"
          selected={props.startDate}
          onChange={props.handleDateChange}/>
        </label>

        <br />

        <input type="submit" value="Submit"/>
      </form>
    </div>
  );
}
