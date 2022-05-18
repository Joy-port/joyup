export const pathInfo = [
  {
    name: "Home",
    path: "/calendar",
    icon: "Home",
    component: "Home",
  },
  {
    name: "Reports",
    path: "reports",
    icon: "Activity",
    component: "Report",
  },
  {
    name: "Projects",
    path: "projects",
    icon: "Folder",
    component: "Projects",
  },
  // {
  //   name: "Settings",
  //   path: "settings",
  //   icon: "Settings",
  //   component: "Settings",
  // },
]
export const viewInfo = [
  {
    name: "List",
    path: "list",
    icon: "List",
    component: "List",
    type: "list",
  },
  {
    name: "Board",
    path: "board",
    icon: "Columns",
    component: "List",
    type: "board",
  },
  {
    name: "Calendar",
    path: "calendar",
    icon: "Calendar",
    component: "Calendar",
  },
  // {
  //   name: "Map",
  //   path: "location",
  //   icon: "MapPin",
  //   component: "DragFunction",
  // },
  // {
  //   name: "Mind Map",
  //   path: "mind-map",
  // icon: "MapPin",
  //   component: "DragFunction",
  // },
]

export const checkLoginMessage = {
  name: {
    icon: "User",
    name: "Full Name",
    type: "text",
    label: "name",
    required: "Full name required! ",
    warning: "",
    error: "",
  },
  email: {
    icon: "Mail",
    name: "Email",
    type: "email",
    label: "email",
    required: "Email required!",
    error: "This email is invalid!",
    hasSignedUp: "This email has Signed up",
    success: "Email is valid!",
  },
  password: {
    icon: "Lock",
    name: "Password",
    type: "password",
    label: "password",
    required: "Password required!",
    lengthError: "Must be at least 6 characters",
    success: "",
    warning: "",
    error: "",
  },
}
export const checkProjectMessage = {
  createEmptyProject: {
    required: "Project title is required!",
    lengthError: "Must be at least 6 characters",
  },
  editClockWorkTime: {
    required: "minutes is required!",
    lengthError: "Must be less than 480 minutes",
    notNumber: "please fill in numbers",
  },
}

export const TextType = [
  {
    combine: false,
    parent: "",
    tag: "p",
    name: "Text",
    style: "",
    icon: "Type",
    iconWidth: 1,
    iconSize: 24,
  },
  {
    combine: false,
    parent: "",
    tag: "h1",
    name: "Heading 1",
    style: "heading-one",
    icon: "Type",
    iconWidth: 4,
    iconSize: 24,
  },
  {
    combine: false,
    parent: "",
    tag: "h2",
    name: "Heading 2",
    style: "heading-two",
    icon: "Type",
    iconWidth: 3,
    iconSize: 24,
  },
  {
    combine: false,
    parent: "",
    tag: "h3",
    name: "Heading 3",
    style: "heading-three",
    icon: "Type",
    iconWidth: 3,
    iconSize: 24,
  },
  {
    combine: false,
    parent: "",
    tag: "h4",
    name: "Heading 4",
    style: "heading-four",
    icon: "Type",
    iconWidth: 2,
    iconSize: 24,
  },
  {
    combine: false,
    parent: "ul",
    tag: "li",
    name: "Bulleted List",
    style: "unordered-list pl-5",
    icon: "List",
    iconWidth: 1,
    iconSize: 24,
  },
  {
    combine: false,
    parent: "ol",
    tag: "li",
    name: "Number List",
    style: "ordered-list",
    icon: "List",
    iconWidth: 1,
    iconSize: 24,
  },
  {
    combine: false,
    parent: "",
    tag: "div",
    name: "Quote",
    style: "quote-block",
    icon: "MessageCircle",
    iconWidth: 1,
    iconSize: 24,
  },
  {
    combine: false,
    parent: "",
    tag: "code",
    name: "Code",
    style: "code-block",
    icon: "Code",
    iconWidth: 1,
    iconSize: 24,
  },
  {
    combine: true,
    parent: "",
    tag: "div",
    name: "Underline",
    style: "underline underline-offset-2",
    icon: "Underline",
    iconWidth: 1,
    iconSize: 24,
  },
  {
    combine: true,
    parent: "",
    tag: "div",
    name: "Bold",
    style: "font-semibold",
    icon: "Bold",
    iconWidth: 2,
    iconSize: 24,
  },
  {
    combine: true,
    parent: "",
    tag: "div",
    name: "Italic",
    style: "italic",
    icon: "Italic",
    iconWidth: 1,
    iconSize: 24,
  },
]

export const defaultTypes = ["BjCJ9brvUXkru0jJYZ6c", "Y3ScZ3EP9hhO7PB0EkJU"]

export const defaultTags = {
  BjCJ9brvUXkru0jJYZ6c: [
    "8VKRmmsi1KOm9QtiraSl",
    "hH5M4VZKHGyheC4QID2n",
    "LqoN88hEwKS5ttU283yU",
    "ZT9kq2hhregSKPmVcEHh",
    "yEFXbvDC5slJxmMVOp3D",
  ],
  Y3ScZ3EP9hhO7PB0EkJU: [
    "l0Du2A7l5CUCJLnmRZuP",
    "7qzOkGy3a0F6kgDqu5ma",
    "mkPSjbSrFD7ert0HosMg",
    "b0htJEJVP9noZU8Tx200",
  ],
  "8VKRmmsi1KOm9QtiraSl": [],
  LqoN88hEwKS5ttU283yU: [],
  ZT9kq2hhregSKPmVcEHh: [],
  hH5M4VZKHGyheC4QID2n: [],
  yEFXbvDC5slJxmMVOp3D: [],
  l0Du2A7l5CUCJLnmRZuP: [],
  "7qzOkGy3a0F6kgDqu5ma": [],
  mkPSjbSrFD7ert0HosMg: [],
  b0htJEJVP9noZU8Tx200: [],
}

export const create = {
  tags: [
    {
      createdBy: "0",
      id: "7qzOkGy3a0F6kgDqu5ma",
      index: 1,
      name: "to do",
      parent: "Y3ScZ3EP9hhO7PB0EkJU",
      type: "progress",
    },
    {
      createdBy: "0",
      id: "8VKRmmsi1KOm9QtiraSl",
      index: 0,
      name: "no tags",
      parent: "BjCJ9brvUXkru0jJYZ6c",
      type: "priority",
    },
    {
      createdBy: "0",
      id: "BjCJ9brvUXkru0jJYZ6c",
      index: -1,
      name: "priority",
      parent: "",
      type: "priority",
    },
    {
      createdBy: "0",
      id: "LqoN88hEwKS5ttU283yU",
      index: 2,
      name: "high",
      parent: "BjCJ9brvUXkru0jJYZ6c",
      type: "priority",
    },
    {
      createdBy: "0",
      id: "Y3ScZ3EP9hhO7PB0EkJU",
      index: -1,
      name: "progress",
      parent: "",
      type: "progress",
    },
    {
      createdBy: "0",
      id: "ZT9kq2hhregSKPmVcEHh",
      index: 3,
      name: "normal",
      parent: "BjCJ9brvUXkru0jJYZ6c",
      type: "priority",
    },
    {
      createdBy: "0",
      id: "b0htJEJVP9noZU8Tx200",
      index: 3,
      name: "done",
      parent: "Y3ScZ3EP9hhO7PB0EkJU",
      type: "progress",
    },
    {
      createdBy: "0",
      id: "hH5M4VZKHGyheC4QID2n",
      index: 1,
      name: "urgent",
      parent: "BjCJ9brvUXkru0jJYZ6c",
      type: "priority",
    },
    {
      createdBy: "0",
      id: "l0Du2A7l5CUCJLnmRZuP",
      index: 0,
      name: "no tags",
      parent: "Y3ScZ3EP9hhO7PB0EkJU",
      type: "progress",
    },
    {
      createdBy: "0",
      id: "mkPSjbSrFD7ert0HosMg",
      index: 2,
      name: "in progress",
      parent: "Y3ScZ3EP9hhO7PB0EkJU",
      type: "progress",
    },
    {
      createdBy: "0",
      id: "yEFXbvDC5slJxmMVOp3D",
      index: 4,
      name: "low",
      parent: "BjCJ9brvUXkru0jJYZ6c",
      type: "priority",
    }, //this is the all default
  ],
  project: {
    title: "",
    users: [],
    tasks: [],
    tags: [...defaultTypes],
    ...defaultTags,
    currentType: defaultTypes[0],
  },
  settings: {
    clockSettings: {
      base: 15,
      breakTime: 1,
      workTime: 3,
    },
  },
  userProjectList: {
    collaborateProjects: [],
    ownerProjects: [],
  },
}

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
        // console.log("call some function from parent")
        editor.chain().focus().deleteRange(range).setNode("paragraph").run()
      },
    },
  ]
    .filter((item) => item.title.toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, 10)
}