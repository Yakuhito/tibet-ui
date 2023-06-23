import { useState, useEffect } from 'react';
import * as React from 'react';


function ThemeSwitcher() {

    // Theme detector
    const [theme, setTheme] = useState<"dark" | "light" | "auto" | undefined>();
    useEffect(() => {
      const detectTheme = () => {
        if (typeof window !== 'undefined') {
          if (localStorage.theme === 'dark') {
            document.documentElement.classList.add('dark');
            setTheme('dark');
          } else if (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
            setTheme('auto')
          } else if (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.documentElement.classList.remove('dark');
            setTheme('auto')
          } else {
            document.documentElement.classList.remove('dark');
            setTheme('light');
          }
        }
      }
      detectTheme()

      // Detect user preference change
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectTheme);

      return () => {
        window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', detectTheme);
      };

    }, [theme]);

    const switchTheme = (newTheme: "dark" | "light" | "auto") => {
      switch (newTheme) {
        case "dark":
          localStorage.setItem('theme', 'dark')
          setTheme("dark")
          break;
        case "light":
          localStorage.setItem('theme', 'light')
          setTheme("light")
          break;
        default:
          localStorage.removeItem('theme')
          setTheme("auto")
          break;
      }
    };

    const backgroundGradient = "bg-gradient-to-br from-[#7fa9b8] to-brandDark dark:from-brandDark dark:to-[#152f38]"

    return ( 
        <div className={`hover:border-brandDark/10 border-2 border-transparent flex gap-2 items-center bg-brandDark/10 rounded-xl p-2 text-center`}>
          <p onClick={() => switchTheme('auto')} className={`cursor-pointer font-medium px-4 py-4 w-full rounded-xl ${theme === 'auto' ? `text-brandLight bg-brandDark ${backgroundGradient}` : 'hover:opacity-60 text-brandDark dark:text-brandLight/50'}`}>Auto</p>
          <div onClick={() => switchTheme('light')} className={`flex items-center justify-center cursor-pointer h-[56px] rounded-xl w-full p-1.5 ${theme === 'light' ? `text-brandLight bg-brandDark ${backgroundGradient}` : 'hover:opacity-60 text-brandDark dark:text-brandLight/50'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          </div>
          <div onClick={() => switchTheme('dark')} className={`flex items-center justify-center cursor-pointer h-[56px] rounded-xl w-full p-1.5 ${theme === 'dark' ? `text-brandLight bg-brandDark ${backgroundGradient}` : 'hover:opacity-60 text-brandDark dark:text-brandLight/50'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </div>
        </div>
     );
}

export default ThemeSwitcher;