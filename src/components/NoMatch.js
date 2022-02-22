import React from 'react';

const NoMatch = ({location}) => {
  return (
    <section className='section'>
      <h3 className='title'>
        No match for {location.pathname}
      </h3>
    </section>
  )
}

export default NoMatch;