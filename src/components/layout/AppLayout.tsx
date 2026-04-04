import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />
      <main className="ml-[240px] mt-[56px] p-6">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
