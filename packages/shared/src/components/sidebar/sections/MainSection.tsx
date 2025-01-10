import type { ReactElement } from 'react';
import React, { useMemo } from 'react';
import { Section } from '../Section';
import type { SidebarMenuItem } from '../common';
import { ListIcon } from '../common';
import { BookmarkIcon, EyeIcon, HotIcon, SquadIcon } from '../../icons';
import { useAuthContext } from '../../../contexts/AuthContext';
import { ProfileImageSize, ProfilePicture } from '../../ProfilePicture';
import { OtherFeedPage } from '../../../lib/query';
import type { SidebarSectionProps } from './common';
import { webappUrl } from '../../../lib/constants';
import { usePlusSubscription } from '../../../hooks/usePlusSubscription';
import useCustomDefaultFeed from '../../../hooks/feed/useCustomDefaultFeed';
import { SharedFeedPage } from '../../utilities';
import { isExtension } from '../../../lib/func';

export const MainSection = ({
  isItemsButton,
  onNavTabClick,
  ...defaultRenderSectionProps
}: SidebarSectionProps): ReactElement => {
  const { user, isLoggedIn } = useAuthContext();
  const { isCustomDefaultFeed } = useCustomDefaultFeed();
  const { showPlusSubscription } = usePlusSubscription();

  const menuItems: SidebarMenuItem[] = useMemo(() => {
    // this path can be opened on extension so it purposly
    // is not using webappUrl so it gets selected
    let myFeedPath = isCustomDefaultFeed ? '/my-feed' : '/';

    if (isExtension) {
      myFeedPath = '/my-feed';
    }

    const myFeed = isLoggedIn
      ? {
          title: 'My feed',
          path: myFeedPath,
          action: () =>
            onNavTabClick?.(isCustomDefaultFeed ? SharedFeedPage.MyFeed : '/'),
          icon: <ProfilePicture size={ProfileImageSize.XSmall} user={user} />,
        }
      : undefined;

    return [
      myFeed,
      {
        title: 'Following',
        // this path can be opened on extension so it purposly
        // is not using webappUrl so it gets selected
        path: '/following',
        action: () => onNavTabClick?.(OtherFeedPage.Following),
        icon: (active: boolean) => (
          <ListIcon Icon={() => <SquadIcon secondary={active} />} />
        ),
      },
      {
        icon: (active: boolean) => (
          <ListIcon Icon={() => <HotIcon secondary={active} />} />
        ),
        title: 'Explore',
        path: '/posts',
        action: () => onNavTabClick?.(OtherFeedPage.Explore),
      },
      !showPlusSubscription && {
        icon: (active: boolean) => (
          <ListIcon Icon={() => <BookmarkIcon secondary={active} />} />
        ),
        title: 'Bookmarks',
        path: `${webappUrl}bookmarks`,
        isForcedLink: true,
        requiresLogin: true,
      },
      {
        icon: (active: boolean) => (
          <ListIcon Icon={() => <EyeIcon secondary={active} />} />
        ),
        title: 'History',
        path: `${webappUrl}history`,
        isForcedLink: true,
        requiresLogin: true,
      },
    ].filter(Boolean);
  }, [
    isLoggedIn,
    user,
    showPlusSubscription,
    isCustomDefaultFeed,
    onNavTabClick,
  ]);

  return (
    <Section
      {...defaultRenderSectionProps}
      items={menuItems}
      isItemsButton={isItemsButton}
      className="!mt-0"
    />
  );
};
