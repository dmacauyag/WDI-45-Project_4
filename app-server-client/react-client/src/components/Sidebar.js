import React, { Component } from 'react'

class Sidebar extends Component {

  render() {
    return (
      <div className="nav-container nav-container--sidebar">
			<div className="nav-sidebar-column bg--dark">
	            <div className="text-center text-block">
	                <a href="/">
	                    <h2><strong>Let's Move</strong></h2>
	                </a>
	                <p>Find your next activity.</p>
	            </div>
	            <hr />
	            <div className="text-block">
	                <ul className="menu-vertical">
	                    <li><h4>Bookmarked Segments</h4></li>

	                </ul>
	            </div>
	            <hr />
	            <div>

	            </div>
	        </div>

            <div className="nav-sidebar-column-toggle visible-xs visible-sm" data-toggle-className=".nav-sidebar-column;active">
                <i className="stack-menu"></i>
            </div>
        </div>
    )
  }
}

export default Sidebar
