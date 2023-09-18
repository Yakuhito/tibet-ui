import MoonIcon from "./icons/MoonIcon";
import SunIcon from "./icons/SunIcon";

interface ThemeSwitcherProps {
  theme: "dark" | "light" | "auto";
  setTheme: (theme: ThemeSwitcherProps['theme']) => void;
}

function ThemeSwitcher({ theme, setTheme }: ThemeSwitcherProps) {

    const switchTheme = (newTheme: ThemeSwitcherProps['theme']) => {
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
      <div className="flex gap-2 items-center bg-brandDark/10 rounded-xl p-2 text-center border-2 border-transparent hover:border-brandDark/10">
        <div onClick={() => switchTheme('auto')} className={`flex items-center justify-center cursor-pointer flex-1 font-medium rounded-xl ${theme === 'auto' ? `text-brandLight bg-brandDark ${backgroundGradient}` : 'hover:opacity-60 text-brandDark dark:text-brandLight/50'} p-1.5 h-[56px]`}>Auto</div>
        <div onClick={() => switchTheme('light')} className={`flex items-center justify-center cursor-pointer h-[56px] rounded-xl flex-1 p-1.5 ${theme === 'light' ? `text-brandLight bg-brandDark ${backgroundGradient}` : 'hover:opacity-60 text-brandDark dark:text-brandLight/50'}`}>
          <SunIcon />
        </div>
        <div onClick={() => switchTheme('dark')} className={`flex items-center justify-center cursor-pointer h-[56px] rounded-xl flex-1 p-1.5 ${theme === 'dark' ? `text-brandLight bg-brandDark ${backgroundGradient}` : 'hover:opacity-60 text-brandDark dark:text-brandLight/50'}`}>
          <MoonIcon />
        </div>
      </div>
     );
}

export default ThemeSwitcher;