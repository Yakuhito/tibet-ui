import Logo from './Logo';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-screen-md">
      <header className="py-10 text-center">
        <Logo />
      </header>
      <main className="flex-grow text-center">{children}</main>
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
