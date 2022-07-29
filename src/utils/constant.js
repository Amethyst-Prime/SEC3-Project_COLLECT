export const USERROLE = {
    ADMIN: 'ADMIN',
    DISTRIBUTOR: "DISTRIBUTOR",
    WORKER: "WORKER",
}


export const TASKSTATE = {
    UNRELEASED: 'UNRELEASED',
    RELEASED: 'RELEASED',
    CONDITION_SATISFIED: 'CONDITION_SATISFIED',
    EXPIRED: 'EXPIRED'
}

export const MERGESTATE={
    IDLE:"Idle",
    PENDING:"Pending",
    SIMILARITY:"Similarity",
    CLUSTER:"Cluster",
    FLUENCY:"Fluency",
    CHOOSEMAIN:"ChooseMain",
    MERGE:"Merge"
}

export const FILETYPE = {
    DESCRIPTION: "DESCRIPTION",
    EXECUTABLE: "EXECUTABLE"
}
export const OPERATION = {
    glance: "glance",
    accept: "accept",
    submit: "submit",
    score: "score",
    follow: "follow"
}
export const TASKTYPE = {
    BUG_EXPLORATION: {label: "Bug探索", value: "BUG_EXPLORATION"},
    FUNCTION_TEST: {label: "功能测试", value: "FUNCTION_TEST"},
    PERFORMANCE_TEST: {label: "性能测试", value: "PERFORMANCE_TEST"},
    USE_CASE_DESIGN: {label: "用例设计", value: "USE_CASE_DESIGN"},
    USE_CASE_EXECUTION: {label: "用例执行", value: "USE_CASE_EXECUTION"}
}

export const SOFTWARECATEGORY = {
    Media: {label: "影音娱乐", value: "Media"},
    Tools: {label: "实用工具", value: "Tools"},
    Social: {label: "社交通讯", value: "Social"},
    Education: {label: "教育", value: "Education"},
    News: {label: "新闻阅读", value: "News"},
    PhotoShop: {label: "拍摄美化", value: "PhotoShop"},
    Food: {label: "美食", value: "Food"},
    Travel: {label: "旅游住宿", value: "Travel"},
    Shopping: {label: "购物比价", value: "Shopping"},
    Business: {label: "商务", value: "Business"},
    Children: {label: "儿童", value: "Children"},
    Finance: {label: "金融理财", value: "Finance"},
    Sports: {label: "运动健康", value: "Sports"},
    Games: {label: "游戏", value: "Games"}
}
export const DEVICE = {
    Android: "Android",
    ios: "ios",
    HarmonyOS: "HarmonyOS",
    windows: "windows",
    macOS: "macOS",
    linux: "linux"
}

export const TASKLEVEL = {
    EASY: {label: "简单", value: "EASY"},
    MIDDLE: {label: "中等", value: "MIDDLE"},
    HARD: {label: "困难", value: "HARD"},
    MISERY: {label: "特难", value: "MISERY"}
}

export const RECOMMENDBASE = {
    USER: {
        value: "user",
        label: "基于用户的协同过滤",
        options: ["Pearson", "Euclidean", "Cosine", "AdjustCosine"]
    },
    TASK: {value: "task", label: "基于任务的协同过滤"},
    LABEL: {value: "label", label: "基于用户标签的推荐"},
}
export const SIMMODEL = {
    LDA: "LDA", LSI: "LSI", TFIDF: "TFIDF"
}
export const USERFEATURE = {
    ABILITY: SOFTWARECATEGORY,
    PREFERENCE: TASKTYPE,
    DEVICE
}
export const TOKEN_TIME_LIMIT = 2 * 60 * 60 * 1000;
