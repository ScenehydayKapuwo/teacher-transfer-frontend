import HomePage from "../../components/home/page"
import HeaderPage from "../../components/header/page"
import Sidebar from "@/components/sidenav/page"
const Home = () => {
    return (
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
                    <HomePage/>
                </main>
            </div>
        </div>
        </>
    )
}

export default Home