import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { IconChevronDown } from '@tabler/icons';
import { Text } from '@mantine/core';
import { getDocsData } from '../../../../utils/get-docs-data';
import useStyles from './NavbarDocsCategory.styles';
import { HEADER_HEIGHT } from '../../Header/HeaderDesktop.styles';
import { useRouter } from 'next/router';
import useRawPath from '@/hooks/use-raw-path';

interface NavbarDocsCategoryProps {
    group: ReturnType<typeof getDocsData>[number];
    onLinkClick(): void;
}

function hasActiveLink(
    group: ReturnType<typeof getDocsData>[number],
    pathname: string
) {
    if (group.uncategorized.some((link) => link.slug === pathname)) {
        return true;
    }

    if (
        group.groups.some((_group) =>
            _group.pages.some((link) => link.slug === pathname)
        )
    ) {
        return true;
    }

    return false;
}

export default function NavbarDocsCategory({
    group,
    onLinkClick,
}: NavbarDocsCategoryProps) {
    const { classes, cx } = useStyles();
    const { router, rawPath } = useRawPath();

    const [collapsed, setCollapsed] = useState(
        !hasActiveLink(group, router.asPath)
    );
    const itemRefs = useRef<Record<string, HTMLElement>>({});

    useEffect(() => {
        if (
            hasActiveLink(group, router.asPath) &&
            itemRefs.current[router.asPath]
        ) {
            const element = itemRefs.current[router.asPath];
            const height =
                typeof window !== 'undefined' ? window.innerHeight : 0;
            const { top, bottom } = element.getBoundingClientRect();

            if (top < HEADER_HEIGHT || bottom > height) {
                element.scrollIntoView({ block: 'center' });
            }
        }
    }, [router.asPath]);

    const uncategorized = (
        group.group === 'changelog'
            ? [...group.uncategorized].reverse()
            : group.uncategorized
    ).map((link) => {
        return (
            <Link
                key={link.slug}
                className={cx(
                    classes.link,
                    rawPath === link.slug && classes.linkActive
                )}
                href={link.slug}
                onClick={onLinkClick}
                ref={(r) => {
                    if (r) itemRefs.current[link.slug] = r;
                }}
            >
                {link.title}
            </Link>
        );
    });

    const categorized = !Array.isArray(group.groups)
        ? []
        : group.groups.map((part) => {
              if (!part || !Array.isArray(part.pages)) {
                  return null;
              }
              const links = part.pages.map((link) => {
                  return (
                      <Link
                          key={link.slug}
                          className={cx(
                              classes.link,
                              rawPath === link.slug && classes.linkActive
                          )}
                          href={link.slug}
                          onClick={onLinkClick}
                          ref={(r) => {
                              if (r) itemRefs.current[link.slug] = r;
                          }}
                      >
                          {link.title}
                      </Link>
                  );
              });

              return (
                  <div
                      className={classes.innerCategory}
                      key={part.category.title}
                  >
                      <Text className={classes.innerCategoryTitle}>
                          {part.category.icon && (
                              <part.category.icon
                                  className={classes.innerCategoryIcon}
                              />
                          )}
                          {part.category.title}
                      </Text>
                      {links}
                  </div>
              );
          });

    return (
        <div
            className={cx(classes.category, {
                [classes.categoryCollapsed]: collapsed,
            })}
        >
            <button
                className={classes.header}
                type="button"
                onClick={() => setCollapsed((c) => !c)}
            >
                <IconChevronDown
                    className={cx(classes.icon, {
                        [classes.iconCollapsed]: collapsed,
                    })}
                />
                <Text
                    className={classes.title}
                    weight={700}
                    size="xs"
                    transform="uppercase"
                >
                    {group.group.replace('-', ' ')}
                </Text>
            </button>
            {!collapsed && uncategorized}
            {!collapsed && categorized}
        </div>
    );
}
