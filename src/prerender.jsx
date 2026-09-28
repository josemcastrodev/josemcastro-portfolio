import React from 'react';
import { renderToString } from 'react-dom/server';
import Portfolio from './Portfolio.jsx';

export function render() {
  return renderToString(<Portfolio />);
}
