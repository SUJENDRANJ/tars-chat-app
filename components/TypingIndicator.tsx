"use client";

interface Props {
  users: Array<{ _id: string; name: string; imageUrl?: string }>;
}

export default function TypingIndicator({ users }: Props) {
  if (users.length === 0) return null;

  const names =
    users.length === 1
      ? users[0].name.split(" ")[0]
      : users.length === 2
        ? `${users[0].name.split(" ")[0]} and ${users[1].name.split(" ")[0]}`
        : `${users[0].name.split(" ")[0]} and ${users.length - 1} others`;

  return (
    <div className="flex items-end gap-2 mb-2">
      {users[0]?.imageUrl ? (
        <img
          src={users[0].imageUrl}
          alt={users[0].name}
          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          {users[0]?.name?.[0]?.toUpperCase()}
        </div>
      )}
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        <div className="flex gap-1 items-center">
          <span className="w-2 h-2 rounded-full bg-gray-400 typing-dot inline-block"></span>
          <span className="w-2 h-2 rounded-full bg-gray-400 typing-dot inline-block"></span>
          <span className="w-2 h-2 rounded-full bg-gray-400 typing-dot inline-block"></span>
        </div>
      </div>
      <span className="text-xs text-gray-400 mb-1">
        {names} {users.length === 1 ? "is" : "are"} typing...
      </span>
    </div>
  );
}
