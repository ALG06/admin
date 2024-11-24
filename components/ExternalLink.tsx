import { Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href as any} // Explicitly cast href
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          event.preventDefault(); // Prevent default browser behavior
          await openBrowserAsync(href); // Open in in-app browser
        }
      }}
    />
  );
}
