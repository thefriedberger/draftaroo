'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChangeEvent, useState } from 'react';
import { resetPassword } from '../login/actions';

const AccountRecovery = () => {
   const supabase = createClientComponentClient<Database>();
   const [password, setPassword] = useState('');
   const [verifyPassword, setVerifyPassword] = useState('');
   const [passwordsMatch, setPasswordsMatch] = useState(true);
   const [validPassword, setValidPassword] = useState<boolean>(true);
   const passwordPattern = new RegExp(
      /(?=^.{10,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!?@#$%^&*])(?!.*?(pass))(?!.*?(code))(?!.*?(secret)).*/gi
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
         <div className="flex flex-col max-w-44">
            <label htmlFor="newPassword" className={'dark:text-white'}>
               New Password:{' '}
            </label>
            <input
               id="newPassword"
               type="password"
               onChange={(e) => {
                  setPassword(e.target.value);
                  setValidPassword(passwordPattern.test(e.target.value));
               }}
               value={password}
               placeholder="••••••••"
               required
               minLength={10}
               className="invalid:border-red focus:invalid:border-red border-2"
            />
            {!validPassword && (
               <p className="mt-2 text-red-600 text-sm">
                  Password must include uppercase and lowercase, number, and
                  special character. Can&apos;t include following words: pass,
                  code, or secret
               </p>
            )}
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

export default AccountRecovery;
