import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import type { ComponentProps } from 'react';
import { Platform } from 'react-native';

export function ExternalLink(
  props: Omit<ComponentProps<typeof Link>, 'href'> & {
    href: ComponentProps<typeof Link>['href'];
  },
) {
  const href = typeof props.href === 'string' ? props.href : String(props.href);

  return (
    <Link
      target="_blank"
      {...props}
      href={props.href}
      onPress={(e) => {
        if (Platform.OS !== 'web') {
          e.preventDefault();
          WebBrowser.openBrowserAsync(href);
        }
      }}
    />
  );
}
