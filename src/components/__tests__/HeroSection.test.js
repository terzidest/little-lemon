import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text, TextInput } from 'react-native';

// Create a simple test component to verify our testing setup works
const SimpleTestComponent = ({ title, onPress }) => (
  <View>
    <Text testID="title">{title}</Text>
    <TextInput 
      testID="input"
      placeholder="Test input"
      onChangeText={onPress}
    />
  </View>
);

describe('Component Testing Setup', () => {
  it('should render a simple component', () => {
    const { getByTestId, getByText } = render(
      <SimpleTestComponent title="Test Title" onPress={jest.fn()} />
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByTestId('title')).toBeTruthy();
    expect(getByTestId('input')).toBeTruthy();
  });

  it('should handle text input changes', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <SimpleTestComponent title="Test" onPress={mockOnPress} />
    );

    const input = getByTestId('input');
    input.props.onChangeText('test text');

    expect(mockOnPress).toHaveBeenCalledWith('test text');
  });

  it('should render with proper test attributes', () => {
    const { getByTestId } = render(
      <SimpleTestComponent title="Test" onPress={jest.fn()} />
    );

    const input = getByTestId('input');
    expect(input.props.placeholder).toBe('Test input');
  });
});
