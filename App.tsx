/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { SpaceXProvider } from './src/contexts/SpaceX';
import Navigation from './src/navigation';

if (Platform.OS === 'android') {
	if (UIManager.setLayoutAnimationEnabledExperimental) {
		UIManager.setLayoutAnimationEnabledExperimental(true);
	}
}

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
