/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import { SpaceXProvider } from './src/contexts/SpaceX';
import Navigation from './src/navigation';

function App() {

	return (
		<AuthProvider>
			<SpaceXProvider>
				<Navigation />
			</SpaceXProvider>
		</AuthProvider>
	)
}

export default App;
