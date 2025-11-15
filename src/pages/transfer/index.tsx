import HeaderPage from "@/components/header/page";
import TransferTable from "../../components/transfer/trancomp";
import Sidebar from "@/components/sidenav/page";

const TransferPage = () => {
    return (
        <>

          <div className="flex flex-col h-screen bg-dark">
            {/* Top Header */}
            <HeaderPage />

            {/* Main content area: sidebar + content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 overflow-y-auto">
                    <Sidebar />
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <TransferTable />
                </main>
            </div>
        </div>
    </>
    );
}

export default TransferPage;
