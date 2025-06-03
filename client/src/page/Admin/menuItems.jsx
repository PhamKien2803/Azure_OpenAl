import {
  Article as ArticleIcon,
  BarChart as BarChartIcon,
  ListAlt as ListAltIcon,
} from "@mui/icons-material";
import BlogManagementPage from "./BlogManagementPage";
import ExpertFormManagementPage from "./ExpertFormManagementPage";
import StatisticsPage from "./StatisticsPage";
import BlogDetailPage from "./BlogDetailPage";
import AdminLayout from "./AdminLayout";
import OpenAiChatPage from "./OpenAiChatPage";

const menuItems = [
  {
    text: "Trang chủ",
    icon: <BarChartIcon />,
    path: "/admin-dashboard/statistics",
    component: StatisticsPage,
  },
  {
    text: "Quản lý Blog",
    icon: <ArticleIcon />,
    path: "/admin-dashboard/blogs",
    component: BlogManagementPage,
  },
  {
    text: "Quản lý Yêu cầu hỗ trợ",
    icon: <ListAltIcon />,
    path: "/admin-dashboard/expert-forms",
    component: ExpertFormManagementPage
  },
  {
    path: "/admin-dashboard/blogs-detail/:id",
    component: BlogDetailPage
  },
  {
    text: "OpenAI Chat",
    icon: <ArticleIcon />,
    path: "/admin-dashboard/openai-chat",
    component: OpenAiChatPage
  }
];

export default menuItems;