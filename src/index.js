import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './Home';
import Detail from './Detail';
import Root from './routes/root';
import ErrorPage from './error-page';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '/',
				element: <Home />,
			},
			{
				path: '/detail',
				element: <Detail />,
			},
		],
	},
]);

ReactDOM.render(
	<React.StrictMode>
		<RouterProvider router={router}>
			<Home />
		</RouterProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
