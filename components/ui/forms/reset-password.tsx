'use client';

import { resetPassword } from '@/app/login/actions';
import { ChangeEvent, useState } from 'react';

const ResetPasswordForm = () => {
   const [password, setPassword] = useState('');
   const [verifyPassword, setVerifyPassword] = useState('');
   const [passwordsMatch, setPasswordsMatch] = useState(true);
   const [validPassword, setValidPassword] = useState<boolean>(true);
   const passwordPattern = new RegExp(
      /(?=^.{10,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!?@#$%^&*]).*/gi
   );

   const checkPassword = (e: ChangeEvent<HTMLInputElement>) => {
      setVerifyPassword(e.target.value);
      if (e?.target?.value === password) {
         setPasswordsMatch(true);
      } else {
         setPasswordsMatch(false);
      }
   };
   return (
      <form>
         <div className="flex flex-col max-w-96">
            <label htmlFor="password" className={'dark:text-white'}>
               New Password:{' '}
            </label>
            <input
               id="password"
               name="password"
               type="password"
               onChange={(e) => {
                  setPassword(e.target.value);
                  setValidPassword(passwordPattern.test(e.target.value));
               }}
               value={password}
               placeholder="••••••••"
               required
               minLength={10}
               pattern={
                  '(?=^.{10,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!?@#$%^&*]).*'
               }
               className="peer invalid:border-red focus:invalid:border-red border-2"
            />
            <p className="peer-invalid:block hidden mt-2 text-red-600 text-sm w-40">
               Password must be 10 characters and include uppercase and
               lowercase, number, and special character
            </p>
         </div>
         <div className="flex flex-col">
            <label htmlFor="confirmPassword" className={'dark:text-white'}>
               Confirm Password:{' '}
            </label>
            <input
               id="confirmPassword"
               type="password"
               onChange={(e: ChangeEvent<HTMLInputElement>) => checkPassword(e)}
               value={verifyPassword}
               placeholder="••••••••"
               required={true}
               pattern={
                  '(?=^.{10,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!?@#$%^&*]).*'
               }
               className="focus:outline-none focus:invalid:border-red invalid:border-red"
            />
         </div>
         {!passwordsMatch && (
            <p className="text-red-700 mb-3">Passwords must match</p>
         )}
         <button
            className="bg-white dark:text-black rounded-md mx-auto max-w-min-content p-2 mt-2"
            type="submit"
            formAction={resetPassword}
         >
            Update password
         </button>
      </form>
   );
};

export default ResetPasswordForm;
