import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function HabitForm(props) {
  return (
    <section className='section'>
      <form onSubmit={props.handleSubmit}>
        <h3 className='title'>
        {props.title}
        &nbsp;
        <span className='icon'><i className='fas fa-pen has-text-primary'></i></span>
        </h3>

        <div className='field'>
          <label className='label'>
          Name:
            <div className='control'>
              <input className='input' type="text" name="name" value={props.name} onChange={props.handleChange}/>
            </div>
          </label>
        </div>

        <div className='field'>
          <label className='label'>
          Description:
            <div className='control'>
            <input className='input' type="text" name="description" value={props.description} onChange={props.handleChange}/>
            </div>
          </label>       
        </div>

        <div className='field'>
          <label className='label'>
            Start Date:
            <div className='control'>
            <DatePicker
            className='input'
            dateFormat="MM/DD/YYYY"
            selected={props.startDate}
            onChange={props.handleDateChange}/>
            </div>
          </label>
        </div>

        <div className='control'>
          <input className='button is-primary' type="submit" value="Submit"/>
        </div>
      </form>
    </section>
  );
}
