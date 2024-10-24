import { Sequelize } from "sequelize";
import User from "./user";
import Post from "./post";
import Comment from "./comment";
import MediaLink from "./mediaLink";
import Tag from "./tag";
import PostTag from "./postTag";
import Vote from "./vote";
import Category from "./category";
import PostCategory from "./postCategory";
import Role from "./role";
import UserRole from "./userRole";
import sequelize from "../config/database";
import PostView from "./postView";

// Initialize models
export const models = {
  User,
  Post,
  Comment,
  MediaLink,
  Tag,
  PostTag,
  Vote,
  Category,
  PostCategory,
  Role,
  UserRole,
};

// Define associations

// User has many Posts (One-to-Many)
// A user can author many posts
User.hasMany(Post, { foreignKey: "authorId" });
// A post belongs to one User
Post.belongsTo(User, { foreignKey: "authorId" });

// User has many Comments (One-to-Many)
// A user can write many comments
User.hasMany(Comment, { foreignKey: "authorId" });
// A comment belongs to one User
Comment.belongsTo(User, { foreignKey: "authorId" });

// Post has many Comments (One-to-Many)
// A post can have many comments
Post.hasMany(Comment, { foreignKey: "postId" });
// A comment belongs to one Post
Comment.belongsTo(Post, { foreignKey: "postId" });

// Post has many MediaLinks (One-to-Many)
// A post can have many media links
Post.hasMany(MediaLink, { foreignKey: "postId" });
// A media link belongs to one Post
MediaLink.belongsTo(Post, { foreignKey: "postId" });

// Post belongs to many Tags through PostTag (Many-to-Many)
// A post can have many tags
Post.belongsToMany(Tag, { through: PostTag, foreignKey: "postId" });
// A tag can belong to many posts
Tag.belongsToMany(Post, { through: PostTag, foreignKey: "tagId" });

PostTag.belongsTo(Post, { foreignKey: "postId" });
PostTag.belongsTo(Tag, { foreignKey: "tagId" });

// Post belongs to many Categories through PostCategory (Many-to-Many)
// A post can belong to many categories
Post.belongsToMany(Category, { through: PostCategory, foreignKey: "postId" });
// A category can have many posts
Category.belongsToMany(Post, {
  through: PostCategory,
  foreignKey: "categoryId",
});

PostCategory.belongsTo(Post, { foreignKey: "postId" });

PostCategory.belongsTo(Category, { foreignKey: "categoryId" });

// Post has many Votes (One-to-Many)
// A post can have many votes
Post.hasMany(Vote, { foreignKey: "postId" });
// A vote belongs to one Post
Vote.belongsTo(Post, { foreignKey: "postId" });

// User has many Votes (One-to-Many)
// A user can cast many votes
User.hasMany(Vote, { foreignKey: "userId" });
// A vote belongs to one User
Vote.belongsTo(User, { foreignKey: "userId" });

// Role belongs to many Users through UserRole (Many-to-Many)
Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "roleId",
  otherKey: "userId",
});
// User belongs to many Roles through UserRole (Many-to-Many)
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "userId",
  otherKey: "roleId",
});

UserRole.belongsTo(User, { foreignKey: "userId" });
UserRole.belongsTo(Role, { foreignKey: "roleId" });

// User has many PostViews (One-to-Many)
// A user can view many posts
User.hasMany(PostView, { foreignKey: "userId" });
// A post view belongs to one User
PostView.belongsTo(User, { foreignKey: "userId" });

// Post has many PostViews (One-to-Many)
// A post can have many views
Post.hasMany(PostView, { foreignKey: "postId" });
// A post view belongs to one Post
PostView.belongsTo(Post, { foreignKey: "postId" });

// Self-referential associations
Comment.hasMany(Comment, { as: "replies", foreignKey: "parentId" });
Comment.belongsTo(Comment, { as: "parent", foreignKey: "parentId" });



// Sync models with database
// This will create or alter tables as necessary based on the models
sequelize.sync({ alter: true }).then(() => {
  console.log("Database & tables created!");
});

export default models;
