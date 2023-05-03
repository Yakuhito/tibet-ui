interface LayoutProps {
  children: React.ReactNode;
  isHomePage?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isHomePage = false }) => {
  return (
    <div className={`flex flex-col mx-auto max-w-screen-md items-center min-h-[calc(100svh-96px)]`}>
      <main className={`flex flex-col items-center w-full max-w-[28rem] pb-24`}>{children}</main>
      <footer className="pb-6 pt-1 text-center text-brandDark mt-auto">
        <p>
          Built with 💚 by the{' '}
          <a href="https://twitter.com/yakuh1t0" target="_blank" rel="noopener noreferrer">
            yak
          </a>{' '}& GPT-4 |
          {/* <br /> */}
          {' '}Powered by{' '}
          <a
            href="https://fireacademy.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            FireAcademy.io
          </a>{' '}
          {/* <br /> */}
          {' '}| Follow us on{' '}
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
