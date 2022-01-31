import React from 'react';

export default function Home(props){
  return (
  <div>
    <section className="hero">
    <div className="hero-body">
      <div className="container has-text-centered">
        <h1 className="title">
          <span className='icon'><i className='fas fa-times has-text-success'></i></span>
          &nbsp;
          Habit Tracker
          &nbsp;
          <span className='icon'><i className='far fa-circle has-text-danger'></i></span>
        </h1>
        <h2 className="subtitle">
          Form new habits!
        </h2>
      </div>
    </div>
  </section>
  <section className="section">
    <p className=''>Use <a className='is-link' target="_blank" rel="noopener noreferrer" href='https://www.reddit.com/r/theXeffect/'>the Xeffect</a> to form new habits.
     Pick a new habit and try to do it every day for 49 days. Each day that is completed will be marked with an X. Try not to break your streak. At the end of the 
     49 days you should have solidified a new habit!</p>
    <br></br>
    <p>Source code for this project can be found <a target="_blank" href="https://github.com/haakensonb/habit_tracker">on Github.</a></p>
  </section>
  <section className='section'>
    <h3 className="has-text-weight-bold">Demo</h3>
      <p>Habit Tracker can be tried out using the demo account.<br></br>
        Username: DemoAccount <br></br>
        Password: habitTester123</p>
      <p className="has-text-weight-bold">Demo account can be used by anyone and anyone can view its data. If you want your private data to persist you must register your own account.</p>
  </section>

  </div>
  )
}