'use client';

import { signup } from '@/app/login/actions';
import { AuthFormProps } from '@/lib/types';
import { ChangeEvent, useState } from 'react';

const SignUpForm = (props: AuthFormProps) => {
   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const [firstName, setFirstName] = useState<string>('');
   const [lastName, setLastName] = useState<string>('');
   const [username, setUsername] = useState<string>('');
   const [verifyPassword, setVerifyPassword] = useState<string>('');
   const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
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
   const { setFormType } = props;

   return (
      <>
         <form className="flex-1 flex flex-col w-full lg:w-96 justify-center gap-2 text-foreground dark:text-white">
            <label className="text-md" htmlFor="username">
               Username
            </label>
            <input
               className="rounded-md px-4 py-2 bg-inherit border mb-3 dark:text-white"
               type="text"
               autoComplete="none"
               name="username"
               onChange={(e) => setUsername(e.target.value)}
               value={username}
               placeholder=""
            />
            <label className="text-md" htmlFor="first-name">
               First Name
            </label>
            <input
               className="rounded-md px-4 py-2 bg-inherit border mb-3 dark:text-white"
               type="text"
               name="first-name"
               autoComplete="given-name"
               onChange={(e) => setFirstName(e.target.value)}
               value={firstName}
               placeholder="Joe"
            />
            <label className="text-md" htmlFor="last-name">
               Last Name
            </label>
            <input
               className="rounded-md px-4 py-2 bg-inherit border mb-3 dark:text-white"
               type="text"
               name="last-name"
               autoComplete="family-name"
               onChange={(e) => setLastName(e.target.value)}
               value={lastName}
               placeholder="Mama"
            />
            <label className="text-md" htmlFor="email">
               Email
            </label>
            <input
               className="rounded-md px-4 py-2 bg-inherit border mb-3 dark:text-white"
               type="email"
               name="email"
               autoComplete="email"
               onChange={(e) => setEmail(e.target.value)}
               value={email}
               placeholder="you@example.com"
            />
            <label className="text-md" htmlFor="password">
               Password
            </label>
            <input
               className="rounded-md px-4 py-2 bg-inherit border mb-3 dark:text-white"
               type="password"
               name="password"
               onChange={(e) => {
                  setPassword(e.target.value);
                  setValidPassword(passwordPattern.test(e.target.value));
               }}
               value={password}
               placeholder="••••••••"
               required
               minLength={10}
            />
            {!validPassword && (
               <p className="mb-2 text-red-600 text-sm">
                  Password must include uppercase and lowercase, number, and
                  special character. Can&apos;t include following words: pass,
                  code, or secret
               </p>
            )}
            <label className="text-md" htmlFor="verify-password">
               Verify Password
            </label>
            <input
               className={`rounded-md px-4 py-2 bg-inherit border dark:text-white ${
                  !passwordsMatch ? 'mb-0' : 'mb-3'
               }`}
               type="password"
               name="verify-password"
               onChange={(e: ChangeEvent<HTMLInputElement>) => checkPassword(e)}
               value={verifyPassword}
               placeholder="••••••••"
               required
               minLength={10}
            />

            {!passwordsMatch && (
               <p className="text-red-700 mb-3">Passwords must match</p>
            )}
            <button
               className={`disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-primary rounded px-4 py-2 text-white mb-3 `}
               disabled={passwordsMatch && validPassword ? false : true}
               formAction={signup}
            >
               Sign Up
            </button>
            <p className="text-sm text-center">
               Already have an account?
               <button
                  className="ml-1 underline"
                  onClick={() => setFormType('SIGN_IN')}
               >
                  Sign In Now
               </button>
            </p>
         </form>
      </>
   );
};

export default SignUpForm;
