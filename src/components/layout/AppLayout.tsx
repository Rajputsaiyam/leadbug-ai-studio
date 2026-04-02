import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />
      <main className="ml-[60px] mt-[56px] p-6">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
