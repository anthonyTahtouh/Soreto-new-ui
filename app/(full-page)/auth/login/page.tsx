'use client';
import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Page } from '../../../../types/layout';
import { classNames } from 'primereact/utils';
import { useContext } from 'react';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import StoreContext from "../../../../store/Context";
import { Toast } from 'primereact/toast';

const Login: Page = () => {
    const router = useRouter();
    const navigateToDashboard = () => {
        router.push('/');
    };
    const { layoutConfig } = useContext(LayoutContext);
    const filledInput = layoutConfig.inputStyle === 'filled';

    const { login } = useContext(StoreContext);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
  
    function isValidValue(currentEmail: any, currentPassword: string): boolean {
      if (!currentEmail || !currentPassword) {
        if (!currentEmail && !currentPassword) {
          showError('Invalid credentials', 'Please complete the email and password to login!');
        } else if (!currentEmail) {
          showError('Invalid credentials', 'Please complete the email to login!');
        } else {
          showError('Invalid credentials', 'Please complete the password to login!');
        }
        return true;
      }
  
      return false;
    }

    const showError = (summary: string, detail: string) => {
        toast.current?.show({
            severity: 'error',
            summary: summary,
            detail: detail,
            life: 3000
        });
    };
  
    const handleSubmit = async () => {
      //setLoading(true);
      //event.preventDefault();
  
      try {
        if (isValidValue(email, password)) {
          throw new Error("isValidValue");
        }
  
        const loginObject = {
          userName: email,
          password,
        };
  
        // The login it's on file call context.ts
        await login(loginObject.userName, loginObject.password);
      } catch (error: any) {
        setLoading(false);
        if (error.code === 'ERR_BAD_REQUEST') {
            showError('Invalid credentials', 'Try again or click Forgot password to reset it.');
        }
        console.log(error);
      }
    };
  
    function handleFeatureNotImplemented(e: { preventDefault: () => void; }) {
      console.log(['Feature not yet implemented.'], 'error');
      e.preventDefault();
    }

    return (
        <div className={classNames('surface-ground h-screen w-screen flex align-items-center justify-content-center', { 'p-input-filled': filledInput })}>
            <Toast ref={toast} />
            <div className="surface-card py-7 px-5 sm:px-7 shadow-2 flex flex-column w-11 sm:w-30rem" style={{ borderRadius: '14px' }}>
                <div className="flex flex-column">
                    <div className='flex align-items-center justify-content-center'>
                        <img alt="app logo" className='w-5 m-5' src='/layout/images/logo-dark.png' />
                    </div>
                </div>

                <span className="p-input-icon-left mb-4">
                    <i className="pi pi-user"></i>
                    <InputText type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full" />
                </span>

                <span className="p-input-icon-left mb-4">
                    <i className="pi pi-key"></i>
                    <InputText type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full" />
                </span>

                <Button label="Sign In" className="mb-4" onClick={handleSubmit}></Button>

                <span className="text-color-secondary text-center mb-4">or sign in with below</span>

                <div className="flex gap-4 align-items-center justify-content-center">
                    <a href="https://www.facebook.com" className="inline-flex flex-shrink-0 w-3rem h-3rem justify-content-center align-items-center surface-ground border-circle">
                        <i className="pi pi-facebook text-2xl text-color"></i>
                    </a>
                    <a href="https://www.twitter.com" className="inline-flex flex-shrink-0 w-3rem h-3rem justify-content-center align-items-center surface-ground border-circle">
                        <i className="pi pi-twitter text-2xl text-color"></i>
                    </a>
                    <a href="https://www.google.com" className="inline-flex flex-shrink-0 w-3rem h-3rem justify-content-center align-items-center surface-ground border-circle">
                        <i className="pi pi-google text-2xl text-color"></i>
                    </a>
                    <a href="https://www.github.com" className="inline-flex flex-shrink-0 w-3rem h-3rem justify-content-center align-items-center surface-ground border-circle">
                        <i className="pi pi-github text-2xl text-color"></i>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
