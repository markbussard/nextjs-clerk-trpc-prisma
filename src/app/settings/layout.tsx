import { AppNavbar } from '../_components';

type SettingsLayoutProps = {
  children: React.ReactNode;
};

export default async function SettingsLayout(props: SettingsLayoutProps) {
  return (
    <>
      <AppNavbar />
      <div className="flex w-full justify-center px-8 py-12">
        <div className="container min-h-[calc(100vh_-_96px)]">
          {props.children}
        </div>
      </div>
    </>
  );
}
