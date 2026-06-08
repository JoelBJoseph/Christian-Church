import { motion } from "framer-motion"
import { Users, Shield, ShieldOff, Ban, Trash2 } from "lucide-react"
import { UserItem } from "@/app/admin/types"

interface UserListProps {
    users: UserItem[]
    onRoleChange: (userId: string, currentRole: "ADMIN" | "USER") => void
    onToggleBan: (userId: string, currentBanStatus: boolean) => void
    onDelete: (userId: string) => void
}

export function UserList({ users, onRoleChange, onToggleBan, onDelete }: UserListProps) {
    if (users.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-muted-foreground"
            >
                <Users size={40} className="mx-auto mb-4 opacity-40" />
                <p className="text-sm">No users found.</p>
            </motion.div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {users.map((u) => (
                <div key={u.id} className={`bg-secondary rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${u.isBanned ? "opacity-60" : ""}`}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-lg font-medium">
                            {u.name?.[0] || u.email[0].toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-medium flex items-center gap-2">
                                {u.name || "Unnamed User"}
                                {u.role === "ADMIN" && <Shield size={14} className="text-accent" />}
                                {u.isBanned && <span className="text-[10px] bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded uppercase tracking-tighter">Banned</span>}
                            </h3>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 self-end md:self-auto">
                        <button
                            onClick={() => onRoleChange(u.id, u.role)}
                            className={`p-2 rounded-lg transition-colors ${u.role === "ADMIN" ? "text-accent hover:bg-accent/10" : "text-muted-foreground hover:bg-foreground/5"}`}
                            title={u.role === "ADMIN" ? "Revoke Admin" : "Make Admin"}
                        >
                            {u.role === "ADMIN" ? <ShieldOff size={18} /> : <Shield size={18} />}
                        </button>
                        
                        <button
                            onClick={() => onToggleBan(u.id, u.isBanned)}
                            className={`p-2 rounded-lg transition-colors ${u.isBanned ? "text-destructive hover:bg-destructive/10" : "text-muted-foreground hover:bg-foreground/5"}`}
                            title={u.isBanned ? "Unban User" : "Ban User"}
                        >
                            <Ban size={18} />
                        </button>

                        <button
                            onClick={() => onDelete(u.id)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Delete User"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
