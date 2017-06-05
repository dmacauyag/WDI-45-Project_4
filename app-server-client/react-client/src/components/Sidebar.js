import React, { Component } from 'react'

class Sidebar extends Component {
  render() {
    return (
      <div id="sidebar-wrapper toggled">
        <ul className="sidebar-nav">
            <li className="sidebar-brand">
              Start Bootstrap
            </li>
            <li>
              Dashboard
            </li>
            <li>
              Shortcuts
            </li>
            <li>
              Overview
            </li>
        </ul>
      </div>
    )
  }
}

export default Sidebar
