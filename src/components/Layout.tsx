import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  isHomePage?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isHomePage = false }) => {
  return (
    <div className={`flex flex-col min-h-screen mx-auto max-w-screen-md ${isHomePage ? 'justify-center' : ''}`}>
      <header className="py-10 text-center">
        <Logo />
      </header>
      <main className={`flex flex-col items-center ${isHomePage ? 'justify-center' : ''} flex-grow`}>{children}</main>
      <footer className="py-6 text-center text-gray-600">
        <p>
          Built with 💚 by the{' '}
          <a href="https://twitter.com/yakuh1t0" target="_blank" rel="noopener noreferrer">
            yak
          </a>{' '}& GPT-4
          <br />
          Powered by{' '}
          <a
            href="https://fireacademy.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            FireAcademy.io
          </a>
          <br />
          Follow us on{' '}
          <a
            href="https://twitter.com/TibetSwap"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Twitter
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Layout;
