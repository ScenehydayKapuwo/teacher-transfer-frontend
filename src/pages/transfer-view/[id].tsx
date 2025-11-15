import HeaderPage from "@/components/header/page"
import TransferViewComp from "../../components/transfer/transfer_view_comp"
import Sidebar from "@/components/sidenav/page"

const TransferView = () =>{
    return(
        <>

        <div className="flex flex-col h-screen">
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
                    <TransferViewComp/>
                </main>
            </div>
        </div>
            
        </>
    )
}

export default TransferView