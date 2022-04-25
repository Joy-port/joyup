export const pathInfo = [
  {
    name: "Home",
    path: "/",
    icon: "Home",
    component: "Home",
  },
  {
    name: "Report",
    path: "report",
    icon: "Activity",
    component: "Report",
  },
  {
    name: "Dashboard",
    path: "dashboard",
    icon: "Folder",
    component: "Dashboard",
  },
  {
    name: "Chat Room",
    path: "chatroom",
    icon: "MessageSquare",
    component: "ChatRoom",
  },
  // {
  //   name: "Document",
  //   path: "document",
  //   icon: "FileText",
  // },
  {
    name: "Settings",
    path: "settings",
    icon: "Settings",
    component: "TimeSetting",
  },
]
export const viewInfo = [
  {
    name: "List",
    path: "list",
    component: "List",
    type: "list",
  },
  {
    name: "Board",
    path: "board",
    component: "List",
    type: "board",
  },
  {
    name: "Calendar",
    path: "calendar",
    component: "Calendar",
  },
  {
    name: "Map",
    path: "location",
    component: "DragFunction",
  },
  {
    name: "Mind Map",
    path: "mind-map",
    component: "DragFunction",
  },
]

export const TextType = [
  {
    parent: "",
    tag: "p",
    name: "Text",
    style: "",
  },
  {
    parent: "",
    tag: "h1",
    name: "Heading 1",
    style: "heading-one",
  },
  {
    parent: "",
    tag: "h2",
    name: "Heading 2",
    style: "heading-two",
  },
  {
    parent: "",
    tag: "h3",
    name: "Heading 3",
    style: "heading-three",
  },
  {
    parent: "",
    tag: "h4",
    name: "Heading 4",
    style: "heading-four",
  },
  {
    parent: "",
    tag: "h5",
    name: "Heading 5",
    style: "heading-five",
  },
  {
    parent: "",
    tag: "h6",
    name: "Heading 6",
    style: "heading-six",
  },
  {
    parent: "ul",
    tag: "li",
    name: "Bulleted List",
    style: "unordered-list",
  },
  {
    parent: "ol",
    tag: "li",
    name: "Number List",
    style: "ordered-list",
  },
  {
    parent: "",
    tag: "div",
    name: "Quote",
    style: "quote-block",
  },
  {
    parent: "",
    tag: "code",
    name: "Code",
    style: "code-block",
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
