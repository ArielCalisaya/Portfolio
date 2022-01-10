import { useRouter } from 'next/router';
import classNames from 'classnames';

function Navbar() {
  const router = useRouter();

  // Use the customized Scrollspy component
  const MENU_ITEMS = [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'About',
      href: '/about',
    },
    {
      label: 'Contact',
      href: '/contact',
    },
    {
      label: 'Projects',
      href: '/projects',
    },
  ];
  // If router.pathname is equal to the href set active classNames else use the default classNames
  const isActiveLink = (href) => classNames({
    'bg-gray-900 text-white block': router.pathname === href, // active
    'text-gray-800 hover:bg-gray-700 hover:text-white block': router.pathname !== href, // default
  });

  return (
    <nav className="[ sticky top-0 bg-gray-600 mb-8 ]">
      <div className="[ max-w-7xl mx-auto px-2 py-4 sm:px-6 lg:px-8 ]">
        <div className="[ relative flex items-center justify-between h-16 ]">
          <div className="[ absolute inset-y-0 left-0 flex items-center sm:hidden ]">
            <button type="button" className="[ inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ]" aria-controls="mobile-menu" aria-expanded="false">
              <span className="[ sr-only ]">Open main menu</span>
              <svg className="[ block h-6 w-6 ]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className="[ hidden h-6 w-6 ]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="[ flex-1 flex items-center justify-center sm:items-stretch sm:justify-between ]">
            <div className="[ flex-shrink-0 flex items-center ]">
              <img className="[ block lg:hidden h-8 w-auto ]" src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow" />
              <img className="[ hidden lg:block h-8 w-auto ]" src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg" alt="Workflow" />
            </div>
            <div className="[ hidden sm:block sm:ml-6 ]">
              <div className="[ flex space-x-4 ]">
                {MENU_ITEMS.map(({ label, href }) => (
                  <a
                    key={`${label} - (desktop)`}
                    href={href || '#'}
                    className={`[ ${isActiveLink(href)} px-3 py-2 rounded-md smart-text-size-300 font-medium ]`}
                    aria-current={router.pathname === href ? 'page' : false}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      <div className="sm:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {MENU_ITEMS.map(({ label, href }) => (
            <a
              key={`${label} - (mobile)`}
              href={href || '#'}
              className={`[ ${isActiveLink(href)} px-3 py-2 rounded-md smart-text-size-300 font-medium ]`}
              aria-current={router.pathname === href ? 'page' : false}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
