import React from 'react';

export const getReactSelectStyles = (error) => ({
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  control: (provided, state) => ({
    ...provided,
    paddingBlock: '2px',
    borderRadius: '8px',
    borderColor: error ? '#ef4444' : state.isFocused ? '#737373' : '#D1D5DB',
    border: error ? '2px solid #ef4444' : '2px solid #D1D5DA',
    backgroundColor: 'rgb(249 250 251)',
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
    backgroundColor: 'white',
    border: '2px solid #E3E3E3',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    display: 'inline-flex',
    alignItems: 'center',
  }),
});

export default getReactSelectStyles;