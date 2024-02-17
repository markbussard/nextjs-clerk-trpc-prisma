import { AppNavbar } from '../_components';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout(props: DashboardLayoutProps) {
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
