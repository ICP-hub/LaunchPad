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
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'white', // Change text color to white
    fontWeight:'bold'
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    display: 'inline-flex',
    alignItems: 'center',
    color: 'white',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  }),
  input: (provided) => ({
    ...provided,
    color: 'white', // Input text color
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: 'white', // Single value text color
  }),
});

export default getReactSelectStyles;
