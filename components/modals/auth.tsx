'use client';

import { AuthFormProps, ModalProps } from '@/lib/types';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import SignInForm from '../forms/sign-in';
import SignUpForm from '../forms/sign-up';
import styles from './modals.module.css';

export type formStatus = 'VIEW_FORM' | 'CHECK_EMAIL';

export type formType = 'SIGN_IN' | 'SIGN_UP';

const AuthModal = (props: ModalProps) => {
   const [view, setView] = useState<formStatus>('VIEW_FORM');
   const [formType, setFormType] = useState<formType>('SIGN_IN');
   const [email, setEmail] = useState('');

   const [modalIsOpen, setModalIsOpen] = useState(false);

   useEffect(() => {
      Modal.setAppElement('#DraftarooApp');
   }, []);

   const handleClick = () => {
      setModalIsOpen(true);
   };

   const handleClose = () => {
      setModalIsOpen(false);
   };

   const modalStyles = {
      content: {
         maxWidth: '80vw',
         backgroundColor: 'rgb(50,50,50)',
         opacity: '1',
      },
   };

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
         <button
            className={classNames(props.buttonClass, 'text-white')}
            onClick={handleClick}
         >
            {props.buttonText ? props.buttonText : 'Login'}
         </button>
         <Modal
            isOpen={modalIsOpen}
            className={styles['modal']}
            style={modalStyles}
            ariaHideApp={false}
         >
            <button onClick={handleClose} className={classNames('text-white')}>
               Close
            </button>
            <>
               {formType === 'SIGN_IN' ? (
                  <SignInForm {...authFormProps} />
               ) : (
                  <SignUpForm {...authFormProps} />
               )}
            </>
         </Modal>
      </>
   );
};

export default AuthModal;
