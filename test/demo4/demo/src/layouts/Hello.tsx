import React from 'react';
interface HelloProps {
  username: string;
}   
export default function Hello({username}:HelloProps) {
  return (
    <div style={{ textAlign:'center',color:'antiquewhite',fontSize:'25px'}}>
      <h2 style={{cursor:'default'}}>Welcome,{username}</h2>
    </div>
  );
}