import React, { useState, useEffect } from 'react';
import { Tabs, Title, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import { useMediaQuery } from '@mantine/hooks';
import { MdxSiblings } from '../MdxSiblings/MdxSiblings';
import TableOfContents from '../TableOfContents/TableOfContents';
import { MdxPageBase } from '../MdxPageBase/MdxPageBase';
import { StylesApi } from './StylesApi/StylesApi';
import { MdxPageProps } from '../../../types';
import useStyles from './MdxPageTabs.styles';
import { useRouter } from 'next/router';
import { useMDXComponent } from 'next-contentlayer/hooks';
import PropsTable from './PropsTable/PropsTable';
import { components } from '../MdxProvider/MdxProvider';
import useRawPath from '@/hooks/use-raw-path';

export function MdxPageTabs({
    data: frontmatter,
    headings,
    siblings,
}: MdxPageProps) {
    const [query, setQuery] = useState('');
    const { classes } = useStyles();
    const mobile = useMediaQuery('(max-width: 500px)');
    const [activeTab, setActiveTab] = useState('docs');
    const hasProps = Array.isArray(frontmatter.props);
    const hasStyles = Array.isArray(frontmatter.styles);
    const Component = useMDXComponent(frontmatter.body.code);
    const { router, rawPath } = useRawPath();

    useEffect(() => {
        const value = router.query.t || 'docs';
        setActiveTab(value as string);
    }, []);

    if (!hasProps && !hasStyles) {
        return null;
    }

    const propsTables = hasProps
        ? frontmatter.props.map((component) => {
              const prefix = frontmatter.componentPrefix;
              const componentName = prefix
                  ? prefix === component
                      ? component
                      : `${prefix}.${component.replace(prefix, '')}`
                  : component;
              return (
                  <div key={component}>
                      <Title
                          order={2}
                          sx={{ fontWeight: 600 }}
                          mb={20}
                          className={classes.title}
                      >
                          {componentName} component props
                      </Title>
                      <PropsTable
                          key={component}
                          component={component}
                          query={query}
                      />
                  </div>
              );
          })
        : null;

    return (
        <MdxPageBase>
            <Tabs
                variant="default"
                value={activeTab}
                onTabChange={(value) => {
                    router.push(
                        {
                            pathname: rawPath,
                            query: {
                                ...(value === 'docs' ? {} : { t: value }),
                            },
                        },
                        undefined,
                        { shallow: true }
                    );

                    setActiveTab(value as string);
                }}
                classNames={{ tabsList: classes.tabsList, tab: classes.tab }}
            >
                <div className={classes.tabsWrapper}>
                    <Tabs.List>
                        <Tabs.Tab value="docs">Documentation</Tabs.Tab>
                        {hasProps && (
                            <Tabs.Tab value="props">
                                {mobile ? 'Props' : 'Component props'}
                            </Tabs.Tab>
                        )}
                        {hasStyles && (
                            <Tabs.Tab value="styles-api">
                                {mobile ? 'Styles' : 'Styles API'}
                            </Tabs.Tab>
                        )}
                    </Tabs.List>
                </div>

                <Tabs.Panel value="docs">
                    <div
                        className={classes.tabContent}
                        style={{
                            display: 'flex',
                            position: 'relative',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div className={classes.main}>
                            <Component components={components}>
                                {frontmatter.body.raw}
                            </Component>
                            <MdxSiblings siblings={siblings} />
                        </div>

                        <div className={classes.tableOfContents}>
                            <TableOfContents headings={headings} withTabs />
                        </div>
                    </div>
                </Tabs.Panel>

                <Tabs.Panel value="props">
                    <div
                        style={{
                            maxWidth: 1178,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginTop: 24,
                        }}
                        className={classes.tabContent}
                    >
                        <TextInput
                            autoFocus
                            icon={<IconSearch size={16} stroke={1.5} />}
                            placeholder="Search props"
                            mb={20}
                            value={query}
                            onChange={(event) =>
                                setQuery(event.currentTarget.value)
                            }
                        />
                        {propsTables}
                    </div>
                </Tabs.Panel>

                {frontmatter.styles && (
                    <Tabs.Panel value="styles-api">
                        <div
                            style={{
                                maxWidth: 1178,
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                marginTop: 24,
                            }}
                            className={classes.tabContent}
                        >
                            <StylesApi components={frontmatter.styles} />
                        </div>
                    </Tabs.Panel>
                )}
            </Tabs>
        </MdxPageBase>
    );
}
