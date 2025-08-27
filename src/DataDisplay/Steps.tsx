import React from 'react';
import { 
  View, 
  Text, 
  ViewStyle, 
  TextStyle
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

  const getContainerStyle = (direction: string, customStyle?: ViewStyle): ViewStyle[] => {
    const baseStyle: ViewStyle = {
      flexDirection: direction === 'vertical' ? 'column' : 'row',
      alignItems: direction === 'vertical' ? 'stretch' : 'flex-start',
    };
    return customStyle ? [baseStyle, customStyle] : [baseStyle];
  };

  const getStepStyle = (isVertical: boolean): ViewStyle => ({
    flex: isVertical ? 0 : 1,
    flexDirection: isVertical ? 'row' : 'column',
    alignItems: isVertical ? 'flex-start' : 'center',
    marginBottom: isVertical ? theme.spacing.md : 0,
  });

  const getStepHeaderStyle = (isVertical: boolean): ViewStyle => ({
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: 'center',
    marginBottom: isVertical ? 0 : theme.spacing.xs,
  });

  const renderStepIcon = (step: StepItem, index: number, stepStatus: string) => {
    const iconContainerStyle = getIconContainerStyle(stepStatus);

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
        <Text style={getIconTextStyle(stepStatus)}>
          {iconText}
        </Text>
      </View>
    );
  };

  const renderStepContent = (step: StepItem, stepStatus: string) => {
    const isVertical = direction === 'vertical';
    const isLabelVertical = labelPlacement === 'vertical';

    const contentStyle = [
      contentStyleThemed,
      isVertical && verticalContentStyleThemed,
      isLabelVertical && !isVertical && verticalLabelContentStyleThemed,
    ];

    return (
      <View style={contentStyle}>
        <Text style={[getTitleStyle(stepStatus), titleStyle]}>{step.title}</Text>
        {step.description && (
          <Text style={[getDescriptionStyle(stepStatus), descriptionStyle]}>{step.description}</Text>
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
            getVerticalConnectorStyle(stepStatus),
            { backgroundColor: connectorColor },
          ]}
        />
      );
    }
    
    return (
      <View
        style={[
          getHorizontalConnectorStyle(stepStatus),
          { backgroundColor: connectorColor },
        ]}
      />
    );
  };

  const renderStep = (step: StepItem, index: number) => {
    const stepStatus = getStepStatus(index);
    const isVertical = direction === 'vertical';
    
    return (
      <View key={index} style={getStepStyle(isVertical)}>
        <View style={getStepHeaderStyle(isVertical)}>
          {renderStepIcon(step, index, stepStatus)}
          {renderConnector(index, stepStatus)}
        </View>
        {renderStepContent(step, stepStatus)}
      </View>
    );
  };

  return (
    <View style={getContainerStyle(direction, style)} testID={testID}>
      {steps.map((step, index) => renderStep(step, index))}
    </View>
  );
};

export default Steps;
