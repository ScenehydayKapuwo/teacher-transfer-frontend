import HeaderPage from "@/components/header/page";
import Sidebar from "@/components/sidenav/page";
import Teacherview from "@/components/teacher/Teacherview";
import { useRouter } from "next/router";

const TransferView = () => {
  const router = useRouter();
  const { id } = router.query; 

  if (!id) {
    return <div className="text-center py-10">No teacher ID in URL</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <HeaderPage />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 overflow-y-auto">
          <Sidebar />
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
           <Teacherview teacherId={id as string} />
        </main>
      </div>
    </div>
  );
};

export default TransferView;
