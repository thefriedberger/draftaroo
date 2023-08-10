'use client';

import { AuthFormProps, UserProps } from '@/lib/types';
import addUser from '@/utils/add-user';
import { ChangeEvent, useState } from 'react';

const SignUpForm = (props: AuthFormProps) => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [verifyPassword, setVerifyPassword] = useState('');
   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const [username, setUsername] = useState('');
   const [passwordsMatch, setPasswordsMatch] = useState(true);

   const { setView, setFormType } = props;

   const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const userProps: UserProps = {
         email: email,
         password: password,
         firstName: firstName,
         lastName: lastName,
         username: username,
         origin: location.origin,
      };
      const didSubmit = await addUser(userProps);
      setView(didSubmit);
   };

   const checkPassword = (e: ChangeEvent<HTMLInputElement>) => {
      setVerifyPassword(e.target.value);
      if (e?.target?.value === password) {
         setPasswordsMatch(true);
      } else {
         setPasswordsMatch(false);
      }
   };
   return (
      <>
         <form
            className="flex-1 flex flex-col w-full lg:w-96 justify-center gap-2 text-foreground"
            onSubmit={handleSignUp}
         >
            <label className="text-md" htmlFor="username">
               Username
            </label>
            <input
               className="rounded-md px-4 py-2 bg-inherit border mb-3"
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
               className="rounded-md px-4 py-2 bg-inherit border mb-3"
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
               className="rounded-md px-4 py-2 bg-inherit border mb-3"
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
               className="rounded-md px-4 py-2 bg-inherit border mb-3"
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
               className="rounded-md px-4 py-2 bg-inherit border mb-3"
               type="password"
               name="password"
               onChange={(e) => setPassword(e.target.value)}
               value={password}
               placeholder="••••••••"
            />
            <label className="text-md" htmlFor="verify-password">
               Verify Password
            </label>
            <input
               className={`rounded-md px-4 py-2 bg-inherit border ${
                  !passwordsMatch ? 'mb-0' : 'mb-3'
               }`}
               type="password"
               name="verify-password"
               onChange={(e: ChangeEvent<HTMLInputElement>) => checkPassword(e)}
               value={verifyPassword}
               placeholder="••••••••"
            />

            {!passwordsMatch && (
               <p className="text-red-700 mb-3">Passwords must match</p>
            )}
            <button
               className={`${
                  !passwordsMatch ? 'opacity-30' : ''
               } bg-emerald-primary rounded px-4 py-2 text-white mb-3`}
               disabled={!passwordsMatch}
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
