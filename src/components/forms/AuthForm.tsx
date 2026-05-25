import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Input } from '../ui/Input';
import useForm from '../../hooks/useForm';
import { validateLogin, validateRegistration } from '../../utils/validation';

type AuthFormType = 'login' | 'register';

interface AuthFormValues {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
}

interface AuthFormProps {
  type?: AuthFormType;
  onSubmit: (values: AuthFormValues) => void;
  loading?: boolean;
  initialValues?: Partial<AuthFormValues>;
  showForgotPassword?: boolean;
  onForgotPassword?: (email: string) => void;
}

const AuthForm = ({
  type = 'login',
  onSubmit,
  loading = false,
  initialValues = {},
  showForgotPassword = true,
  onForgotPassword,
}: AuthFormProps) => {
  const validator = type === 'login' ? validateLogin : validateRegistration;

  const defaultValues: AuthFormValues =
    type === 'login'
      ? { email: '', password: '', ...initialValues }
      : { email: '', password: '', firstName: '', lastName: '', confirmPassword: '', ...initialValues };

  const { values, errors, handleChange, validateForm, isValid } = useForm(
    defaultValues,
    validator as (values: AuthFormValues) => Partial<Record<keyof AuthFormValues, string>>
  );

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(values);
    }
  };

  return (
    <View className="w-full">
      {type === 'register' && (
        <View className="flex-row justify-between">
          <View className="w-[48%]">
            <Input
              label="First Name"
              value={values.firstName ?? ''}
              onChangeText={(text) => handleChange('firstName', text)}
              error={errors.firstName}
              autoCapitalize="words"
              testID="first-name-input"
            />
          </View>
          <View className="w-[48%]">
            <Input
              label="Last Name"
              value={values.lastName ?? ''}
              onChangeText={(text) => handleChange('lastName', text)}
              error={errors.lastName}
              autoCapitalize="words"
              testID="last-name-input"
            />
          </View>
        </View>
      )}

      <Input
        label="Email"
        value={values.email}
        onChangeText={(text) => handleChange('email', text)}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        className={type === 'register' ? 'mt-4' : ''}
        testID="email-input"
      />

      <Input
        label="Password"
        value={values.password}
        onChangeText={(text) => handleChange('password', text)}
        error={errors.password}
        secureTextEntry
        autoCapitalize="none"
        className="mt-3"
        testID="password-input"
      />

      {type === 'register' && (
        <Input
          label="Confirm Password"
          value={values.confirmPassword ?? ''}
          onChangeText={(text) => handleChange('confirmPassword', text)}
          error={errors.confirmPassword}
          secureTextEntry
          autoCapitalize="none"
          className="mt-3"
          testID="confirm-password-input"
        />
      )}

      {type === 'login' && showForgotPassword && onForgotPassword && (
        <TouchableOpacity
          className="self-end mt-2 mb-5"
          onPress={() => onForgotPassword(values.email)}
          testID="forgot-password-button"
        >
          <Text className="text-sm text-primary font-medium">Forgot password?</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        className={`bg-primary h-12 rounded-lg justify-center items-center ${type === 'login' ? 'mb-5' : 'mb-5 mt-5'}`}
        onPress={handleSubmit}
        disabled={loading || !isValid}
        style={{ opacity: loading || !isValid ? 0.7 : 1 }}
        testID={`${type}-button`}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text className="text-white text-base font-medium">
            {type === 'login' ? 'Login' : 'Register'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AuthForm;
