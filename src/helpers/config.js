export const pathInfo = [
  {
    name: "Home",
    path: "/",
    icon: "Home",
  },
  {
    name: "Report",
    path: "report",
    icon: "Activity",
  },
  {
    name: "Dashboard",
    path: "dashboard",
    icon: "Folder",
  },
  {
    name: "Chat Room",
    path: "chatRoom",
    icon: "MessageSquare",
  },
  {
    name: "Document",
    path: "document",
    icon: "FileText",
  },
  {
    name: "Setting",
    path: "setting",
    icon: "Settings",
  },
]

export const getSuggestionItems = (query) => {
  return [
    {
      title: "H1",
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run()
      },
    },
    {
      title: "H2",
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run()
      },
    },
    {
      title: "bold",
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setMark("bold").run()
      },
    },
    {
      title: "italic",
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setMark("italic").run()
      },
    },
    {
      title: "image",
      command: ({ editor, range }) => {
        console.log("call some function from parent")
        editor.chain().focus().deleteRange(range).setNode("paragraph").run()
      },
    },
  ]
    .filter((item) => item.title.toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, 10)
}
