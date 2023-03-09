import React from 'react';
import Skeleton from '@mui/material/Skeleton';

function Loading () {
  return (
    <Skeleton variant="rectangular" height="8vh" width="calc(100% - 30px)" style={{margin: "15px", marginBottom: 0, borderRadius: "8px"}} />
  )
}

export default Loading;