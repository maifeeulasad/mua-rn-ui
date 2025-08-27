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
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [isScrolling, setIsScrolling] = useState(false);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        styles.dotsContainer,
        dotPosition === 'top' ? styles.dotsTop : styles.dotsBottom,
        vertical && styles.dotsVertical
      ]}>
        {children.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              dotStyle,
              index === currentIndex && [styles.activeDot, activeDotStyle]
            ]}
          />
        ))}
      </View>
    );
  };

  const containerStyle = [
    styles.container,
    vertical && styles.verticalContainer,
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
        style={styles.scrollView}
        contentContainerStyle={vertical ? styles.verticalContent : styles.horizontalContent}
      >
        {children.map((child, index) => (
          <View
            key={index}
            style={[
              styles.item,
              vertical ? styles.verticalItem : styles.horizontalItem
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  verticalContainer: {
    height: screenHeight,
  },
  scrollView: {
    flex: 1,
  },
  horizontalContent: {
    flexDirection: 'row',
  },
  verticalContent: {
    flexDirection: 'column',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalItem: {
    width: screenWidth,
  },
  verticalItem: {
    height: screenHeight,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dotsTop: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  dotsBottom: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  dotsVertical: {
    flexDirection: 'column',
    left: 20,
    right: 'auto',
    top: '50%',
    transform: [{ translateY: -50 }],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#ffffff',
    transform: [{ scale: 1.2 }],
  },
});

export default Carousel;
