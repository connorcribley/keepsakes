"use client"

import { useEffect, useRef, useState } from 'react';

type Props = {
  formId: string;
};

const CAPTCHASubmit = ({ formId }: Props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    // Load reCAPTCHA script if not already present
    if (!document.querySelector("#recaptcha-script")) {
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.id = "recaptcha-script";
      document.body.appendChild(script);
    }

    // Define the form submit callback
    (window as any).onSubmit = () => {
      const form = document.getElementById(formId) as HTMLFormElement | null;
      if (form) {
        form.requestSubmit();
      } else {
        console.error("Could not find form to submit!");
      }
    };

    let interval: NodeJS.Timeout;

    const checkAndRenderCaptcha = () => {
      const grecaptcha = (window as any).grecaptcha;

      if (
        grecaptcha &&
        grecaptcha.render &&
        buttonRef.current &&
        widgetIdRef.current === null
      ) {
        widgetIdRef.current = grecaptcha.render(buttonRef.current, {
          sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          callback: "onSubmit",
          badge: "inline",
        });
        clearInterval(interval);
      }
    };

    // Poll until grecaptcha is available
    interval = setInterval(checkAndRenderCaptcha, 100);

    return () => {
      clearInterval(interval);
    };
  }, [formId]);

  if (!hasMounted) return null;

  return (
    <div className="captcha-wrapper mt-2 w-full">
      <button
        ref={buttonRef}
        className="g-recaptcha mt-2 cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        Sign Up
      </button>
    </div>
  );
};

export default CAPTCHASubmit;
