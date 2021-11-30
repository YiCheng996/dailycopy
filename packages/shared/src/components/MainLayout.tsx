import React, {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useContext,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import classed from '../lib/classed';
import { Button } from './buttons/Button';
import ProgressiveEnhancementContext from '../contexts/ProgressiveEnhancementContext';
import AuthContext from '../contexts/AuthContext';
import PromotionalBanner from './PromotionalBanner';
import Logo from '../svg/Logo';
import LogoText from '../svg/LogoText';
import BookmarkIcon from '../../icons/bookmark.svg';
import styles from './MainLayout.module.css';
import LayoutIcon from '../../icons/layout.svg';
import ProfileButton from './profile/ProfileButton';
import { SimpleTooltip } from './tooltips/SimpleTooltip';
import { LinkWithTooltip } from './tooltips/LinkWithTooltip';

export interface MainLayoutProps extends HTMLAttributes<HTMLDivElement> {
  showOnlyLogo?: boolean;
  responsive?: boolean;
  showRank?: boolean;
  greeting?: boolean;
  mainPage?: boolean;
  additionalButtons?: ReactNode;
  onLogoClick?: (e: React.MouseEvent) => unknown;
  onShowDndClick?: () => unknown;
}

const HeaderRankProgress = dynamic(
  () =>
    import(/* webpackChunkName: "headerRankProgress" */ './HeaderRankProgress'),
);

const Settings = dynamic(
  () => import(/* webpackChunkName: "settings" */ './Settings'),
);

const Greeting = dynamic(
  () => import(/* webpackChunkName: "greeting" */ './Greeting'),
);

export const HeaderButton = classed(Button, 'hidden mx-0.5 laptop:flex');

export default function MainLayout({
  children,
  showOnlyLogo,
  responsive = true,
  showRank,
  greeting,
  mainPage,
  additionalButtons,
  onLogoClick,
  onShowDndClick,
}: MainLayoutProps): ReactElement {
  const { windowLoaded } = useContext(ProgressiveEnhancementContext);
  const { user, showLogin, loadingUser } = useContext(AuthContext);
  const [showSettings, setShowSettings] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  const afterBookmarkButtons = (
    <>
      {additionalButtons}
      {mainPage && (
        <SimpleTooltip placement="bottom" content="Settings">
          <HeaderButton
            icon={<LayoutIcon />}
            className="btn-tertiary"
            onClick={() => setShowSettings(!showSettings)}
            pressed={showSettings}
          />
        </SimpleTooltip>
      )}
    </>
  );

  return (
    <>
      {!responsive && <PromotionalBanner />}
      <header
        className={`${
          styles.header
        } relative flex items-center px-4 border-b border-theme-divider-tertiary tablet:px-8 laptop:px-4 ${
          responsive
            ? 'laptop:absolute laptop:top-0 laptop:left-0 laptop:w-full laptop:border-b-0'
            : 'non-responsive-header'
        }`}
      >
        <LinkWithTooltip
          href={process.env.NEXT_PUBLIC_WEBAPP_URL}
          passHref
          prefetch={false}
          tooltip={{ placement: 'right', content: 'Home' }}
        >
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <a className="flex items-center" onClick={onLogoClick}>
            <Logo className={styles.homeSvg} />
            <CSSTransition
              in={!showGreeting}
              timeout={500}
              classNames="fade"
              unmountOnExit
            >
              <LogoText
                className={classNames(
                  styles.homeSvg,
                  'hidden ml-1 laptop:block',
                )}
              />
            </CSSTransition>
          </a>
        </LinkWithTooltip>
        {windowLoaded && greeting && (
          <Greeting
            user={user}
            onEnter={() => setShowGreeting(true)}
            onExit={() => setShowGreeting(false)}
          />
        )}
        <div className="flex-1" />
        {!showOnlyLogo && !loadingUser && (
          <>
            {user ? (
              <>
                <Link
                  href={`${process.env.NEXT_PUBLIC_WEBAPP_URL}bookmarks`}
                  passHref
                  prefetch={false}
                >
                  <SimpleTooltip placement="bottom" content="Bookmarks">
                    <HeaderButton
                      tag="a"
                      icon={<BookmarkIcon />}
                      className="btn-tertiary"
                    />
                  </SimpleTooltip>
                </Link>
                {afterBookmarkButtons}
                <ProfileButton onShowDndClick={onShowDndClick} />
              </>
            ) : (
              <>
                <SimpleTooltip placement="bottom" content="Bookmarks">
                  <HeaderButton
                    icon={<BookmarkIcon />}
                    onClick={() => showLogin('bookmark')}
                    className="btn-tertiary"
                  />
                </SimpleTooltip>
                {afterBookmarkButtons}
                <Button
                  onClick={() => showLogin('main button')}
                  className="btn-primary"
                >
                  Login
                </Button>
              </>
            )}
          </>
        )}
        {showRank && windowLoaded && (
          <HeaderRankProgress className="absolute right-0 -bottom-px left-0 z-rank my-0 mx-auto transform translate-y-1/2" />
        )}
      </header>
      {showSettings && (
        <Settings
          panelMode
          className="border-b border-theme-divider-tertiary"
        />
      )}
      {children}
    </>
  );
}
