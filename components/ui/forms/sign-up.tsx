'use client';

import { signup } from '@/app/login/actions';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
const SignUpForm = () => {
   const searchParams = useSearchParams();
   const [email, setEmail] = useState<string>(searchParams.get('email') ?? '');
   const [password, setPassword] = useState<string>('');
   const [firstName, setFirstName] = useState<string>('');
   const [lastName, setLastName] = useState<string>('');
   const [username, setUsername] = useState<string>('');
   const [verifyPassword, setVerifyPassword] = useState<string>('');
   const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
   const [validPassword, setValidPassword] = useState<boolean>(true);
   const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
   const [origin, setOrigin] = useState<string>();

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
   useEffect(() => {
      setOrigin(`${location.origin}`);
   }, []);

   const handleSignup = async (formData: FormData) => {
      const response = await signup(formData);
      if (!response) {
         setFormSubmitted(true);
      } else {
         // if (response.status === 422) {
         //    login(formData);
         // }
         setFormSubmitted(false);
      }
   };

   return (
      <>
         {!formSubmitted ? (
            <form className="flex-1 flex flex-col w-full lg:w-96 px-2 md-px-0 justify-center gap-2 text-foreground dark:text-white">
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
               <div className="flex flex-col">
                  <label className="text-md mb-2" htmlFor="password">
                     Password
                  </label>
                  <input
                     className="rounded-md px-4 py-2 bg-inherit border mb-3 invalid:border invalid:border-red-600 invalid:focus:outline-offset-[0px] invalid:outline-[0.5px] invalid:focus:outline invalid:focus:outline-red-400 dark:text-white peer"
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
                     pattern={
                        '(?=^.{10,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!?@#$%^&*]).*'
                     }
                  />
                  <p className="hidden peer-invalid:block mb-2 text-red-600 text-sm">
                     Password must be 10 characters and include uppercase and
                     lowercase, number, and special character.
                  </p>
               </div>
               <div className="flex flex-col">
                  <label className="text-md mb-2" htmlFor="verify-password">
                     Verify Password
                  </label>
                  <input
                     className={`rounded-md px-4 py-2 bg-inherit border dark:text-white invalid:border invalid:border-red-600 invalid:focus:outline-offset-[0px] invalid:outline-[0.5px] invalid:focus:outline invalid:focus:outline-red-400 ${
                        !passwordsMatch ? 'mb-0' : 'mb-3'
                     }`}
                     type="password"
                     name="verify-password"
                     onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        checkPassword(e)
                     }
                     value={verifyPassword}
                     placeholder="••••••••"
                     required
                     minLength={10}
                     pattern={
                        '(?=^.{10,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!?@#$%^&*]).*'
                     }
                  />
               </div>

               {!passwordsMatch && (
                  <p className="text-red-700 mb-3">Passwords must match</p>
               )}
               <input
                  className="hidden"
                  name="origin"
                  id="origin"
                  value={origin}
               />
               <button
                  className={`disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-primary rounded px-4 py-2 text-white mb-3 `}
                  disabled={passwordsMatch && validPassword ? false : true}
                  formAction={handleSignup}
               >
                  Sign Up
               </button>
               <p className="text-sm text-center">
                  Already have an account?
                  <Link className="ml-1 underline" href="/login">
                     Sign In Now
                  </Link>
               </p>
            </form>
         ) : (
            <h1 className="mt-5 text-xl dark:text-white">
               Invite sent, check email for confirmation link
            </h1>
         )}
      </>
   );
};

export default SignUpForm;
