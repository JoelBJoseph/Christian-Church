import { Tab } from "@/app/admin/types"
import { Calendar, ImageIcon, Film, BookOpen, Users } from "lucide-react"

const tabsList: { id: Tab; label: string; icon: React.ComponentType<{ size: number }> }[] = [
    { id: "prayers", label: "Prayers", icon: BookOpen },
    { id: "events", label: "Events", icon: Calendar },
    { id: "photos", label: "Photos", icon: ImageIcon },
    { id: "videos", label: "Videos", icon: Film },
    { id: "users", label: "Users", icon: Users },
]

interface AdminTabsProps {
    activeTab: Tab
    setActiveTab: (tab: Tab) => void
}

export function AdminTabs({ activeTab, setActiveTab }: AdminTabsProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2">
            {tabsList.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs tracking-widest font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                            ? "bg-foreground text-background"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <tab.icon size={14} />
                    {tab.label.toUpperCase()}
                </button>
            ))}
        </div>
    )
}
