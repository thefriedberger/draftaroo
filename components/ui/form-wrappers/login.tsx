'use client';
import { AuthFormProps } from '@/lib/types';
import { useState } from 'react';
import ForgotPasswordForm from '../forms/forgot-password';
import SignInForm from '../forms/sign-in';
import SignUpForm from '../forms/sign-up';

export type formStatus = 'VIEW_FORM' | 'CHECK_EMAIL';
export type formType = 'SIGN_IN' | 'SIGN_UP' | 'FORGOT_PASSWORD';

const LoginFormWrapper = () => {
   const [view, setView] = useState<formStatus>('VIEW_FORM');
   const [formType, setFormType] = useState<formType>('SIGN_IN');

   const updateView = (view: formStatus) => {
      setView(view);
   };
   const updateFormType = (formType: formType) => {
      setFormType(formType);
   };
   const authFormProps: AuthFormProps = {
      setFormType: (formType: formType) => updateFormType(formType),
      setView: (view: formStatus) => updateView(view),
   };
   return (
      <>
         {formType === 'SIGN_IN' && <SignInForm {...authFormProps} />}
         {formType === 'SIGN_UP' && <SignUpForm {...authFormProps} />}
         {formType === 'FORGOT_PASSWORD' && (
            <ForgotPasswordForm {...authFormProps} />
         )}
      </>
   );
};

export default LoginFormWrapper;
