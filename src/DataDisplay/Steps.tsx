import React from 'react';
import { 
  View, 
  Text, 
  ViewStyle, 
  TextStyle,
  StyleSheet 
} from 'react-native';
import { useTheme, useColors } from '../themes';

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
  const theme = useTheme();
  const colors = useColors();
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
          iconBg: colors.success,
          iconColor: '#ffffff',
          titleColor: colors.text,
          descriptionColor: colors.textSecondary,
          lineColor: colors.success,
        };
      case 'process':
        return {
          iconBg: colors.primary,
          iconColor: '#ffffff',
          titleColor: colors.primary,
          descriptionColor: colors.textSecondary,
          lineColor: colors.divider,
        };
      case 'error':
        return {
          iconBg: colors.error,
          iconColor: '#ffffff',
          titleColor: colors.error,
          descriptionColor: colors.error,
          lineColor: colors.divider,
        };
      default: // wait
        return {
          iconBg: colors.surface,
          iconColor: colors.textDisabled,
          titleColor: colors.textDisabled,
          descriptionColor: colors.textDisabled,
          lineColor: colors.divider,
        };
    }
  };

  // Theme-aware styles
  const containerStyleThemed: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'flex-start',
  };

  const verticalContainerStyleThemed: ViewStyle = {
    flexDirection: 'column',
  };

  const stepStyleThemed: ViewStyle = {
    flex: 1,
  };

  const horizontalStepStyleThemed: ViewStyle = {
    alignItems: 'center',
  };

  const verticalStepStyleThemed: ViewStyle = {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  };

  const stepHeaderStyleThemed: ViewStyle = {
    position: 'relative',
    alignItems: 'center',
  };

  const getIconContainerStyle = (stepStatus: string): ViewStyle => {
    const stepColors = getStepColors(stepStatus);
    const iconSize = size === 'small' ? 24 : 32;
    
    return {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'transparent',
      backgroundColor: stepColors.iconBg,
      width: iconSize,
      height: iconSize,
      borderRadius: iconSize / 2,
    };
  };

  const getIconTextStyle = (stepStatus: string): TextStyle => {
    const stepColors = getStepColors(stepStatus);
    return {
      fontWeight: theme.typography.fontWeight.bold,
      textAlign: 'center',
      color: stepColors.iconColor,
      fontSize: size === 'small' ? theme.typography.fontSize.xs : theme.typography.fontSize.sm,
    };
  };

  const contentStyleThemed: ViewStyle = {
    marginTop: theme.spacing.xs,
    alignItems: 'center',
  };

  const verticalContentStyleThemed: ViewStyle = {
    marginTop: 0,
    marginLeft: theme.spacing.sm,
    alignItems: 'flex-start',
    flex: 1,
  };

  const verticalLabelContentStyleThemed: ViewStyle = {
    alignItems: 'center',
  };

  const getTitleStyle = (stepStatus: string): TextStyle => {
    const stepColors = getStepColors(stepStatus);
    return {
      fontSize: size === 'small' ? theme.typography.fontSize.xs : theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      textAlign: 'center',
      color: stepColors.titleColor,
    };
  };

  const getDescriptionStyle = (stepStatus: string): TextStyle => {
    const stepColors = getStepColors(stepStatus);
    return {
      fontSize: size === 'small' ? 11 : theme.typography.fontSize.xs,
      marginTop: 4,
      textAlign: 'center',
      color: stepColors.descriptionColor,
    };
  };

  const getHorizontalConnectorStyle = (stepStatus: string): ViewStyle => {
    const stepColors = getStepColors(stepStatus);
    return {
      position: 'absolute',
      top: '50%',
      left: '100%',
      right: '-100%',
      height: 1,
      zIndex: -1,
      backgroundColor: stepColors.lineColor,
    };
  };

  const getVerticalConnectorStyle = (stepStatus: string): ViewStyle => {
    const stepColors = getStepColors(stepStatus);
    return {
      position: 'absolute',
      top: '100%',
      left: '50%',
      width: 1,
      height: theme.spacing.md,
      zIndex: -1,
      marginLeft: -0.5,
      backgroundColor: stepColors.lineColor,
    };
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
