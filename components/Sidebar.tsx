"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useRouter, usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatTimestamp } from "@/lib/utils";
import UserSearch from "./UserSearch";
import CreateGroup from "./CreateGroup";

export default function Sidebar() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [showGroup, setShowGroup] = useState(false);

  const conversations = useQuery(api.conversations.listConversations);
  const currentUser = useQuery(api.users.getCurrentUser);

  const activeConvId = pathname.startsWith("/chat/")
    ? pathname.split("/chat/")[1]
    : null;

  const getConversationName = (convo: any) => {
    if (convo.isGroup) return convo.groupName ?? "Group";
    const other = convo.participants.find((p: any) => p?.clerkId !== user?.id);
    return other?.name ?? "Unknown";
  };

  const getConversationAvatar = (convo: any) => {
    if (convo.isGroup) return null;
    const other = convo.participants.find((p: any) => p?.clerkId !== user?.id);
    return other;
  };

  const isOnMobileChatPage = activeConvId && pathname !== "/chat";

  return (
    <>
      {/* Sidebar - hidden on mobile when in a conversation */}
      <aside
        className={`
          w-full md:w-80 lg:w-96 bg-white shadow-lg flex flex-col h-full
          ${isOnMobileChatPage ? "hidden md:flex" : "flex"}
        `}
      >
        {/* Header */}
        <div className="px-4 py-4 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/sign-in" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {user?.fullName ?? user?.username}
                </p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setShowGroup(true);
                  setShowSearch(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                title="New group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="gray"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="7" r="3"></circle>
                  <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"></path>

                  <circle cx="17" cy="9" r="2.5"></circle>
                  <path d="M14 20c0-2.2 1.8-4 4-4 1.2 0 2.3.5 3 1.3"></path>
                </svg>
              </button>
              <button
                onClick={() => {
                  setShowSearch(true);
                  setShowGroup(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                title="New chat"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Search conversations */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Modals / Content */}
        {showSearch ? (
          <UserSearch
            currentUserId={user?.id}
            onClose={() => setShowSearch(false)}
            onSelectUser={async (userId: Id<"users">) => {
              setShowSearch(false);
              // Navigate - the getOrCreateDM will be called in ChatWindow
              router.push(`/chat/new?userId=${userId}`);
            }}
          />
        ) : showGroup ? (
          <CreateGroup
            currentUserId={user?.id}
            onClose={() => setShowGroup(false)}
          />
        ) : (
          /* Conversations List */
          <div className="flex-1 overflow-y-auto">
            {conversations === undefined ? (
              // Loading skeleton
              <div className="p-3 space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl animate-pulse"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium mb-1">
                  No conversations yet
                </p>
                <p className="text-gray-400 text-sm">
                  Click{" "}
                  <button
                    onClick={() => setShowSearch(true)}
                    className="text-blue-500 hover:underline"
                  >
                    +
                  </button>{" "}
                  to start chatting
                </p>
              </div>
            ) : (
              <div className="p-2">
                {conversations.map((convo) => {
                  const name = getConversationName(convo);
                  const avatarUser = getConversationAvatar(convo);
                  const isActive = activeConvId === convo._id;

                  return (
                    <button
                      key={convo._id}
                      onClick={() => router.push(`/chat/${convo._id}`)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left mb-1 ${
                        isActive
                          ? "bg-blue-50 hover:bg-blue-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {avatarUser?.imageUrl ? (
                          <img
                            src={avatarUser.imageUrl}
                            alt={name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                            {convo.isGroup ? "G" : name[0]?.toUpperCase()}
                          </div>
                        )}
                        {/* Online indicator */}
                        {!convo.isGroup && avatarUser?.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                        {convo.isGroup && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span
                            className={`font-semibold text-sm truncate ${isActive ? "text-blue-700" : "text-gray-900"}`}
                          >
                            {name}
                          </span>
                          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                            {convo.lastMessageTime && (
                              <span className="text-xs text-gray-400">
                                {formatTimestamp(convo.lastMessageTime)}
                              </span>
                            )}
                            {convo.unreadCount > 0 && (
                              <span className="bg-blue-500 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1.5">
                                {convo.unreadCount > 99
                                  ? "99+"
                                  : convo.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        <p
                          className={`text-xs truncate ${convo.unreadCount > 0 ? "text-gray-800 font-medium" : "text-gray-400"}`}
                        >
                          {convo.lastMessagePreview ?? "Start a conversation"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
