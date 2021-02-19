import React from 'react';

export const navigationRef = React.createRef()

const naviagte = (target, params) => {
    navigationRef.current?.navigate(target, params)
}

export default {
    naviagte, 
}