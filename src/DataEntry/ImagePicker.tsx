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
      <View style={styles.previewContainer}>
        {selectedImages.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri }}
              style={[styles.previewImage, previewStyle]}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  if (children) {
    return (
      <View style={[containerStyle]}>
        <TouchableOpacity onPress={showImagePicker} disabled={disabled}>
          {children}
        </TouchableOpacity>
        {renderPreview()}
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[
          styles.button,
          { opacity: disabled ? 0.6 : 1 },
          buttonStyle,
        ]}
        onPress={showImagePicker}
        disabled={disabled || isLoading}
      >
        <Text style={[styles.buttonText, textStyle]}>
          {isLoading ? 'Loading...' : placeholder}
        </Text>
      </TouchableOpacity>
      {renderPreview()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ImagePicker;
