import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { useTheme, useColors } from '../themes';

export interface ImagePickerOptions {
  mediaType?: 'photo' | 'video' | 'mixed';
  quality?: number;
  allowsEditing?: boolean;
  aspect?: [number, number];
  allowsMultipleSelection?: boolean;
  selectionLimit?: number;
}

export interface ImagePickerResult {
  cancelled: boolean;
  uri?: string;
  width?: number;
  height?: number;
  type?: string;
  fileSize?: number;
  fileName?: string;
}

interface ImagePickerProps {
  onImageSelected: (result: ImagePickerResult | ImagePickerResult[]) => void;
  options?: ImagePickerOptions;
  placeholder?: string;
  showPreview?: boolean;
  previewStyle?: ImageStyle;
  containerStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  multiple?: boolean;
  children?: React.ReactNode;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  onImageSelected,
  options = {},
  placeholder = 'Select Image',
  showPreview = true,
  previewStyle,
  containerStyle,
  buttonStyle,
  textStyle,
  disabled = false,
  multiple = false,
  children,
}) => {
  const theme = useTheme();
  const colors = useColors();
  
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const showImagePicker = () => {
    if (disabled) return;

    Alert.alert(
      'Select Image',
      'Choose from where you want to select an image',
      [
        {
          text: 'Camera',
          onPress: () => openCamera(),
        },
        {
          text: 'Gallery',
          onPress: () => openGallery(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const openCamera = async () => {
    try {
      setIsLoading(true);
      // Note: In a real implementation, you would use react-native-image-picker
      // or expo-image-picker here. This is a mock implementation.
      
      // Mock result for demonstration
      const mockResult: ImagePickerResult = {
        cancelled: false,
        uri: 'https://picsum.photos/300/300',
        width: 300,
        height: 300,
        type: 'image/jpeg',
        fileSize: 50000,
        fileName: 'camera_image.jpg',
      };

      setTimeout(() => {
        handleImageResult(mockResult);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const openGallery = async () => {
    try {
      setIsLoading(true);
      // Note: In a real implementation, you would use react-native-image-picker
      // or expo-image-picker here. This is a mock implementation.
      
      // Mock result for demonstration
      const mockResult: ImagePickerResult = {
        cancelled: false,
        uri: 'https://picsum.photos/400/300',
        width: 400,
        height: 300,
        type: 'image/jpeg',
        fileSize: 75000,
        fileName: 'gallery_image.jpg',
      };

      setTimeout(() => {
        handleImageResult(mockResult);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  const handleImageResult = (result: ImagePickerResult) => {
    if (!result.cancelled && result.uri) {
      if (multiple) {
        const newImages = [...selectedImages, result.uri];
        setSelectedImages(newImages);
        onImageSelected(newImages.map(uri => ({ ...result, uri })));
      } else {
        setSelectedImages([result.uri]);
        onImageSelected(result);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    if (multiple) {
      onImageSelected(newImages.map(uri => ({ cancelled: false, uri })));
    } else if (newImages.length === 0) {
      onImageSelected({ cancelled: true });
    }
  };

  const renderPreview = () => {
    if (!showPreview || selectedImages.length === 0) return null;

    return (
      <View style={previewContainerStyle}>
        {selectedImages.map((uri, index) => (
          <View key={index} style={imageContainerStyle}>
            <Image
              source={{ uri }}
              style={[previewImageStyle, previewStyle]}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={removeButtonStyle}
              onPress={() => removeImage(index)}
            >
              <Text style={removeButtonTextStyle}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  // Theme-aware styles
  const containerStyleThemed: ViewStyle = {
    marginBottom: theme.spacing.md,
    ...containerStyle,
  };

  const buttonStyleThemed: ViewStyle = {
    backgroundColor: colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    opacity: disabled ? 0.6 : 1,
    ...buttonStyle,
  };

  const buttonTextStyle: TextStyle = {
    color: colors.buttonText,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    ...textStyle,
  };

  const previewContainerStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
  };

  const imageContainerStyle: ViewStyle = {
    position: 'relative',
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  };

  const previewImageStyle: ImageStyle = {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
  };

  const removeButtonStyle: ViewStyle = {
    position: 'absolute',
    top: -theme.spacing.xs,
    right: -theme.spacing.xs,
    backgroundColor: colors.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const removeButtonTextStyle: TextStyle = {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  };

  if (children) {
    return (
      <View style={containerStyleThemed}>
        <TouchableOpacity onPress={showImagePicker} disabled={disabled}>
          {children}
        </TouchableOpacity>
        {renderPreview()}
      </View>
    );
  }

  return (
    <View style={containerStyleThemed}>
      <TouchableOpacity
        style={buttonStyleThemed}
        onPress={showImagePicker}
        disabled={disabled || isLoading}
      >
        <Text style={buttonTextStyle}>
          {isLoading ? 'Loading...' : placeholder}
        </Text>
      </TouchableOpacity>
      {renderPreview()}
    </View>
  );
};

export default ImagePicker;
