import MoonIcon from "../icons/MoonIcon";
import SunIcon from "../icons/SunIcon";

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
      <div className="flex items-center gap-1 bg-brandDark/10 rounded-2xl p-1.5 h-16 text-center border-2 border-transparent hover:border-brandDark/10">
        <div onClick={() => switchTheme('auto')} className={`flex h-full items-center justify-center cursor-pointer flex-1 font-medium transition rounded-xl ${theme === 'auto' ? `text-brandLight bg-brandDark ${backgroundGradient}` : 'hover:opacity-60 text-brandDark dark:text-brandLight/50'}`}>Auto</div>
        <div onClick={() => switchTheme('light')} className={`flex h-full items-center justify-center cursor-pointer rounded-xl flex-1 p-1.5 ${theme === 'light' ? `text-brandLight bg-brandDark ${backgroundGradient}` : 'hover:opacity-60 text-brandDark dark:text-brandLight/50'}`}>
          <SunIcon />
        </div>
        <div onClick={() => switchTheme('dark')} className={`flex h-full items-center justify-center cursor-pointer rounded-xl flex-1 p-1.5 ${theme === 'dark' ? `text-brandLight bg-brandDark ${backgroundGradient}` : 'hover:opacity-60 text-brandDark dark:text-brandLight/50'}`}>
          <MoonIcon />
        </div>
      </div>
     );
}

export default ThemeSwitcher;