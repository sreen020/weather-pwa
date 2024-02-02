import React from 'react';
import { Outlet } from 'react-router-dom';

export default function Root() {
	return (
		<main id="root">
			<div id="sidebar">
				<h1>React Router Contacts</h1>

				<nav>
					<ul>
						<li>
							<a href={`/`}>HOME</a>
						</li>
						<li>
							<a href={`/detail`}>DETAIL</a>
						</li>
					</ul>
				</nav>
			</div>

			<Outlet />
		</main>
	);
}
