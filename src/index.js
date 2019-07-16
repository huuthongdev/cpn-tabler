import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default function ExampleComponent(props) {
  console.log(props);
  return <div>

  </div>
}

ExampleComponent.propTypes = {
  text: PropTypes.string
}