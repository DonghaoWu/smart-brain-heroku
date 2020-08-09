import React from 'react';
import './FaceRecognition.css';
import { v4 as uuidv4 } from 'uuid';

const FaceRecognition = ({ imageUrl, boxes }) => {
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputimage' alt='' src={imageUrl} width='500px' heigh='auto'/>
        {
          boxes.map(box =>{
             return <div key={uuidv4()} className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
          })
        }
      </div>
    </div>
  );
}

export default FaceRecognition;