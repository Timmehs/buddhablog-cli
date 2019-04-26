import React from 'react'
import { render, hydrate } from 'react-dom'
import path from 'path'
import HotWrapper from './HotWrapper'

const rootElement = document.getElementById('buddhablog') // TODO: Make this configurable?

if (rootElement.hasChildNodes()) {
  hydrate(<HotWrapper />, rootElement)
} else {
  render(<HotWrapper />, rootElement)
}
