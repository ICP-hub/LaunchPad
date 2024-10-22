import React from 'react';

export const getReactSelectStyles = (error) => ({
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  control: (provided, state) => ({
    ...provided,
    paddingBlock: '2px',
    borderRadius: '8px',
    borderColor: error ? 'white' : state.isFocused ? 'white' : 'white',
    border: error ? '2px solid white' : '2px solid white',
    backgroundColor: '#333333',
    '&::placeholder': {
      color: 'currentColor',
    },
    display: 'flex',
    overflowX: 'auto',
    maxHeight: '43px',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    overflow: 'scroll',
    maxHeight: '40px',
    scrollbarWidth: 'none',
    backgroundColor: '#333333',
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: 'rgb(107 114 128)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  multiValue: (provided) => ({
    ...provided,
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: 'grey',
    border: '1px solid white',
    borderRadius: '7px',
    color: 'white', 
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    display: 'inline-flex',
    alignItems: 'center',
    color: 'white',
  }),
});

export default getReactSelectStyles;