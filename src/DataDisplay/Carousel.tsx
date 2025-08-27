import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Dimensions, 
  ViewStyle, 
  NativeSyntheticEvent, 
  NativeScrollEvent,
  StyleSheet 
} from 'react-native';
import { useTheme, useColors } from '../themes';

export interface CarouselProps {
  children: React.ReactNode[];
  autoplay?: boolean;
  autoplayInterval?: number;
  infinite?: boolean;
  dots?: boolean;
  dotStyle?: ViewStyle;
  activeDotStyle?: ViewStyle;
  dotPosition?: 'bottom' | 'top';
  selectedIndex?: number;
  onIndexChange?: (index: number) => void;
  style?: ViewStyle;
  vertical?: boolean;
  showsIndicators?: boolean;
  testID?: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Carousel: React.FC<CarouselProps> = ({
  children,
  autoplay = false,
  autoplayInterval = 3000,
  infinite = true,
  dots = true,
  dotStyle,
  activeDotStyle,
  dotPosition = 'bottom',
  selectedIndex = 0,
  onIndexChange,
  style,
  vertical = false,
  showsIndicators = false,
  testID,
}) => {
  const theme = useTheme();
  const colors = useColors();
  
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [isScrolling, setIsScrolling] = useState(false);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Theme-aware styles
  const containerStyleThemed: ViewStyle = {
    flex: 1,
  };

  const verticalContainerStyleThemed: ViewStyle = {
    height: screenHeight,
  };

  const scrollViewStyleThemed: ViewStyle = {
    flex: 1,
  };

  const horizontalContentStyleThemed: ViewStyle = {
    flexDirection: 'row',
  };

  const verticalContentStyleThemed: ViewStyle = {
    flexDirection: 'column',
  };

  const itemStyleThemed: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
  };

  const horizontalItemStyleThemed: ViewStyle = {
    width: screenWidth,
  };

  const verticalItemStyleThemed: ViewStyle = {
    height: screenHeight,
  };

  const dotsContainerStyleThemed: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  };

  const dotsTopStyleThemed: ViewStyle = {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 1,
  };

  const dotsBottomStyleThemed: ViewStyle = {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    zIndex: 1,
  };

  const dotsVerticalStyleThemed: ViewStyle = {
    flexDirection: 'column',
    left: 20,
    right: 'auto',
    top: '50%',
    transform: [{ translateY: -50 }],
  };

  const dotStyleThemed: ViewStyle = {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.overlay || 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: theme.spacing.xs / 2,
  };

  const activeDotStyleThemed: ViewStyle = {
    backgroundColor: colors.primary || '#ffffff',
    transform: [{ scale: 1.2 }],
  };

  const itemCount = children.length;
  const screenSize = vertical ? screenHeight : screenWidth;

  useEffect(() => {
    if (autoplay && !isScrolling) {
      startAutoplay();
    } else {
      stopAutoplay();
    }

    return () => stopAutoplay();
  }, [autoplay, isScrolling, currentIndex]);

  useEffect(() => {
    if (selectedIndex !== currentIndex) {
      scrollToIndex(selectedIndex);
    }
  }, [selectedIndex]);

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimerRef.current = setTimeout(() => {
      const nextIndex = infinite 
        ? (currentIndex + 1) % itemCount 
        : Math.min(currentIndex + 1, itemCount - 1);
      
      if (nextIndex !== currentIndex || infinite) {
        scrollToIndex(nextIndex);
      }
    }, autoplayInterval);
  };

  const stopAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current && index >= 0 && index < itemCount) {
      const offset = vertical 
        ? { x: 0, y: index * screenSize }
        : { x: index * screenSize, y: 0 };
      
      scrollViewRef.current.scrollTo({ ...offset, animated: true });
      setCurrentIndex(index);
      onIndexChange?.(index);
    }
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = vertical 
      ? event.nativeEvent.contentOffset.y 
      : event.nativeEvent.contentOffset.x;
    
    const index = Math.round(contentOffset / screenSize);
    
    if (index !== currentIndex && index >= 0 && index < itemCount) {
      setCurrentIndex(index);
      onIndexChange?.(index);
    }
    
    setIsScrolling(false);
  };

  const handleScrollBegin = () => {
    setIsScrolling(true);
    stopAutoplay();
  };

  const renderDots = () => {
    if (!dots || itemCount <= 1) return null;

    return (
      <View style={[
        dotsContainerStyleThemed,
        dotPosition === 'top' ? dotsTopStyleThemed : dotsBottomStyleThemed,
        vertical && dotsVerticalStyleThemed
      ]}>
        {children.map((_, index) => (
          <View
            key={index}
            style={[
              dotStyleThemed,
              dotStyle,
              index === currentIndex && [activeDotStyleThemed, activeDotStyle]
            ]}
          />
        ))}
      </View>
    );
  };

  const containerStyle = [
    containerStyleThemed,
    vertical && verticalContainerStyleThemed,
    style,
  ];

  return (
    <View style={containerStyle} testID={testID}>
      {dotPosition === 'top' && renderDots()}
      
      <ScrollView
        ref={scrollViewRef}
        horizontal={!vertical}
        pagingEnabled
        showsHorizontalScrollIndicator={showsIndicators && !vertical}
        showsVerticalScrollIndicator={showsIndicators && vertical}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollBeginDrag={handleScrollBegin}
        style={scrollViewStyleThemed}
        contentContainerStyle={vertical ? verticalContentStyleThemed : horizontalContentStyleThemed}
      >
        {children.map((child, index) => (
          <View
            key={index}
            style={[
              itemStyleThemed,
              vertical ? verticalItemStyleThemed : horizontalItemStyleThemed
            ]}
          >
            {child}
          </View>
        ))}
      </ScrollView>
      
      {dotPosition === 'bottom' && renderDots()}
    </View>
  );
};

export default Carousel;
