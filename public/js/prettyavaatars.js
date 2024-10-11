import React from 'react';
import ReactDOM from 'react-dom';
import Avatar from 'prettyavatars';

ReactDOM.render(
  <Avatar
    variant='beam'
    name='John Doe'
    size={425}
    colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
  />,
  document.getElementById('avatar-root') // Target the div with this ID
);
