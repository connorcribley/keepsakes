"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  formId: string;
  siteKey: string;
};

const CAPTCHASubmit = ({ formId, siteKey }: Props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  // Load reCAPTCHA script and wait for grecaptcha to be available
  useEffect(() => {
    const loadRecaptcha = () => {
      return new Promise<void>((resolve) => {
        if ((window as any).grecaptcha) {
          resolve();
        } else {
          const script = document.createElement("script");
          script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
          script.async = true;
          script.defer = true;
          script.onload = () => resolve();
          script.id = "recaptcha-script";
          document.body.appendChild(script);
        }
      });
    };

    const initRecaptcha = async () => {
      await loadRecaptcha();

      const grecaptcha = (window as any).grecaptcha;

      console.log(siteKey)

      grecaptcha.ready(() => {
        if (buttonRef.current && widgetIdRef.current === null) {
          widgetIdRef.current = grecaptcha.render(buttonRef.current, {
            sitekey: siteKey,
            callback: () => {
              const form = document.getElementById(formId) as HTMLFormElement | null;
              if (form) form.requestSubmit();
              else console.error("Form not found!");
            },
            badge: "inline",
          });

          setReady(true);
        }
      });
    };

    initRecaptcha();
  }, [formId, siteKey]);

  return (
    <div className="captcha-wrapper mt-2 w-full">
      <button
        ref={buttonRef}
        className="g-recaptcha cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        Sign Up
      </button>
    </div>
  );
};

export default CAPTCHASubmit;
