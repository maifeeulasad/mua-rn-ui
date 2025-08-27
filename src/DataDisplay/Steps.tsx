import React from 'react';
import { 
  View, 
  Text, 
  ViewStyle, 
  TextStyle,
  StyleSheet 
} from 'react-native';

export interface StepItem {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'wait' | 'process' | 'finish' | 'error';
}

export interface StepsProps {
  steps: StepItem[];
  current?: number;
  direction?: 'horizontal' | 'vertical';
  size?: 'default' | 'small';
  status?: 'wait' | 'process' | 'finish' | 'error';
  labelPlacement?: 'horizontal' | 'vertical';
  style?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  testID?: string;
}

const Steps: React.FC<StepsProps> = ({
  steps,
  current = 0,
  direction = 'horizontal',
  size = 'default',
  status = 'process',
  labelPlacement = 'horizontal',
  style,
  titleStyle,
  descriptionStyle,
  testID,
}) => {
  const getStepStatus = (index: number): 'wait' | 'process' | 'finish' | 'error' => {
    if (steps[index]?.status) {
      return steps[index].status!;
    }
    
    if (index < current) {
      return 'finish';
    } else if (index === current) {
      return status;
    } else {
      return 'wait';
    }
  };

  const getStepColors = (stepStatus: string) => {
    switch (stepStatus) {
      case 'finish':
        return {
          iconBg: '#52c41a',
          iconColor: '#ffffff',
          titleColor: '#333333',
          descriptionColor: '#666666',
          lineColor: '#52c41a',
        };
      case 'process':
        return {
          iconBg: '#1890ff',
          iconColor: '#ffffff',
          titleColor: '#1890ff',
          descriptionColor: '#666666',
          lineColor: '#d9d9d9',
        };
      case 'error':
        return {
          iconBg: '#ff4d4f',
          iconColor: '#ffffff',
          titleColor: '#ff4d4f',
          descriptionColor: '#ff4d4f',
          lineColor: '#d9d9d9',
        };
      default: // wait
        return {
          iconBg: '#f5f5f5',
          iconColor: '#999999',
          titleColor: '#999999',
          descriptionColor: '#999999',
          lineColor: '#d9d9d9',
        };
    }
  };

  const renderStepIcon = (step: StepItem, index: number, stepStatus: string) => {
    const colors = getStepColors(stepStatus);
    const iconSize = size === 'small' ? 24 : 32;
    
    const iconContainerStyle = [
      styles.iconContainer,
      {
        width: iconSize,
        height: iconSize,
        backgroundColor: colors.iconBg,
        borderRadius: iconSize / 2,
      },
    ];

    if (step.icon) {
      return (
        <View style={iconContainerStyle}>
          {step.icon}
        </View>
      );
    }

    const iconText = stepStatus === 'finish' ? '✓' : (index + 1).toString();
    
    return (
      <View style={iconContainerStyle}>
        <Text
          style={[
            styles.iconText,
            {
              color: colors.iconColor,
              fontSize: size === 'small' ? 12 : 14,
            },
          ]}
        >
          {iconText}
        </Text>
      </View>
    );
  };

  const renderStepContent = (step: StepItem, index: number, stepStatus: string) => {
    const colors = getStepColors(stepStatus);
    const isVertical = direction === 'vertical';
    const isLabelVertical = labelPlacement === 'vertical';
    
    const contentStyle = [
      styles.content,
      isVertical && styles.verticalContent,
      isLabelVertical && !isVertical && styles.verticalLabelContent,
    ];

    const stepTitleStyle = [
      styles.title,
      size === 'small' && styles.smallTitle,
      { color: colors.titleColor },
      titleStyle,
    ];

    const stepDescriptionStyle = [
      styles.description,
      size === 'small' && styles.smallDescription,
      { color: colors.descriptionColor },
      descriptionStyle,
    ];

    return (
      <View style={contentStyle}>
        <Text style={stepTitleStyle}>{step.title}</Text>
        {step.description && (
          <Text style={stepDescriptionStyle}>{step.description}</Text>
        )}
      </View>
    );
  };

  const renderConnector = (index: number, stepStatus: string) => {
    if (index === steps.length - 1) return null;
    
    const colors = getStepColors(stepStatus);
    const nextStepStatus = getStepStatus(index + 1);
    const nextColors = getStepColors(nextStepStatus);
    
    const connectorColor = stepStatus === 'finish' ? colors.lineColor : nextColors.lineColor;
    
    if (direction === 'vertical') {
      return (
        <View
          style={[
            styles.verticalConnector,
            { backgroundColor: connectorColor },
          ]}
        />
      );
    }
    
    return (
      <View
        style={[
          styles.horizontalConnector,
          { backgroundColor: connectorColor },
        ]}
      />
    );
  };

  const renderStep = (step: StepItem, index: number) => {
    const stepStatus = getStepStatus(index);
    const isVertical = direction === 'vertical';
    
    const stepContainerStyle = [
      styles.step,
      isVertical && styles.verticalStep,
      !isVertical && styles.horizontalStep,
    ];

    return (
      <View key={index} style={stepContainerStyle}>
        <View style={styles.stepHeader}>
          {renderStepIcon(step, index, stepStatus)}
          {renderConnector(index, stepStatus)}
        </View>
        {renderStepContent(step, index, stepStatus)}
      </View>
    );
  };

  const containerStyle = [
    styles.container,
    direction === 'vertical' && styles.verticalContainer,
    style,
  ];

  return (
    <View style={containerStyle} testID={testID}>
      {steps.map((step, index) => renderStep(step, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  verticalContainer: {
    flexDirection: 'column',
  },
  step: {
    flex: 1,
  },
  horizontalStep: {
    alignItems: 'center',
  },
  verticalStep: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepHeader: {
    position: 'relative',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    marginTop: 8,
    alignItems: 'center',
  },
  verticalContent: {
    marginTop: 0,
    marginLeft: 12,
    alignItems: 'flex-start',
    flex: 1,
  },
  verticalLabelContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  smallTitle: {
    fontSize: 12,
  },
  description: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  smallDescription: {
    fontSize: 11,
  },
  horizontalConnector: {
    position: 'absolute',
    top: '50%',
    left: '100%',
    right: '-100%',
    height: 1,
    zIndex: -1,
  },
  verticalConnector: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    width: 1,
    height: 16,
    zIndex: -1,
    marginLeft: -0.5,
  },
});

export default Steps;
