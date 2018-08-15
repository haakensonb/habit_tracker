import React from 'react';

export default function Home(props){
  return (
  <div>
    <section className="hero">
    <div className="hero-body">
      <div className="container has-text-centered">
        <h1 className="title">
          Habit Tracker
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
  </section>
  </div>
  )
}