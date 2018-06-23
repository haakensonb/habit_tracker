import React from 'react';

const NoMatch = ({location}) => {
  return (
    <div>
      <h3>
        No match for {location.pathname}
      </h3>
    </div>
  )
}

export default NoMatch;