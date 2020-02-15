import { GStyles } from 'gs-forms';
import { GTableStyles } from 'gs-tables';

export const gsFormStyles: GStyles = {
  color: {
    font: '#fcf9f8',
    primary: '#faba53',
    secondary: '#aa7f46',
    neutral: '#757574',
    white: null
  },
  ui: {
    fontSize: '1rem',
    input: {
      padding: '.6rem .8rem',
      color: '#fcf9f8',
      background: '#333333',
      borderSize: '0'
    },
    primaryButton: {
      padding: '.6rem .8rem',
      color: '#181818',
      background: '#faba53',
      borderColor: '#faba53',
      borderRadius: '0'
    },
    secondaryButton: {
      padding: '.6rem .8rem',
      color: '#181818',
      background: '#b0a89b',
      borderColor: '#b0a89b',
      borderRadius: '0'
    },
  }
};

export const gsTablesStyles: GTableStyles = {
  color: '#fcf9f8',
  primaryColor: '#faba53',
  secondaryColor: 'transparent',
  neutralColor: '#757574',
  whiteColor: null,
  fontSize: '1rem',
  padding: '.6rem',
  buttom: {
    color: '#181818',
    background: '#faba53'
  }
};
