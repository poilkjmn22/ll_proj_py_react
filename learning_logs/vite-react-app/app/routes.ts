import { type RouteConfig, layout } from "@react-router/dev/routes";

export default [
    layout("routes/layout.tsx", [
        {
            index: true,
            file: "routes/home.tsx"
        },
        {
            path: "register",
            file: "routes/register.tsx",
        },
        {
            path: "login",
            file: "routes/login.tsx",
        },
        {
            path: "topics",
            file: "routes/topics.tsx",
        },
        {
            path: "topics/:topicId",
            file: "routes/topics.$topicId.tsx",
        },
        {
            path: "newTopic/:topicId?",
            file: "routes/newTopic.tsx",
        },
        {
            path: "newEntry/:topicId/:entryId?",
            file: "routes/newEntry.$topicId.tsx",
        },
        {
            path: "*",  // 同时处理 404 和其他未匹配路径
            file: "routes/NotFound.tsx",
        }
    ])
] satisfies RouteConfig;
