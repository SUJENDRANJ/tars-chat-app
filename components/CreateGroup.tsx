"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface Props {
  currentUserId?: string;
  onClose: () => void;
}

export default function CreateGroup({ onClose }: Props) {
  const [groupName, setGroupName] = useState("");
  const [selected, setSelected] = useState<Id<"users">[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const users = useQuery(api.users.listUsers, { search: search || undefined });
  const createGroup = useMutation(api.conversations.createGroup);

  const toggleUser = (id: Id<"users">) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selected.length < 1) return;
    try {
      const convId = await createGroup({ memberIds: selected, groupName: groupName.trim() });
      router.push(`/chat/${convId}`);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white shadow-sm">
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-semibold text-gray-900">New Group</span>
      </div>

      {/* Group name */}
      <div className="px-4 py-3 bg-white">
        <input
          autoFocus
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group name..."
          className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors shadow-sm"
        />
      </div>

      {/* Selected users */}
      {selected.length > 0 && (
        <div className="px-4 py-2 bg-blue-50">
          <p className="text-xs text-gray-400 mb-2">{selected.length} selected</p>
        </div>
      )}

      {/* Search */}
      <div className="px-4 py-3 bg-white shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Add members..."
          className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none relative"
          style={{ backgroundImage: "none" }}
        />
      </div>

      {/* Users list */}
      <div className="flex-1 overflow-y-auto p-2">
        {users?.map((u) => (
          <button
            key={u._id}
            onClick={() => toggleUser(u._id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
              selected.includes(u._id) ? "bg-blue-50" : "hover:bg-gray-50"
            }`}
          >
            <div className="relative flex-shrink-0">
              {u.imageUrl ? (
                <img src={u.imageUrl} alt={u.name} className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {u.name[0]?.toUpperCase()}
                </div>
              )}
              {selected.includes(u._id) && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{u.name}</p>
              <p className="text-xs text-gray-400">{u.isOnline ? "Online" : "Offline"}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Create button */}
      <div className="p-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <button
          onClick={handleCreate}
          disabled={!groupName.trim() || selected.length < 1}
          className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Create Group ({selected.length} members)
        </button>
      </div>
    </div>
  );
}
