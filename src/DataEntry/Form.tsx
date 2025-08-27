import React, { useState, useRef, createContext, useContext } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme, useColors } from '../themes';

export interface FormFieldRule {
  required?: boolean;
  pattern?: RegExp;
  min?: number;
  max?: number;
  validator?: (value: any) => string | null;
  message?: string;
}

export interface FormField {
  name: string;
  value: any;
  rules?: FormFieldRule[];
  error?: string;
}

interface FormContextType {
  fields: { [key: string]: FormField };
  setField: (name: string, value: any) => void;
  getField: (name: string) => FormField | undefined;
  validateField: (name: string) => boolean;
  validateAll: () => boolean;
  resetFields: () => void;
  setFieldError: (name: string, error: string) => void;
  clearFieldError: (name: string) => void;
}

const FormContext = createContext<FormContextType | null>(null);

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a Form component');
  }
  return context;
};

interface FormProps {
  initialValues?: { [key: string]: any };
  onSubmit?: (values: { [key: string]: any }) => void;
  onValuesChange?: (changedValues: { [key: string]: any }, allValues: { [key: string]: any }) => void;
  style?: ViewStyle;
  scrollable?: boolean;
  children: React.ReactNode;
}

const Form: React.FC<FormProps> = ({
  initialValues = {},
  onSubmit,
  onValuesChange,
  style,
  scrollable = true,
  children,
}) => {
  const theme = useTheme();
  const colors = useColors();
  
  const [fields, setFields] = useState<{ [key: string]: FormField }>(() => {
    const initialFields: { [key: string]: FormField } = {};
    Object.keys(initialValues).forEach(key => {
      initialFields[key] = {
        name: key,
        value: initialValues[key],
        rules: [],
      };
    });
    return initialFields;
  });

  const validateField = (name: string): boolean => {
    const field = fields[name];
    if (!field || !field.rules) return true;

    for (const rule of field.rules) {
      let isValid = true;
      let errorMessage = rule.message || 'Validation failed';

      if (rule.required && (!field.value || field.value === '')) {
        isValid = false;
        errorMessage = rule.message || 'This field is required';
      } else if (rule.pattern && !rule.pattern.test(field.value)) {
        isValid = false;
        errorMessage = rule.message || 'Invalid format';
      } else if (rule.min !== undefined && field.value && field.value.length < rule.min) {
        isValid = false;
        errorMessage = rule.message || `Minimum ${rule.min} characters required`;
      } else if (rule.max !== undefined && field.value && field.value.length > rule.max) {
        isValid = false;
        errorMessage = rule.message || `Maximum ${rule.max} characters allowed`;
      } else if (rule.validator) {
        const validationResult = rule.validator(field.value);
        if (validationResult) {
          isValid = false;
          errorMessage = validationResult;
        }
      }

      if (!isValid) {
        setFieldError(name, errorMessage);
        return false;
      }
    }

    clearFieldError(name);
    return true;
  };

  const validateAll = (): boolean => {
    let isAllValid = true;
    Object.keys(fields).forEach(name => {
      if (!validateField(name)) {
        isAllValid = false;
      }
    });
    return isAllValid;
  };

  const setField = (name: string, value: any) => {
    const prevValue = fields[name]?.value;
    
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        name,
        value,
        error: undefined,
      },
    }));

    if (onValuesChange && prevValue !== value) {
      const allValues = { ...Object.keys(fields).reduce((acc, key) => {
        acc[key] = key === name ? value : fields[key].value;
        return acc;
      }, {} as { [key: string]: any }) };
      
      onValuesChange({ [name]: value }, allValues);
    }
  };

  const getField = (name: string): FormField | undefined => {
    return fields[name];
  };

  const setFieldError = (name: string, error: string) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        name,
        error,
      },
    }));
  };

  const clearFieldError = (name: string) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        error: undefined,
      },
    }));
  };

  const resetFields = () => {
    setFields(() => {
      const resetFields: { [key: string]: FormField } = {};
      Object.keys(initialValues).forEach(key => {
        resetFields[key] = {
          name: key,
          value: initialValues[key],
          rules: fields[key]?.rules || [],
        };
      });
      return resetFields;
    });
  };

  const handleSubmit = () => {
    if (validateAll() && onSubmit) {
      const values = Object.keys(fields).reduce((acc, key) => {
        acc[key] = fields[key].value;
        return acc;
      }, {} as { [key: string]: any });
      onSubmit(values);
    }
  };

  const contextValue: FormContextType = {
    fields,
    setField,
    getField,
    validateField,
    validateAll,
    resetFields,
    setFieldError,
    clearFieldError,
  };

  const Container = scrollable ? ScrollView : View;

  // Theme-aware styles
  const containerStyle: ViewStyle = {
    padding: theme.spacing.md,
    backgroundColor: colors.background,
    ...style,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <Container style={containerStyle}>
        {children}
      </Container>
    </FormContext.Provider>
  );
};

export default Form;
