type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout(props: AuthLayoutProps) {
  return (
    <div className="flex h-screen items-center justify-center px-8">
      {props.children}
    </div>
  );
}
