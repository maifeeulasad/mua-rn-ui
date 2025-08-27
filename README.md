# mua-rn-ui

A simple React Native UI library with a customizable Button component, written in TypeScript.

## Installation

```bash
npm install mua-rn-ui
```

## Usage

```typescript
import React from 'react';
import { View } from 'react-native';
import { Button } from 'mua-rn-ui';

const App = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Press me"
        onPress={() => console.log('Button pressed!')}
        backgroundColor="#007AFF"
        textColor="#FFFFFF"
      />
    </View>
  );
};

export default App;
```

## Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | 'Button' | Button text |
| `onPress` | function | () => {} | Function called when button is pressed |
| `backgroundColor` | string | '#007AFF' | Button background color |
| `textColor` | string | '#FFFFFF' | Button text color |
| `disabled` | boolean | false | Disable button interaction |
| `style` | ViewStyle | {} | Custom button styles |
| `textStyle` | TextStyle | {} | Custom text styles |

All TouchableOpacity props are also supported through prop spreading.

## TypeScript Support

This library is written in TypeScript and includes type definitions out of the box.

## License

MIT