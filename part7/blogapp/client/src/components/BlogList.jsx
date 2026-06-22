import Blog from "./Blog";
import { Link } from "react-router-dom";
import {
	Typography,
	List,
	ListItem,
	ListItemText,
	ListItemButton,
	ListItemIcon,
} from "@mui/material";
import RssFeedIcon from "@mui/icons-material/RssFeed";

const BlogList = ({ blogs }) => {
	return (
		<>
			<Typography variant="h2" sx={{ fontSize: 30 }}>
				Blogs
			</Typography>
			<List>
				{blogs
					.sort((a, b) => b.likes - a.likes)
					.map((blog) => (
						<ListItem
							key={blog.id}
							component={Link}
							to={`/blogs/${blog.id}`}
						>
							<ListItemIcon>
								<RssFeedIcon />
							</ListItemIcon>
							<ListItemText
								primary={blog.title}
								secondary={`by ${blog.author}`}
							/>
						</ListItem>
					))}
			</List>
		</>
	);
};

export default BlogList;
