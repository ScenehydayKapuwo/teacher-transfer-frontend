import HeaderPage from "../header/page"
import Sidebar from "../sidenav/page"
import TeachersTable from "../teacher/table"

const TeachersPage = () => {
    return(
        <>
          <div className="flex flex-col h-screen">
            {/* Top Header */}
            <HeaderPage />

            {/* Main content area: sidebar + content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 6overflow-y-auto">
                    <Sidebar />
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <TeachersTable/>
                </main>
            </div>
        </div>  
        </>
    )
}

export default TeachersPage